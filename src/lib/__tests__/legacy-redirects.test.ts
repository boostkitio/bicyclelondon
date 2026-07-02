import { describe, expect, it } from "vitest";
import { slugify, LEGACY_REDIRECTS } from "@/lib/legacy-redirects";

describe("slugify", () => {
  it("collapses encoded punctuation from legacy Wix slugs", () => {
    expect(slugify("x%3B-bargain-reach%2C--but-at-what-cost%3F")).toBe(
      "x-bargain-reach-but-at-what-cost",
    );
  });

  it("is idempotent", () => {
    const samples = [
      "x%3B-bargain-reach%2C--but-at-what-cost%3F",
      "already-clean-slug",
      "Mixed CASE & Ampersand",
    ];
    for (const s of samples) {
      expect(slugify(slugify(s))).toBe(slugify(s));
    }
  });

  it("removes apostrophes and maps & to and", () => {
    expect(slugify("bicycle's media & creative")).toBe(
      "bicycles-media-and-creative",
    );
    expect(slugify("it’s here")).toBe("its-here");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("--padded--slug--")).toBe("padded-slug");
  });

  it("does not throw on invalid percent-encoding", () => {
    expect(() => slugify("bad%2-slug")).not.toThrow();
    expect(slugify("bad%2-slug")).toBe("bad-2-slug");
  });
});

describe("LEGACY_REDIRECTS", () => {
  it("only targets internal slipstream paths", () => {
    for (const target of Object.values(LEGACY_REDIRECTS)) {
      expect(target.startsWith("/slipstream")).toBe(true);
    }
  });
});
