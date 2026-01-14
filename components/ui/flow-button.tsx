"use client";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export function FlowButton({
  text = "Modern Button",
  isPending = false,
}: {
  text?: string;
  isPending: boolean;
}) {
  return (
    <button
      disabled={isPending}
      className={clsx(
        `
        group relative flex items-center gap-1 overflow-hidden w-full px-8 py-3
        rounded-[100px] border-[1.5px] text-sm font-semibold
        transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]
        active:scale-[0.95]

        border-stone-800/20 bg-transparent text-stone-900
        dark:border-white/20 dark:text-white
        `,
        isPending &&
          `
          opacity-50
          cursor-not-allowed
          pointer-events-none
        `
      )}
    >
      {/* Left arrow */}
      <ArrowRight
        className={clsx(
          `
          absolute w-4 h-4 left-[-25%] z-[9]
          transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
          stroke-stone-900 dark:stroke-white
          group-hover:left-4 group-hover:stroke-white
          dark:group-hover:stroke-stone-900
          `,
          isPending && "opacity-0"
        )}
      />

      <span
        className={clsx(
          `
    relative z-[10]
    -translate-x-3
    transition-all duration-[800ms] ease-out
    `,
          !isPending && "group-hover:translate-x-3",
          isPending
            ? "text-stone-500 dark:text-stone-400"
            : `
          text-stone-900 dark:text-white
          group-hover:text-white
          dark:group-hover:text-stone-900
        `
        )}
      >
        {isPending ? "Processing..." : text}
      </span>

      <span
        className={clsx(
          `
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-4 h-4 rounded-full opacity-0
          transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]
          bg-stone-900 dark:bg-white
          `,
          !isPending &&
            "group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"
        )}
      />

      <ArrowRight
        className={clsx(
          `
          absolute w-4 h-4 right-4 z-[9]
          transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
          stroke-stone-900 dark:stroke-white
          group-hover:right-[-25%] group-hover:stroke-white
          dark:group-hover:stroke-stone-900
          `,
          isPending && "opacity-0"
        )}
      />
    </button>
  );
}
