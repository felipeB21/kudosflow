import { privateApi } from "@/lib/api";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import ProjectSkeleton from "@/components/project-skeleton";
import { CopyLinkButton } from "@/components/copy-link";
import { PencilLine, Star } from "lucide-react";

export default async function ProjectSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="w-full">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectData paramsPromise={params} />
      </Suspense>
    </div>
  );
}

export async function ProjectData({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;

  const reqHeaders = await headers();
  const { data, error } = await privateApi.link({ slug }).get({
    headers: Object.fromEntries(reqHeaders.entries()),
    query: {
      limit: 10,
      offset: 0,
    },
  });

  if (error || !data) {
    return <div>Testimonial page doest exists or is isent yours.</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <CopyLinkButton slug={data.slug} />
        <h1 className="text-4xl font-bold">{data.title}</h1>
        <p>{data.description}</p>
        <div className="mt-3 flex flex-col items-center">
          <h2 className="font-medium">{data.slug}</h2>
          <Separator />
          <p className="text-sm">{data.user.name}</p>
        </div>
        <div className="mt-5 flex items-center gap-5">
          <div className="flex items-center gap-2">
            <PencilLine className="w-5 h-5" />
            <span>{data.testimonialCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span>{data.averageRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
