/** Fraction of the page scrolled, clamped to [0,1]. Short pages return 0. */
export function scrollFraction(
  scrollTop: number,
  scrollHeight: number,
  viewport: number,
): number {
  const scrollable = scrollHeight - viewport;
  if (scrollable <= 0) return 0;
  const f = scrollTop / scrollable;
  return f < 0 ? 0 : f > 1 ? 1 : f;
}
