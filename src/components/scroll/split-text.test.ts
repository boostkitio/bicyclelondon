import { describe, it, expect } from "vitest";
import { splitToTokens } from "./split-text";

describe("splitToTokens", () => {
  it("splits words and preserves the spaces between them", () => {
    expect(splitToTokens("Power of and", "word")).toEqual([
      { text: "Power", space: false },
      { text: " ", space: true },
      { text: "of", space: false },
      { text: " ", space: true },
      { text: "and", space: false },
    ]);
  });
  it("splits characters and marks spaces", () => {
    expect(splitToTokens("a b", "char")).toEqual([
      { text: "a", space: false },
      { text: " ", space: true },
      { text: "b", space: false },
    ]);
  });
  it("returns an empty array for an empty string", () => {
    expect(splitToTokens("", "word")).toEqual([]);
  });
});
