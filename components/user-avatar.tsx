import { CrownIcon } from "lucide-react";
import Image from "next/image";

export default function UserAvatar({
  user,
  width,
  height,
  isPremium,
}: {
  user: {
    name?: string | null;
    image?: string | null;
  };
  isPremium?: boolean;
  width: number;
  height: number;
}) {
  return (
    <div className="relative">
      <Image
        src={user.image || ""}
        alt={`Avatar of ${user.name}`}
        width={width}
        height={height}
        className="rounded-full aspect-square object-cover border-2 border-stone-200 dark:border-stone-800"
        priority
      />
      {isPremium && (
        <span className="absolute -end-1 -top-1">
          <span className="sr-only">Premium</span>
          <CrownIcon />
        </span>
      )}
    </div>
  );
}
