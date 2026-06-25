import type { Metadata } from "next";
import { LegalPage } from "@/components/page/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bicycle London collects, uses and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy explains how Bicycle London collects, uses and protects your personal data, and your rights in relation to it."
      pdfHref="https://www.bicyclelondon.com/_files/ugd/a61267_03dd66a85c5b418c84023cbd0f333f46.pdf"
    />
  );
}
