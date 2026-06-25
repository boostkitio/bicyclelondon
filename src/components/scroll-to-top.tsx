"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Resets scroll to the top on every client-side navigation.
 * Skips when there is a hash so anchor links still work.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
