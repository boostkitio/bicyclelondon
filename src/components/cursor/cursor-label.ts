export type CursorState = {
  variant: "dot" | "ring" | "label";
  label: string;
};

/**
 * Resolve the cursor's visual state from the element under the pointer.
 * Any ancestor carrying `data-cursor` opts in: an empty value (or "ring")
 * grows the dot into a ring; any other value shows that word as a label.
 */
export function resolveCursorState(el: Element | null): CursorState {
  const target = el?.closest("[data-cursor]");
  if (!target) return { variant: "dot", label: "" };
  const value = (target.getAttribute("data-cursor") ?? "").trim();
  if (value === "" || value.toLowerCase() === "ring") {
    return { variant: "ring", label: "" };
  }
  return { variant: "label", label: value };
}
