"use client";

import { Book, CreditCard, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    slug: "Explore",
    href: "/explore",
    icon: <House className="w-4 h-4" />,
  },
  {
    slug: "Testimonial",
    href: "/testimonial",
    icon: <Book className="w-4 h-4" />,
  },
  {
    slug: "Pricing",
    href: "/pricing",
    icon: <CreditCard className="w-4 h-4" />,
  },
] as const;

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-5">
      {LINKS.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-sm flex items-center gap-2 transition-colors
                ${
                  isActive
                    ? "text-black dark:text-white font-medium"
                    : "text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white"
                }`}
            >
              {link.icon}
              {link.slug}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
