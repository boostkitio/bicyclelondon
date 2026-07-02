import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: vi.fn(async () => [{ slug: "sample-slug" }]),
}));

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("builds absolute https URLs with no path glitches", async () => {
    const entries = await sitemap();
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\//);
      expect(entry.url).not.toMatch(/([^:])\/\//);
    }
  });

  it("gives the homepage priority 1", async () => {
    const entries = await sitemap();
    const home = entries.find((e) => new URL(e.url).pathname === "/");
    expect(home?.priority).toBe(1);
  });

  it("includes the dynamic Sanity-driven routes", async () => {
    const entries = await sitemap();
    const paths = entries.map((e) => new URL(e.url).pathname);
    expect(paths).toContain("/slipstream/sample-slug");
    expect(paths).toContain("/work/sample-slug");
    expect(paths).toContain("/careers/sample-slug");
  });

  it("includes every static site route", async () => {
    const entries = await sitemap();
    const paths = entries.map((e) => new URL(e.url).pathname);
    const expected = [
      "/about",
      "/purpose",
      "/the-peloton",
      "/contact-us",
      "/work",
      "/slipstream",
      "/careers",
      "/careers/benefits",
      "/careers/values",
      "/careers/diversity",
      "/careers/team/mark-pavlika",
      "/careers/team/valeria-perticucci",
      "/bicycle",
      "/bicycle-blade",
      "/bicycle-studio",
      "/bicycle-ripple",
      "/international",
      "/privacy-policy",
      "/cookie-policy",
      "/modern-slavery",
    ];
    for (const path of expected) {
      expect(paths).toContain(path);
    }
  });
});
