import type { Metadata } from "next";
import { ServicePage } from "@/components/page/service-page";
import { services } from "@/content/services";

export const metadata: Metadata = {
  alternates: { canonical: "/bicycle-ripple" },
  title: "Bicycle Ripple | Influencer & social",
  description:
    "Bicycle Ripple is our integrated, social-first division, using data-driven insight to select and manage influencer and organic social campaigns for iconic brands.",
};

export default function RipplePage() {
  return <ServicePage content={services.ripple} />;
}
