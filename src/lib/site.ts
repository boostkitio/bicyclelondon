// Fallback site config. Live values are editable in Sanity (siteSettings) and
// override these where wired in. Confirm phone / WhatsApp with the client.

export const SITE = {
  name: "Bicycle London",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bicyclelondon.com",
  description:
    "Bicycle is an independent, integrated media and creative agency built on the power of 'and'. Media, creative, digital, data and influencers, all under one roof.",
  email: "info@bicyclelondon.com",
  jobsEmail: "jobs@bicyclelondon.com",
  phone: "0208 152 7716",
  // Derived from the listed phone number; confirm the correct WhatsApp line.
  whatsapp: "442081527716",
  address: {
    line1: "300 St John Street",
    line2: "Clerkenwell",
    city: "London",
    postcode: "EC1V 4PA",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/bicyclelondon/",
    x: "https://twitter.com/BicycleLDN",
    instagram: "https://www.instagram.com/bic.yclelondon/",
    substack: "https://bicyclelondon.substack.com/",
  },
  foundedYear: 2021,
} as const;

export type NavItem = { label: string; href: string };

// The "Power of And" service units.
export const SERVICES: { label: string; href: string; blurb: string }[] = [
  { label: "Bicycle", href: "/bicycle", blurb: "Integrated media planning & buying" },
  { label: "Blade", href: "/bicycle-blade", blurb: "Performance marketing" },
  { label: "Studio", href: "/bicycle-studio", blurb: "Creative, brand to response" },
  { label: "Ripple", href: "/bicycle-ripple", blurb: "Influencer marketing" },
  { label: "International", href: "/international", blurb: "Global media, one HQ" },
];

export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Slipstream", href: "/slipstream" },
  { label: "Careers", href: "/careers" },
];

export const FOOTER_EXPLORE: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Purpose", href: "/purpose" },
  { label: "Work", href: "/work" },
  { label: "Slipstream", href: "/slipstream" },
  { label: "The Peloton", href: "/the-peloton" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact-us" },
];

export const LEGAL_NAV: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Modern Slavery Statement", href: "/modern-slavery" },
];
