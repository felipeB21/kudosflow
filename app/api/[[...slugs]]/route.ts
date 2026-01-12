import { Elysia, t } from "elysia";
import { db } from "@/db";
import { testimonial, projectSetting, user, subscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

const app = new Elysia({ prefix: "/api" })
  .group("/public", (app) =>
    app
      .get("/project/:slug", async ({ params }) => {
        const project = await db.query.projectSetting.findFirst({
          where: eq(projectSetting.slug, params.slug),
          with: { user: true },
        });
        return project || { error: "Not found" };
      })
      .get(
        "/testimonials",
        async ({ query }) => {
          return await db.query.testimonial.findMany({
            limit: query.limit,
            offset: query.offset,
            with: {
              user: true,
            },
          });
        },
        {
          query: t.Object({
            limit: t.Numeric({ default: 10 }),
            offset: t.Numeric({ default: 0 }),
          }),
        }
      )
      .get("/user/:username", async ({ params: { username }, set }) => {
        const data = await db.query.user.findFirst({
          where: eq(user.username, username),
        });
        if (!data) {
          set.status = 404;
          return { error: "User not found" };
        }

        return data;
      })
      .post(
        "/testimonial",
        async ({ body }) => {
          return await db.insert(testimonial).values({
            id: crypto.randomUUID(),
            ...body,
            status: "pending",
          });
        },
        {
          body: t.Object({
            userId: t.String(),
            customerName: t.String(),
            content: t.String(),
            rating: t.Optional(t.Integer()),
            customerRole: t.Optional(t.String()),
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
        if (!session?.user) {
          throw new Error("Unauthorized");
        }
        return { user: session.user };
      })
      .post(
        "/new-project",
        async ({ user, body, set }) => {
          const [userSub, userProjectsCount] = await Promise.all([
            db.query.subscription.findFirst({
              where: eq(subscription.userId, user.id),
            }),
            db.query.projectSetting
              .findMany({
                where: eq(projectSetting.userId, user.id),
              })
              .then((res) => res.length),
          ]);

          const isPremium = userSub?.status === "active";

          if (!isPremium && userProjectsCount >= 2) {
            set.status = 403;
            return {
              error:
                "Free tier limit reached (2 projects). Upgrade to Premium for unlimited projects.",
            };
          }

          if (body.customDomain && body.customDomain.trim() !== "") {
            const domainClean = body.customDomain.toLowerCase().trim();

            if (!isPremium) {
              set.status = 403;
              return { error: "Custom domains are a premium feature." };
            }

            const domainTaken = await db.query.projectSetting.findFirst({
              where: eq(projectSetting.customDomain, domainClean),
            });

            if (domainTaken) {
              set.status = 400;
              return { error: "This custom domain is already in use." };
            }

            body.customDomain = domainClean;
          }

          const slugClean = body.slug.toLowerCase().trim().replace(/\s+/g, "-");
          const slugTaken = await db.query.projectSetting.findFirst({
            where: eq(projectSetting.slug, slugClean),
          });

          if (slugTaken) {
            set.status = 400;
            return { error: "Slug already in use." };
          }

          try {
            const [newProject] = await db
              .insert(projectSetting)
              .values({
                id: crypto.randomUUID(),
                userId: user.id,
                ...body,
                slug: slugClean,
              })
              .returning();

            return newProject;
          } catch (error) {
            console.error(error);
            set.status = 500;
            return { error: "Internal server error" };
          }
        },
        {
          body: t.Object({
            title: t.String(),
            description: t.String(),
            slug: t.String(),
            customDomain: t.Optional(t.String()),
            themeColor: t.Optional(t.String()),
          }),
        }
      )
      .get("/testimonials", async ({ user }) => {
        return await db.query.testimonial.findMany({
          where: eq(testimonial.userId, user.id),
        });
      })
  );
export const GET = app.fetch;
export const POST = app.fetch;
export type App = typeof app;
