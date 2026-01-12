import { db } from '@/db' 
import { eq } from 'drizzle-orm'
import { subscription } from '@/db/schema'

export const isUserPremium = async (userId: string) => {
  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.userId, userId)
  });

  if (!sub) return false;


  const isValid = 
    sub.status === 'active' || 
    (sub.status === 'canceled' && sub.currentPeriodEnd > new Date());

  return isValid;
}