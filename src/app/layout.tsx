import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/scroll/smooth-scroll";
import { SITE } from "@/lib/site";

// Raleway only renders in display/heading contexts, which use 600/700/800;
// body copy is the system stack, so the lighter weights never paint.
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bicycle London | Independent Media & Creative Agency",
    template: "%s | Bicycle London",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: "Bicycle London",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${raleway.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
