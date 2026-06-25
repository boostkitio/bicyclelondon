"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ButtonLink } from "./ui/button";
import { PRIMARY_NAV, SERVICES } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Solid header when scrolled, off the homepage, or when the menu is open.
  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-white text-ink shadow-sm" : "bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo light={!solid} />

        <nav className="hidden items-center gap-7 lg:flex">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide hover:text-brand"
            >
              What we do
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="mt-0.5"
              >
                <path
                  d="M2 4l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-2xl bg-white p-2 text-ink shadow-xl ring-1 ring-black/5">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block rounded-xl px-4 py-2.5 hover:bg-paper"
                  >
                    <span className="font-display text-sm font-bold uppercase">
                      {s.label}
                    </span>
                    <span className="block text-xs text-black/60">
                      {s.blurb}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-wide hover:text-brand"
            >
              {item.label}
            </Link>
          ))}

          <ButtonLink href="/contact-us" variant="primary" size="md">
            Contact
          </ButtonLink>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="lg:hidden"
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <path
                d="M7 7l14 14M21 7L7 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <path
                d="M4 8h20M4 14h20M4 20h20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[64px] z-40 overflow-y-auto bg-navy px-5 pb-12 pt-6 text-white lg:hidden">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
            What we do
          </p>
          <div className="mb-8 grid gap-1">
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-xl px-3 py-3 font-display text-lg font-bold uppercase hover:bg-white/10"
              >
                {s.label}
                <span className="ml-2 font-body text-sm font-normal normal-case text-white/60">
                  {s.blurb}
                </span>
              </Link>
            ))}
          </div>
          <div className="grid gap-1">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 font-display text-lg font-bold uppercase hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/contact-us" variant="primary" size="lg">
              Contact us
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
