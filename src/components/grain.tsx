// A whisper-quiet film-grain overlay for flat dark blocks, so the big navy
// areas read as a textured surface rather than a solid fill. Pure CSS, no JS,
// no layout impact. Drop it as the first child of a `relative` container.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Grain({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: NOISE,
        backgroundSize: "120px 120px",
        opacity: 0.05,
        mixBlendMode: "overlay",
      }}
    />
  );
}
