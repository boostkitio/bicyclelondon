import type { Metadata } from "next";
import { ServicePage } from "@/components/page/service-page";
import { services } from "@/content/services";

export const metadata: Metadata = {
  alternates: { canonical: "/bicycle-studio" },
  title: "Bicycle Studio | Creative studio",
  description:
    "Bicycle Studio provides end-to-end creative solutions, from brand strategy to performance, aligning innovative assets with strategic media objectives.",
};

export default function StudioPage() {
  return <ServicePage content={services.studio} />;
}
