"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const pathname = usePathname();
  const lenis = useLenis();

  // Clicking the logo always returns to the top of the homepage,
  // including when already on the homepage. Routes through Lenis when active.
  const onClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Bicycle London, home"
      className={cn("inline-block", className)}
    >
      <Image
        src="/images/logo-bicycle-white.png"
        alt="Bicycle London"
        width={300}
        height={98}
        priority
        className="h-10 w-auto sm:h-12"
      />
    </Link>
  );
}
