import type { Metadata } from "next";
import { ServicePage } from "@/components/page/service-page";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Bicycle Blade | Performance consultancy",
  description:
    "Bicycle Blade is our performance consultancy, redefining traditional marketing by combining creativity with data-driven insight. People as a community, not a commodity.",
};

export default function BladePage() {
  return <ServicePage content={services.blade} />;
}
