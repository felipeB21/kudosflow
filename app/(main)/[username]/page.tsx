import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { publicApi } from "@/lib/api";
import { isUserPremium } from "@/utils/permissions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

type Props = {
  params: Promise<{ username: string }>;
};

const getUser = cache(async (usernameParam: string) => {
  "use cache";
  const decoded = decodeURIComponent(usernameParam);
  if (!decoded.startsWith("@")) return null;

  const cleanUsername = decoded.replace("@", "");
  try {
    const { data } = await publicApi.user({ username: cleanUsername }).get();
    if (!data || "error" in data) return null;
    return data;
  } catch (err) {
    console.log(err);

    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  const { username } = await params;
  const user = await getUser(username);
  if (!user) return { title: "User Not Found" };

  return {
    title: `${user.name} (@${user.username}) - KudosFlow`,
    description: `Explore the testimonials and profile of ${user.name} on KudosFlow.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileDetails paramsPromise={params} />
    </Suspense>
  );
}

async function ProfileDetails({
  paramsPromise,
}: {
  paramsPromise: Promise<{ username: string }>;
}) {
  const { username } = await paramsPromise;
  const user = await getUser(username);
  if (!user) notFound();
  const isPremium = await isUserPremium(user.id);

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        {user.image && (
          <UserAvatar
            user={user}
            width={100}
            height={100}
            isPremium={isPremium}
          />
        )}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
          <span className="text-lg font-medium text-stone-500 dark:text-stone-400">
            @{user.username}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="w-58 h-6 " />
          <Skeleton className="w-50 h-4 " />
        </div>
      </div>
    </div>
  );
}
