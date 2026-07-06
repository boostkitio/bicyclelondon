import { describe, it, expect } from "vitest";
import { resolveCursorState } from "./cursor-label";

function el(attr?: string) {
  return {
    closest: (sel: string) =>
      sel === "[data-cursor]" && attr !== undefined
        ? { getAttribute: () => attr }
        : null,
  } as unknown as Element;
}

describe("resolveCursorState", () => {
  it("returns the plain dot when nothing opts in", () => {
    expect(resolveCursorState(el())).toEqual({ variant: "dot", label: "" });
  });
  it("returns a label variant for a worded attribute", () => {
    expect(resolveCursorState(el("View"))).toEqual({ variant: "label", label: "View" });
  });
  it("returns a ring for an empty or 'ring' attribute", () => {
    expect(resolveCursorState(el(""))).toEqual({ variant: "ring", label: "" });
    expect(resolveCursorState(el("ring"))).toEqual({ variant: "ring", label: "" });
  });
  it("returns the plain dot for a null element", () => {
    expect(resolveCursorState(null)).toEqual({ variant: "dot", label: "" });
  });
});
