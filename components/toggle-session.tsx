import { getServerSession } from "@/lib/auth-server";
import Link from "next/link";
import { UserDropdownMenu } from "./user-dropdown";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

export function ToggleSession() {
  return (
    <Suspense fallback={<SessionFallback />}>
      <SessionGate />
    </Suspense>
  );
}

async function SessionGate() {
  const data = await getServerSession();

  if (!data?.session) {
    return (
      <Link href="/auth">
        <button className="px-8 py-3 rounded-full dark:bg-white dark:text-black bg-black text-white font-medium w-full cursor-pointer">
          Get Started
        </button>
      </Link>
    );
  }

  return <UserDropdownMenu user={data.user} />;
}

function SessionFallback() {
  return <Skeleton className="w-full h-10" />;
}
