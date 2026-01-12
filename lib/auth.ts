/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { eq } from "drizzle-orm";
import { username } from "better-auth/plugins";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const email = user.email;
          const baseSlug = email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          let finalSlug = baseSlug;
          let counter = 1;
          let exists = true;

          while (exists) {
            const existingUser = await db.query.user.findFirst({
              where: (fields, { eq }) => eq(fields.username, finalSlug),
            });

            if (!existingUser) {
              exists = false;
            } else {
              finalSlug = `${baseSlug}${counter}`;
              counter++;
            }
          }

          return {
            data: {
              ...user,
              username: finalSlug,
            },
          };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.POLAR_PREMIUM_PRODUCT_ID!,
              slug: "trustbadge",
            },
          ],
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionCreated: async ({ data }) => {
            const userId = data.customer.externalId;
            if (!userId) return;

            if (!data.currentPeriodStart || !data.currentPeriodEnd) {
              console.error("Subscription missing periods", data.id);
              return;
            }

            await db
              .insert(schema.subscription)
              .values({
                id: data.id,
                userId: userId,
                planId: data.productId,
                customerId: data.customerId,
                status: data.status as any,
                currentPeriodStart: new Date(data.currentPeriodStart),
                currentPeriodEnd: new Date(data.currentPeriodEnd),
                cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
              })
              .onConflictDoUpdate({
                target: schema.subscription.id,
                set: {
                  status: data.status as any,
                  currentPeriodEnd: new Date(data.currentPeriodEnd),
                  updatedAt: new Date(),
                },
              });
          },
          onSubscriptionUpdated: async ({ data }) => {
            const updateData: any = {
              status: data.status as any,
              cancelAtPeriodEnd: data.cancelAtPeriodEnd,
              updatedAt: new Date(),
            };

            if (data.currentPeriodEnd) {
              updateData.currentPeriodEnd = new Date(data.currentPeriodEnd);
            }

            await db
              .update(schema.subscription)
              .set(updateData)
              .where(eq(schema.subscription.id, data.id));
          },
        }),
      ],
    }),
    username(),
  ],
});
