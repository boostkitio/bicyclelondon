import Link from "next/link";
import Image from "next/image";
import { Container } from "./ui/container";
import {
  SITE,
  SERVICES,
  FOOTER_EXPLORE,
  LEGAL_NAV,
} from "@/lib/site";

const socials: { label: string; href: string }[] = [
  { label: "LinkedIn", href: SITE.social.linkedin },
  { label: "X", href: SITE.social.x },
  { label: "Instagram", href: SITE.social.instagram },
  { label: "Substack", href: SITE.social.substack },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Bicycle London, home" className="inline-block">
              <Image
                src="/images/logo-bicycle-white.png"
                alt="Bicycle London"
                width={200}
                height={66}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              The independent, integrated media and creative agency built on the
              power of &lsquo;and&rsquo;.
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-white/50">
              Certified B Corporation
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              What we do
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="hover:text-brand">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Contact
            </h2>
            <address className="mt-4 space-y-2.5 text-sm not-italic text-white/80">
              <p>
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.city} {SITE.address.postcode}
              </p>
              <p className="space-y-1">
                <a href={`mailto:${SITE.email}`} className="block hover:text-brand">
                  {SITE.email}
                </a>
                <a
                  href={`mailto:${SITE.jobsEmail}`}
                  className="block hover:text-brand"
                >
                  {SITE.jobsEmail}
                </a>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="block hover:text-brand"
                >
                  {SITE.phone}
                </a>
              </p>
            </address>
            <ul className="mt-5 flex flex-wrap gap-4 text-xs uppercase tracking-wide">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {SITE.name} {new Date().getFullYear()}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-4">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
