/**
 * Transform for a card in a sticky stack. As overall progress advances, cards
 * earlier in the stack recede: they scale down a little and lift slightly, so
 * later cards appear to settle on top. The last card never moves.
 */
export function stackTransform(
  index: number,
  count: number,
  progress: number,
): { scale: number; y: number } {
  const fromEnd = count - 1 - index; // 0 for the last card
  const recede = Math.min(progress, 1) * fromEnd;
  return {
    scale: 1 - recede * 0.05,
    y: -recede * 8,
  };
}
