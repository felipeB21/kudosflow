import { db } from "@/db";
import { subscription } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserPlan(userId: string) {
    const sub = await db.query.subscription.findFirst({
        where: and(
            eq(subscription.userId, userId),
            eq(subscription.status, 'active') 
        )
    });

    if (sub) {
        return {
            id: 'premium',
            name: 'Premium Plan',
            isPro: true,
            features: {
                customDomain: true,
                analytics: true,
                maxTestimonials: 1000
            }
        };
    }

    return {
        id: 'free',
        name: 'Free Plan',
        isPro: false,
        features: {
            customDomain: false,
            analytics: false,
            maxTestimonials: 10
        }
    };
}