import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact-us" },
  title: "Contact",
  description:
    "Get in touch with Bicycle. New business, general enquiries or careers, we’d love to hear from you.",
};

const contacts = [
  { label: "New business", email: "newbusiness@bicyclelondon.com" },
  { label: "General enquiries", email: SITE.email },
  { label: "Careers", email: SITE.jobsEmail },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        lead="Whether it’s a new business enquiry, a general question, or you want to ride with us, we’re here."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="display text-2xl">Send us a message</h2>
            <p className="mt-2 text-black/60">
              Fill in the form and the right person will get back to you.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <Reveal className="space-y-8">
            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-black/50">
                Email us
              </h2>
              <ul className="mt-4 space-y-3">
                {contacts.map((c) => (
                  <li key={c.label}>
                    <p className="text-sm text-black/55">{c.label}</p>
                    <a
                      href={`mailto:${c.email}`}
                      data-cursor
                      className="font-display font-semibold hover:text-brand-ink"
                    >
                      {c.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-black/50">
                Visit
              </h2>
              <address className="mt-4 not-italic text-black/75">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.city} {SITE.address.postcode}
              </address>
            </div>

            <div>
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-black/50">
                Call
              </h2>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                data-cursor
                className="mt-4 inline-block font-display font-semibold hover:text-brand-ink"
              >
                {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
