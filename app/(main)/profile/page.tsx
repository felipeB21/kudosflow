import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/user-avatar";
import { getServerSession } from "@/lib/auth-server";
import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { privateApi } from "@/lib/api";
import Link from "next/link";
import { headers } from "next/headers";
import { PencilLine, StarIcon } from "lucide-react";
import EditUsername from "@/components/edit-username";

export const metadata: Metadata = {
  title: "Profile - KudosFlow",
};

export default function Profile() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserData />
      </Suspense>
      <Separator className="my-10" />
      <Suspense fallback={<TestimonialLinkSkeleton />}>
        <TestimonialLinks />
      </Suspense>
    </div>
  );
}

export async function UserData() {
  "use cache: private";
  const session = await getServerSession();
  if (!session) redirect("/auth");
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <UserAvatar user={session.user} height={100} width={100} />
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-full">
          <h1 className="text-3xl font-bold">{session?.user.name}</h1>

          <div className="absolute left-[calc(100%+0.5rem)]">
            <EditUsername values={session.user} />
          </div>
        </div>
        <span className="font-medium dark:text-stone-300 text-stone-700">
          @{session?.user.username}
        </span>
      </div>
    </div>
  );
}

export function UserSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Skeleton className="w-32 h-32 rounded-full" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
}

export async function TestimonialLinks() {
  "use cache: private";
  const reqHeaders = await headers();

  const { data, error } = await privateApi.links.get({
    headers: Object.fromEntries(reqHeaders.entries()),
  });

  if (error) {
    console.error(error);
    return <div>Error</div>;
  }

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-5">
        {data?.map((dta) => (
          <Link
            href={`/p/${dta.slug}`}
            key={dta.id}
            className="flex flex-col gap-5 dark:bg-stone-900/40 bg-stone-100/40 rounded p-3"
          >
            <div className="flex justify-between">
              <div>
                <h5 className="font-medium text-sm dark:text-stone-400 text-stone-600">
                  {dta.slug}
                </h5>
                <div className="flex flex-col">
                  <h2 className="fotn-bold">{dta.title}</h2>
                  <span className="text-xs dark:text-stone-300 text-stone-700">
                    {dta.description}
                  </span>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <div className="flex items-center gap-1">
                  <PencilLine className="w-3 h-3" />
                  <span className="text-xs">{dta.testimonialCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3" />
                  <span className="text-xs">{dta.averageRating}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export function TestimonialLinkSkeleton() {
  const skeletons = Array.from({ length: 2 });
  return (
    <ul className="flex flex-col gap-5">
      {skeletons.map((_, index) => (
        <li key={index}>
          <Skeleton className="w-full h-21 rounded" />
        </li>
      ))}
    </ul>
  );
}
