import { Elysia, t } from "elysia";
import { db } from "@/db";
import { testimonial, testimonialLink, subscription, user } from "@/db/schema";
import { eq, and, inArray, sql, count } from "drizzle-orm";
import { auth } from "@/lib/auth";

const app = new Elysia({ prefix: "/api" })
  .group("/public", (app) =>
    app.post(
      "/testimonial",
      async ({ body, set }) => {
        const linkExists = await db.query.testimonialLink.findFirst({
          where: eq(testimonialLink.id, body.testimonialLinkId),
        });

        if (!linkExists) {
          set.status = 400;
          return { error: "Invalid testimonial link." };
        }

        await db.insert(testimonial).values({
          id: crypto.randomUUID(),
          testimonialLinkId: body.testimonialLinkId,
          customerName: body.customerName,
          customerRole: body.customerRole,
          content: body.content,
          rating: body.rating,
          status: "pending",
        });

        return { success: true };
      },
      {
        body: t.Object({
          testimonialLinkId: t.String(),
          customerName: t.String(),
          customerRole: t.String(),
          content: t.String(),
          rating: t.Integer({ minimum: 1, maximum: 5 }),
        }),
      }
    )
  )
  .group("/dashboard", (app) =>
    app
      .derive(async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        console.log(session);

        if (!session?.user) {
          throw new Error("Unauthorized");
        }

        return { user: session.user };
      })
      .post(
        "/new-link",
        async ({ user, body, set }) => {
          const [userSub, linksCount] = await Promise.all([
            db.query.subscription.findFirst({
              where: eq(subscription.userId, user.id),
            }),
            db.query.testimonialLink
              .findMany({
                where: eq(testimonialLink.userId, user.id),
              })
              .then((res) => res.length),
          ]);

          const isPremium = userSub?.status === "active";

          if (!isPremium && linksCount >= 2) {
            set.status = 403;
            return {
              error:
                "Free tier limit reached (2 testimonial links). Upgrade to Premium.",
            };
          }

          const slugClean = body.slug.toLowerCase().trim().replace(/\s+/g, "-");

          const slugTaken = await db.query.testimonialLink.findFirst({
            where: eq(testimonialLink.slug, slugClean),
          });

          if (slugTaken) {
            set.status = 400;
            return { error: "Slug already in use." };
          }

          const [newLink] = await db
            .insert(testimonialLink)
            .values({
              id: crypto.randomUUID(),
              userId: user.id,
              title: body.title,
              description: body.description,
              slug: slugClean,
            })
            .returning();

          return newLink;
        },
        {
          body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            slug: t.String(),
          }),
        }
      )
      .get("/testimonials", async ({ user }) => {
        const links = await db.query.testimonialLink.findMany({
          where: eq(testimonialLink.userId, user.id),
          columns: { id: true },
        });

        if (links.length === 0) return [];

        return await db.query.testimonial.findMany({
          where: inArray(
            testimonial.testimonialLinkId,
            links.map((l) => l.id)
          ),
          orderBy: (t, { desc }) => [desc(t.createdAt)],
        });
      })
      .get("/links", async ({ user }) => {
        const result = await db
          .select({
            id: testimonialLink.id,
            slug: testimonialLink.slug,
            title: testimonialLink.title,
            description: testimonialLink.description,
            isActive: testimonialLink.isActive,
            createdAt: testimonialLink.createdAt,
            testimonialCount: count(testimonial.id),
            averageRating:
              sql<number>`COALESCE(AVG(${testimonial.rating}), 0)`.mapWith(
                Number
              ),
          })
          .from(testimonialLink)
          .leftJoin(
            testimonial,
            eq(testimonial.testimonialLinkId, testimonialLink.id)
          )
          .where(eq(testimonialLink.userId, user.id))
          .groupBy(testimonialLink.id)
          .orderBy(sql`${testimonialLink.createdAt} DESC`);

        return result;
      })
      .get(
        "/link/:slug",
        async ({ user: authUser, params, query }) => {
          // 1. Buscamos el link, sus estadísticas Y la info del dueño (user)
          const linkResult = await db
            .select({
              id: testimonialLink.id,
              slug: testimonialLink.slug,
              title: testimonialLink.title,
              description: testimonialLink.description,
              isActive: testimonialLink.isActive,
              createdAt: testimonialLink.createdAt,
              testimonialCount: count(testimonial.id),
              averageRating:
                sql<number>`COALESCE(AVG(${testimonial.rating}), 0)`.mapWith(
                  Number
                ),
              user: {
                name: user.name,
              },
            })
            .from(testimonialLink)
            .innerJoin(user, eq(testimonialLink.userId, user.id))
            .leftJoin(
              testimonial,
              eq(testimonial.testimonialLinkId, testimonialLink.id)
            )
            .where(
              and(
                eq(testimonialLink.userId, authUser.id),
                eq(testimonialLink.slug, params.slug)
              )
            )
            .groupBy(testimonialLink.id, user.id)
            .limit(1);

          const linkData = linkResult[0];

          const limit = Number(query.limit) || 10;
          const offset = Number(query.offset) || 0;

          const testimonials = await db.query.testimonial.findMany({
            where: eq(testimonial.testimonialLinkId, linkData.id),
            orderBy: (t, { desc }) => [desc(t.createdAt)],
            limit: limit,
            offset: offset,
          });

          return {
            ...linkData,
            testimonials,
            pagination: {
              limit,
              offset,
              hasMore: testimonials.length === limit,
            },
          };
        },
        {
          params: t.Object({
            slug: t.String(),
          }),
          query: t.Object({
            limit: t.Optional(t.Numeric()),
            offset: t.Optional(t.Numeric()),
          }),
        }
      )
  );

export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
