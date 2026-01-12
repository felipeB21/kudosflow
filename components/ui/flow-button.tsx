"use client";
import { ArrowRight } from "lucide-react";

export function FlowButton({ text = "Modern Button" }: { text?: string }) {
  return (
    <button
      className="
      group relative flex items-center gap-1 overflow-hidden w-full px-8 py-3 cursor-pointer
      rounded-[100px] border-[1.5px] text-sm font-semibold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]
      active:scale-[0.95]
      
      /* Light Mode */
      border-stone-800/20 bg-transparent text-stone-900 
      hover:border-transparent hover:text-white hover:rounded-[12px]
      
      /* Dark Mode */
      dark:border-white/20 dark:text-white
      dark:hover:text-stone-900
    "
    >
      {/* Left arrow (arr-2) */}
      <ArrowRight
        className="
        absolute w-4 h-4 left-[-25%] fill-none z-[9] 
        transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        stroke-stone-900 dark:stroke-white
        group-hover:left-4 group-hover:stroke-white dark:group-hover:stroke-stone-900
      "
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle (El fondo que se expande) */}
      <span
        className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 
        transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]
        bg-stone-900 dark:bg-white
        group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100
      "
      ></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight
        className="
        absolute w-4 h-4 right-4 fill-none z-[9] 
        transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]
        stroke-stone-900 dark:stroke-white
        group-hover:right-[-25%] group-hover:stroke-white dark:group-hover:stroke-stone-900
      "
      />
    </button>
  );
}
