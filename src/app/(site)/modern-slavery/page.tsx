import type { Metadata } from "next";
import { LegalPage } from "@/components/page/legal-page";

export const metadata: Metadata = {
  alternates: { canonical: "/modern-slavery" },
  title: "Modern Slavery Statement",
  description:
    "Bicycle London’s statement on the steps taken to prevent modern slavery and human trafficking.",
};

export default function ModernSlaveryPage() {
  return (
    <LegalPage
      title="Modern Slavery Statement"
      summary="This statement sets out the steps Bicycle London takes to prevent modern slavery and human trafficking in our business and supply chains."
      pdfHref="https://www.bicyclelondon.com/_files/ugd/c7e472_a8c41f8528b144658f40c18209d03681.pdf"
    />
  );
}
