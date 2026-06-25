"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  // Clicking the logo always returns to the top of the homepage,
  // including when already on the homepage.
  const onClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Bicycle London, home"
      className={cn(
        "font-display text-2xl font-extrabold uppercase tracking-tight transition-colors",
        light ? "text-white" : "text-ink",
        className,
      )}
    >
      Bic<span className="text-brand">y</span>cle
    </Link>
  );
}
