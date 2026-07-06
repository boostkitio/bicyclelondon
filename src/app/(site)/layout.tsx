import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  alternateName: "Bicycle",
  url: SITE.url,
  // White-on-transparent is the only full mark to hand; swap for a
  // dark/colour version when the client supplies one.
  logo: `${SITE.url}/images/logo-bicycle-white.png`,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  foundingDate: String(SITE.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.line1,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postcode,
    addressCountry: "GB",
  },
  sameAs: [
    SITE.social.linkedin,
    SITE.social.x,
    SITE.social.instagram,
    SITE.social.substack,
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomCursor />
      <JsonLd data={organisationSchema} />
      <JsonLd data={websiteSchema} />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
