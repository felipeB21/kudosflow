import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

export default function ProjectSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Skeleton className="w-74 h-7" />
      <Skeleton className="w-64 h-4" />
      <div className="mt-3 flex flex-col items-center gap-2">
        <Skeleton className="w-14 h-3" />
        <Separator />
        <Skeleton className="w-22 h-3" />
      </div>
    </div>
  );
}
