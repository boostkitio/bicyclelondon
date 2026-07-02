import Link from "next/link";
import Image from "next/image";
import { Container } from "./ui/container";
import { Grain } from "./grain";
import { SocialIcons } from "./social-icons";
import {
  SITE,
  SERVICES,
  FOOTER_EXPLORE,
  LEGAL_NAV,
} from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <Grain />
      <Container className="relative py-16">
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
            <div className="mt-6 flex items-center gap-5">
              <a
                href="https://www.bcorporation.net/en-us/find-a-b-corp/company/bicycle-london-limited/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Certified B Corporation profile (opens in a new tab)"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/images/bcorp-white.png"
                  alt="Certified B Corporation"
                  width={56}
                  height={94}
                  className="h-16 w-auto"
                />
              </a>
              <Image
                src="/images/royal-charter.png"
                alt="Incorporated by Royal Charter"
                width={122}
                height={59}
                className="h-11 w-auto"
              />
            </div>
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
            <SocialIcons className="mt-5" />
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
