import type { Metadata } from "next";
import { ServicePage } from "@/components/page/service-page";
import { services } from "@/content/services";

export const metadata: Metadata = {
  alternates: { canonical: "/bicycle" },
  title: "Meet Bicycle",
  description:
    "The Bicycle ecosystem merges innovative creativity with strategic media thinking, with tailored integration whether you choose our media or creative services.",
};

export default function BicyclePage() {
  return <ServicePage content={services.bicycle} />;
}
