import type { Metadata } from "next";
import { LegalPage } from "@/components/page/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Bicycle London uses cookies and similar technologies on this website.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      summary="This policy explains how Bicycle London uses cookies and similar technologies on this website, and how you can manage your preferences."
      pdfHref="https://www.bicyclelondon.com/_files/ugd/a61267_44efd16335204f79bfa8cfb5227f5e65.pdf"
    />
  );
}
