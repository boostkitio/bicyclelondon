/**
 * Accumulate a scroll "boost" from how far the page jumped this event, capped
 * per event and overall. Callers bleed it off each frame (multiply by ~0.9) so
 * it always settles back to zero. Mirrors the marquee surge maths.
 */
export function accumulateBoost(
  current: number,
  deltaY: number,
  opts: { perPx?: number; cap?: number } = {},
): number {
  const perPx = opts.perPx ?? 0.22;
  const cap = opts.cap ?? 16;
  const next = current + Math.min(Math.abs(deltaY), 80) * perPx;
  return next > cap ? cap : next;
}
