import type { Metadata } from "next";
import { ServicePage } from "@/components/page/service-page";
import { services } from "@/content/services";

export const metadata: Metadata = {
  alternates: { canonical: "/international" },
  title: "Bicycle International",
  description:
    "Bicycle International delivers independent media solutions from our London HQ, with centralised strategy and best-in-class local implementation for multi-market brands.",
};

export default function InternationalPage() {
  return <ServicePage content={services.international} />;
}
