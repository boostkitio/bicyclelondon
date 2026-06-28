"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const servicesActive = SERVICES.some((s) => isActive(s.href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-navy text-white shadow-lg shadow-black/10"
          : "bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden items-center gap-8 lg:flex">
          <div className="group relative">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.15em]",
                servicesActive ? "text-brand" : "hover:text-brand",
              )}
            >
              What we do
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="mt-0.5 transition-transform duration-300 group-hover:rotate-180"
              >
                <path
                  d="M2 4l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-[36rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-deep text-white shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <div className="flex">
                  {/* Intro */}
                  <div className="hidden w-48 shrink-0 flex-col justify-between border-r border-white/10 bg-white/[0.03] p-6 sm:flex">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                        The power of and
                      </p>
                      <p className="mt-3 font-display text-lg font-bold uppercase leading-[1.05] text-white">
                        Five specialisms.
                        <br />
                        One roof.
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/50">
                        Plug into one, or the whole peloton.
                      </p>
                    </div>
                    <Link
                      href="/about"
                      className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand transition-all hover:gap-2.5"
                    >
                      How we work
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  {/* Services */}
                  <ul className="flex-1 p-2.5">
                    {SERVICES.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          className="group/svc relative flex items-center gap-4 rounded-xl py-3 pl-5 pr-4 transition-colors hover:bg-white/[0.06]"
                        >
                          <span className="absolute left-1.5 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-brand transition-all duration-300 group-hover/svc:h-8" />
                          <span className="relative h-5 w-24 shrink-0">
                            <Image
                              src={s.logo}
                              alt={s.label}
                              fill
                              sizes="96px"
                              className="object-contain object-left opacity-80 transition group-hover/svc:opacity-100"
                            />
                          </span>
                          <span className="min-w-0 flex-1 text-[13px] leading-snug text-white/55 transition-colors group-hover/svc:text-white/80">
                            {s.blurb}
                          </span>
                          <span
                            aria-hidden
                            className="shrink-0 text-brand opacity-0 transition-all duration-300 -translate-x-1 group-hover/svc:translate-x-0 group-hover/svc:opacity-100"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-[13px] font-medium uppercase tracking-[0.15em]",
                isActive(item.href) ? "text-brand" : "hover:text-brand",
              )}
            >
              {item.label}
            </Link>
          ))}

          <ButtonLink href="/contact-us" variant="primary" size="md">
            Contact
          </ButtonLink>
          </nav>

          <Link
            href="/purpose"
            aria-label="Certified B Corporation"
            className="shrink-0 transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/bcorp-white.png"
              alt="Certified B Corporation"
              width={56}
              height={94}
              className="h-9 w-auto sm:h-10"
            />
          </Link>

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
