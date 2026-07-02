import type { Metadata } from "next";
import { Raleway, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/scroll/smooth-scroll";
import { SITE } from "@/lib/site";

// Three faces that spell the brand thesis: Raleway display AND a warm Hanken
// Grotesk body AND Space Mono for data/label voice (the "science & machine"
// half). Raleway renders in display/heading contexts at 600/700/800.
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
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
    <html
      lang="en-GB"
      className={`${raleway.variable} ${hanken.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
