import { describe, it, expect } from "vitest";
import { scrollFraction } from "./progress-math";

describe("scrollFraction", () => {
  it("is 0 at the top", () => {
    expect(scrollFraction(0, 2000, 800)).toBe(0);
  });
  it("is 1 at the bottom", () => {
    expect(scrollFraction(1200, 2000, 800)).toBe(1);
  });
  it("is 0.5 halfway", () => {
    expect(scrollFraction(600, 2000, 800)).toBeCloseTo(0.5);
  });
  it("clamps and avoids divide-by-zero for short pages", () => {
    expect(scrollFraction(50, 700, 800)).toBe(0);
    expect(scrollFraction(9999, 2000, 800)).toBe(1);
  });
});
