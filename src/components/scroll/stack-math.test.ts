import { describe, it, expect } from "vitest";
import { stackTransform } from "./stack-math";

describe("stackTransform", () => {
  it("leaves the last card at full scale, no offset", () => {
    const t = stackTransform(2, 3, 1);
    expect(t.scale).toBeCloseTo(1);
    expect(t.y).toBeCloseTo(0);
  });
  it("shrinks earlier cards as progress advances", () => {
    const early = stackTransform(0, 3, 1);
    expect(early.scale).toBeLessThan(1);
    expect(early.scale).toBeGreaterThan(0.8);
  });
  it("is identity at progress 0", () => {
    const t = stackTransform(0, 3, 0);
    expect(t.scale).toBeCloseTo(1);
    expect(t.y).toBeCloseTo(0);
  });
});
