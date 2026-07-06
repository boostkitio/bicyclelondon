import { describe, it, expect } from "vitest";
import { accumulateBoost } from "./velocity";

describe("accumulateBoost", () => {
  it("adds a scaled, per-event-capped amount", () => {
    // delta capped at 80 -> 80 * 0.22 = 17.6, which exceeds the overall cap
    // (16), so the result clamps to the cap.
    expect(accumulateBoost(0, 100)).toBe(16);
    expect(accumulateBoost(0, 10)).toBeCloseTo(10 * 0.22);
  });
  it("never exceeds the cap", () => {
    expect(accumulateBoost(15, 100)).toBe(16);
  });
  it("treats negative deltas by magnitude", () => {
    expect(accumulateBoost(0, -10)).toBeCloseTo(10 * 0.22);
  });
});
