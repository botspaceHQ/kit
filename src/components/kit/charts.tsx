import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * BotSpace kit charts. Plain SVG drawn at the real pixel width (ResizeObserver),
 * so text stays 11px at every size. Colours come from --chart-* tokens, so both themes work.
 */

export function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)))
    ro.observe(el)
    setW(Math.floor(el.getBoundingClientRect().width))
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export type Series = { key: string; label: string; values: number[]; color: string }

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / p
  const step = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => n <= x) ?? 10
  return step * p
}

/** Line or stacked area over time, with hover read-out. */
export function TimeChart({
  series,
  labels,
  height = 220,
  stacked = false,
  format = (n) => n.toLocaleString("en-IN"),
  tickEvery = 7,
  ariaLabel,
}: {
  series: Series[]
  labels: string[]
  height?: number
  stacked?: boolean
  format?: (n: number) => string
  tickEvery?: number
  ariaLabel: string
}) {
  const [ref, W] = useWidth<HTMLDivElement>()
  const [hover, setHover] = React.useState<number | null>(null)
  const n = labels.length
  const pad = { l: 48, r: 12, t: 12, b: 26 }

  const totals = labels.map((_, i) => series.reduce((s, x) => s + x.values[i], 0))
  const peak = stacked ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.values))
  const max = niceMax(peak * 1.05)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)

  const x = (i: number) => pad.l + (n === 1 ? 0 : (i / (n - 1)) * (W - pad.l - pad.r))
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b)

  // cumulative baselines for stacked mode
  const layers = series.map((s, si) => {
    const base = labels.map((_, i) =>
      stacked ? series.slice(0, si).reduce((a, x) => a + x.values[i], 0) : 0
    )
    const top = s.values.map((v, i) => base[i] + v)
    return { s, base, top }
  })
  const h = hover ?? n - 1

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {W > 0 && (
        <svg
          width={W}
          height={height}
          role="img"
          aria-label={ariaLabel}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            const i = Math.round(((e.clientX - r.left - pad.l) / (W - pad.l - pad.r)) * (n - 1))
            setHover(Math.max(0, Math.min(n - 1, i)))
          }}
        >
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={pad.l}
                x2={W - pad.r}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeDasharray={i === 0 ? undefined : "3 4"}
              />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
                {i === 0 ? "0" : format(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % tickEvery === 0 || i === n - 1 ? (
              <text
                key={i}
                x={x(i)}
                y={height - 6}
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
                fontSize="11"
                fill="var(--muted-foreground)"
              >
                {(i === n - 1 || n - 1 - i >= tickEvery / 2) && l}
              </text>
            ) : null
          )}
          {layers.map(({ s, base, top }) => {
            const topPts = top.map((v, i) => `${x(i)},${y(v)}`)
            const basePts = base.map((v, i) => `${x(i)},${y(v)}`).reverse()
            return (
              <g key={s.key}>
                <polygon
                  points={[...topPts, ...basePts].join(" ")}
                  fill={s.color}
                  fillOpacity={stacked ? 0.55 : 0.12}
                />
                <polyline
                  points={topPts.join(" ")}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stacked ? 1.5 : 2}
                  strokeLinejoin="round"
                />
              </g>
            )
          })}
          <line x1={x(h)} x2={x(h)} y1={pad.t} y2={y(0)} stroke="var(--muted-foreground)" strokeOpacity="0.45" />
          {layers.map(({ s, top }) => (
            <circle key={s.key} cx={x(h)} cy={y(top[h])} r="4" fill="var(--card)" stroke={s.color} strokeWidth="2" />
          ))}
        </svg>
      )}
      {W > 0 && (
        <div
          className="pointer-events-none absolute top-0 z-10 flex flex-col gap-0.5 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md ring-1 ring-border tabular-nums"
          style={{
            left: Math.min(Math.max(x(h) + 10, 0), W - 170),
            width: 160,
          }}
        >
          <span className="font-medium">{labels[h]}</span>
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm" style={{ background: s.color }} />
              <span className="flex-1 text-muted-foreground">{s.label}</span>
              {format(s.values[h])}
            </span>
          ))}
          {stacked && series.length > 1 && (
            <span className="flex justify-between border-t pt-0.5 font-medium">
              <span>Total</span>
              {format(totals[h])}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm" style={{ background: i.color }} />
          <span className="text-muted-foreground">{i.label}</span>
          {i.value && <span className="font-medium tabular-nums">{i.value}</span>}
        </span>
      ))}
    </div>
  )
}

/** Horizontal bars with the value at the end. Good for rankings and funnels. */
export function BarList({
  items,
  format = (n) => n.toLocaleString("en-IN"),
  max,
}: {
  items: { label: string; value: number; color?: string; hint?: string }[]
  format?: (n: number) => string
  max?: number
}) {
  const top = max ?? Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((i) => (
        <li key={i.label} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate">{i.label}</span>
            <span className="shrink-0 font-medium tabular-nums">
              {format(i.value)}
              {i.hint && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{i.hint}</span>}
            </span>
          </div>
          <div className="h-2 rounded-full bg-accent">
            <div
              className="h-2 rounded-full"
              style={{ width: `${(i.value / top) * 100}%`, background: i.color ?? "var(--chart-1)" }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Day x hour grid. Shade = share of the busiest cell. */
export function Heatmap({
  rows,
  cols,
  values,
  format = (n) => String(n),
}: {
  rows: string[]
  cols: string[]
  values: number[][]
  format?: (n: number) => string
}) {
  const max = Math.max(...values.flat(), 1)
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[560px] gap-[3px] text-[11px] text-muted-foreground"
        style={{ gridTemplateColumns: `36px repeat(${cols.length}, minmax(0, 1fr))` }}
      >
        <span />
        {cols.map((c, i) => (
          <span key={c} className="text-center">
            {i % 3 === 0 ? c : ""}
          </span>
        ))}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <span className="flex items-center">{r}</span>
            {values[ri].map((v, ci) => (
              <span
                key={ci}
                title={`${r} ${cols[ci]}: ${format(v)} conversations`}
                className={cn("aspect-[1.6] rounded-[4px]", v === 0 && "bg-accent")}
                style={
                  v
                    ? { background: `color-mix(in oklch, var(--chart-1) ${Math.round(12 + (v / max) * 88)}%, var(--accent))` }
                    : undefined
                }
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/** Thin ring for one percentage. */
export function Ring({ value, label, color = "var(--chart-2)" }: { value: number; label: string; color?: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-3">
      <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${label}: ${value}%`}>
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--accent)" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 42 42)"
        />
        <text x="42" y="47" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--foreground)">
          {value}%
        </text>
      </svg>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </div>
  )
}

export type FlowNode = { id: string; label: string; value: number; col: number; color: string }
export type FlowLink = { source: string; target: string; value: number }

/** Flow (Sankey) chart: where conversations go. Columns left to right, bands sized by value. */
export function FlowChart({
  nodes,
  links,
  height = 360,
  ariaLabel,
}: {
  nodes: FlowNode[]
  links: FlowLink[]
  height?: number
  ariaLabel: string
}) {
  const [ref, W] = useWidth<HTMLDivElement>()
  const cols = Math.max(...nodes.map((n) => n.col)) + 1
  const total = nodes.filter((n) => n.col === 0).reduce((s, n) => s + n.value, 0)
  const gap = 14
  const barW = 12
  const labelW = 150
  const maxInCol = Math.max(...Array.from({ length: cols }, (_, c) => nodes.filter((n) => n.col === c).length))
  const k = (height - gap * (maxInCol - 1)) / total
  const colX = (c: number) => (cols === 1 ? 0 : (c / (cols - 1)) * Math.max(W - barW - labelW, 200))

  const pos: Record<string, { x: number; y: number; h: number }> = {}
  for (let c = 0; c < cols; c++) {
    let y = 0
    for (const n of nodes.filter((n) => n.col === c)) {
      const h = Math.max(n.value * k, 2)
      pos[n.id] = { x: colX(c), y, h }
      y += h + gap
    }
  }
  const outOff: Record<string, number> = {}
  const inOff: Record<string, number> = {}
  const color = (id: string) => nodes.find((n) => n.id === id)?.color ?? "var(--muted-foreground)"

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      {W > 0 && (
        <svg width={Math.max(W, 640)} height={height} role="img" aria-label={ariaLabel}>
          <defs>
            {links.map((l, i) => (
              <linearGradient key={i} id={`flow-${i}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={color(l.source)} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color(l.target)} stopOpacity="0.28" />
              </linearGradient>
            ))}
          </defs>
          {links.map((l, i) => {
            const s = pos[l.source]
            const t = pos[l.target]
            const h = l.value * k
            const sy = s.y + (outOff[l.source] ?? 0)
            const ty = t.y + (inOff[l.target] ?? 0)
            outOff[l.source] = (outOff[l.source] ?? 0) + h
            inOff[l.target] = (inOff[l.target] ?? 0) + h
            const x0 = s.x + barW
            const x1 = t.x
            const mx = (x0 + x1) / 2
            const d = `M${x0},${sy} C${mx},${sy} ${mx},${ty} ${x1},${ty} L${x1},${ty + h} C${mx},${ty + h} ${mx},${sy + h} ${x0},${sy + h} Z`
            return <path key={i} d={d} fill={`url(#flow-${i})`} />
          })}
          {nodes.map((n) => {
            const p = pos[n.id]
            const pct = Math.round((n.value / total) * 100)
            const ly = Math.min(Math.max(p.y + p.h / 2 - 8, 10), height - 22)
            return (
              <g key={n.id}>
                <rect x={p.x} y={p.y} width={barW} height={p.h} rx={2} fill={n.color} />
                <text x={p.x + barW + 6} y={ly} fontSize="12" fontWeight="600" fill="var(--foreground)">
                  {n.value.toLocaleString("en-IN")} ({pct}%)
                </text>
                <text x={p.x + barW + 6} y={ly + 15} fontSize="11" fill="var(--muted-foreground)">
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
