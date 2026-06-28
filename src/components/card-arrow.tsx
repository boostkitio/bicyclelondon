// Acid-green circular arrow that wipes into a card's image corner on hover.
// Expects a `group` ancestor (the card link).
export function CardArrow() {
  return (
    <span className="pointer-events-none absolute right-4 top-4 z-10 flex h-11 w-11 translate-y-1.5 scale-90 items-center justify-center rounded-full bg-brand text-black opacity-0 shadow-lg shadow-black/20 transition duration-300 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
