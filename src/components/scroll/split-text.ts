export type Token = { text: string; space: boolean };

/**
 * Tokenise text for staggered reveals. Whitespace is preserved as its own
 * token so word spacing survives when each token becomes an inline-block.
 */
export function splitToTokens(text: string, by: "word" | "char"): Token[] {
  if (text.length === 0) return [];
  if (by === "word") {
    return text
      .split(/(\s+)/)
      .filter((p) => p.length > 0)
      .map((p) => ({ text: p, space: /^\s+$/.test(p) }));
  }
  return Array.from(text).map((ch) => ({ text: ch, space: /\s/.test(ch) }));
}
