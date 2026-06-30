// Lightweight, dependency-free data-visualisation components for the search /
// AI visibility audit. All server-rendered: pure SVG and CSS, no client JS, no
// charting library. Data is passed in as props and laid out deterministically
// at build time. Scales start at zero so nothing is visually exaggerated.

type Pt = { label: string; value: number };

export function TrendChart({
  data,
  unit = "",
  color = "#08124d",
  fill = "rgba(8,18,77,0.08)",
  caption,
}: {
  data: Pt[];
  unit?: string;
  color?: string;
  fill?: string;
  caption?: string;
}) {
  const W = 720;
  const H = 260;
  const padX = 44;
  const padTop = 28;
  const padBottom = 44;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const max = Math.max(...data.map((d) => d.value));
  const yMax = max * 1.12 || 1;

  const x = (i: number) => padX + (innerW * i) / (data.length - 1);
  const y = (v: number) => padTop + innerH * (1 - v / yMax);

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${padX},${padTop + innerH} ${line} ${padX + innerW},${padTop + innerH}`;

  const gridValues = [0, yMax / 2, yMax];

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={caption ?? "Trend chart"}
        className="w-full"
      >
        {gridValues.map((gv, i) => (
          <g key={i}>
            <line
              x1={padX}
              x2={padX + innerW}
              y1={y(gv)}
              y2={y(gv)}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text
              x={padX - 8}
              y={y(gv) + 4}
              textAnchor="end"
              fontSize={12}
              fill="currentColor"
              fillOpacity={0.5}
            >
              {Math.round(gv).toLocaleString()}
            </text>
          </g>
        ))}

        <polygon points={area} fill={fill} />
        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((d, i) => {
          const isEdge = i === 0 || i === data.length - 1;
          return (
            <g key={d.label}>
              <circle cx={x(i)} cy={y(d.value)} r={isEdge ? 5 : 3.5} fill={color} />
              {isEdge && (
                <text
                  x={x(i)}
                  y={y(d.value) - 12}
                  textAnchor={i === 0 ? "start" : "end"}
                  fontSize={13}
                  fontWeight={700}
                  fill={color}
                >
                  {unit}
                  {Math.round(d.value).toLocaleString()}
                </text>
              )}
              <text
                x={x(i)}
                y={padTop + innerH + 24}
                textAnchor="middle"
                fontSize={12}
                fill="currentColor"
                fillOpacity={0.55}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && (
        <figcaption className="mt-3 text-sm text-black/55">{caption}</figcaption>
      )}
    </figure>
  );
}

type Bar = { label: string; value: number; display?: string; highlight?: boolean };

export function CompareBars({
  items,
  max,
  unit = "",
}: {
  items: Bar[];
  max?: number;
  unit?: string;
}) {
  const ceiling = max ?? Math.max(...items.map((i) => i.value));

  return (
    <div className="space-y-4">
      {items.map((it) => {
        const pct = Math.max(2, (it.value / ceiling) * 100);
        return (
          <div key={it.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span
                className={
                  it.highlight
                    ? "text-sm font-bold text-ink"
                    : "text-sm font-medium text-black/70"
                }
              >
                {it.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {it.display ?? `${it.value.toLocaleString()}${unit}`}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: it.highlight ? "#00d400" : "#08124d",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Segment = { label: string; value: number; color: string; textOnLight?: boolean };

export function SplitBar({
  segments,
  caption,
}: {
  segments: Segment[];
  caption?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div>
      <div className="flex h-10 w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
        {segments.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div
              key={s.label}
              className="flex items-center justify-center text-xs font-bold"
              style={{
                width: `${pct}%`,
                background: s.color,
                color: s.textOnLight ? "#000000" : "#ffffff",
              }}
            >
              {pct >= 12 ? `${Math.round(pct)}%` : ""}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-sm text-black/70">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
      {caption && <p className="mt-4 text-sm text-black/55">{caption}</p>}
    </div>
  );
}
