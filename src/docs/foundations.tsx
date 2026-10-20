import tokenCss from "@/styles/botspace-tokens.css?raw"
import { contrast, parseTokens, type Token } from "../../scripts/tokens.ts"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/kit/status-badge"
import { DocTitle, H2, Prose } from "@/docs/parts"
import { typeFamilies, typeScale } from "@/docs/type-scale"

export const tokens = parseTokens(tokenCss)

/* ------------------------------------------------------------------ Colours */

function Swatch({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="h-10 rounded-md ring-1 ring-foreground/15 ring-inset" style={{ background: value }} aria-hidden />
      <span className="font-mono text-[11px] text-muted-foreground">
        {label} {value}
      </span>
    </div>
  )
}

function pairOf(t: Token) {
  if (t.name.endsWith("-foreground")) return null
  const fg = tokens.find((x) => x.name === `${t.name}-foreground`)
  if (fg) return fg
  if (t.name === "background") return tokens.find((x) => x.name === "foreground")
  return null
}

function Ratio({ a, b }: { a: string; b: string }) {
  const r = contrast(a, b)
  return (
    <span className={cn("font-mono text-[11px] tabular-nums", r < 4.5 ? "text-destructive" : "text-muted-foreground")}>
      {r.toFixed(1)}:1
    </span>
  )
}

function ColorRow({ t }: { t: Token }) {
  const fg = pairOf(t)
  return (
    <li className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="min-w-0">
        <div className="font-mono text-[13px] font-medium">--{t.name}</div>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{t.note || "See the paired token."}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Swatch value={t.light} label="Light" />
          {fg && (
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded px-1.5 py-0.5 font-medium" style={{ background: t.light, color: fg.light }}>
                Aa
              </span>
              <Ratio a={t.light} b={fg.light} />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Swatch value={t.dark ?? t.light} label="Dark" />
          {fg && (
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded px-1.5 py-0.5 font-medium" style={{ background: t.dark ?? t.light, color: fg.dark ?? fg.light }}>
                Aa
              </span>
              <Ratio a={t.dark ?? t.light} b={fg.dark ?? fg.light} />
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

const groupLead: Record<string, string> = {
  "Core roles": "The stock shadcn role names. Every stock component reads these, so the theme changes the look without edits to a component.",
  Navigation: "The icon rail and the section navigation pane. A tint of the page colour, so the frame reads as one surface.",
  Status: "Tonal pairs: a soft fill and a dark text in light mode, the other way in dark mode. StatusBadge, settings tiles and do/don't heads use them.",
  "Chat and marks": "Inbox only, plus two channel marks. Use the brand marks for the channel icon, never for state.",
  Charts: "Five series colours that hold in both themes. Use them in order. The fifth is for Other.",
}

export function ColorsPage() {
  const groups = [...new Set(tokens.filter((t) => t.group !== "Radius").map((t) => t.group))]
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title="Colour"
        lead="The Material 3 scheme from libs/ui-utils/colors.ts, set on the stock shadcn role names. Neutrals have a cool blue-grey tint. Primary is near-black, so colour means state, not brand."
        meta={
          <>
            <Badge variant="outline">{tokens.length - 1} tokens</Badge>
            <Badge variant="outline">Light and dark</Badge>
            <Badge variant="outline">src/styles/botspace-tokens.css</Badge>
          </>
        }
      />
      <Prose>
        <ul>
          <li>Use the semantic classes only: <code>bg-background</code>, <code>bg-card</code>, <code>text-muted-foreground</code>, <code>border</code>, <code>bg-success text-success-foreground</code>.</li>
          <li>Do not write a hex value or a Tailwind palette class (<code>bg-gray-100</code>, <code>text-green-700</code>) in a component.</li>
          <li>Put text only on its pair: <code>X-foreground</code> on <code>X</code>. The ratio under each swatch is the WCAG contrast of that pair. Red means under 4.5:1.</li>
        </ul>
      </Prose>
      {groups.map((g) => (
        <section key={g} className="flex flex-col gap-2">
          <H2 id={g.toLowerCase().replace(/\s+/g, "-")}>{g}</H2>
          {groupLead[g] && <p className="max-w-[70ch] text-sm text-muted-foreground">{groupLead[g]}</p>}
          <ul className="divide-y">
            {tokens
              .filter((t) => t.group === g)
              .map((t) => (
                <ColorRow key={t.name} t={t} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ Type */

export function TypePage() {
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title="Typography"
        lead="Inter, the face the dashboard uses today, with the cv11 and ss01 features on. Nine styles cover the product. The base size is 14 px: this is a dense work tool, not a reading page."
        meta={
          <>
            <Badge variant="outline">Inter 300 to 700</Badge>
            <Badge variant="outline">Google Fonts</Badge>
          </>
        }
      />
      <Prose>
        <ul>
          <li>Use tabular figures (<code>tabular-nums</code>) wherever numbers line up: tables, counts, stat cards, charts.</li>
          <li>Use weight for order, not size. Titles are 16 px; the page has no 32 px headings.</li>
          <li>Write numbers in Indian grouping (1,24,310) and money with the rupee sign (₹18,420).</li>
        </ul>
      </Prose>
      <section className="flex flex-col gap-2">
        <H2>Scale</H2>
        <ul className="divide-y">
          {typeScale.map((s) => (
            <li key={s.name} className="grid gap-2 py-4 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[13px] font-medium">{s.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {s.fontSize} / {s.lineHeight} · {s.fontWeight}
                </span>
              </div>
              <div className="min-w-0">
                <div className={cn("truncate", s.className, s.family === "mono" && "font-mono")}>{s.sample}</div>
                <p className="mt-1 text-[13px] text-muted-foreground">{s.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-2">
        <H2>Families</H2>
        <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-[120px_minmax(0,1fr)]">
          <dt className="text-muted-foreground">Sans</dt>
          <dd className="font-mono text-[12.5px] break-all">{typeFamilies.sans}</dd>
          <dt className="text-muted-foreground">Mono</dt>
          <dd className="font-mono text-[12.5px] break-all">{typeFamilies.mono}</dd>
        </dl>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ Radius */

const radii = [
  { name: "radius-sm", value: "4.8px", cls: "rounded-sm", use: "Small marks inside controls." },
  { name: "radius-md", value: "6.4px", cls: "rounded-md", use: "Navigation items, rail buttons, swatches." },
  { name: "radius-lg", value: "8px", cls: "rounded-lg", use: "Inputs, selects, menus, tables. The base: --radius." },
  { name: "radius-xl", value: "11.2px", cls: "rounded-xl", use: "Cards and settings tiles." },
  { name: "chip", value: "6px", cls: "rounded-[6px]", use: "Badge and StatusBadge. A shape rule on [data-slot=badge]." },
  { name: "pill", value: "9999px", cls: "rounded-full", use: "Buttons, tabs, segmented controls, avatars. A shape rule on [data-slot]." },
]

export function RadiusPage() {
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title="Radius and shape"
        lead="One base value, --radius: 0.5rem (8 px). shadcn derives its scale from it. Four shape rules in botspace-kit.css then give BotSpace its look: pill buttons, 6 px chips, pill tabs and round avatars. The components stay stock."
      />
      <section className="flex flex-col gap-3">
        <H2>Scale</H2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col gap-2">
              <div className={cn("h-16 border-2 border-foreground/70 bg-muted", r.cls)} />
              <div className="font-mono text-[13px] font-medium">
                {r.name} <span className="font-normal text-muted-foreground">{r.value}</span>
              </div>
              <p className="text-[13px] text-muted-foreground">{r.use}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <H2>The shape rules on stock parts</H2>
        <div className="flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Pill button</Button>
            <Button variant="outline">Outline</Button>
            <Badge>6 px chip</Badge>
            <StatusBadge tone="success">Delivered</StatusBadge>
          </div>
          <Input id="radius-input" placeholder="8 px input" className="max-w-xs" />
          <Card size="sm" className="max-w-xs">
            <CardHeader>
              <CardTitle>Card, 11.2 px</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Cards hold content on every page except the Inbox.</CardContent>
          </Card>
        </div>
        <pre className="overflow-x-auto rounded-lg border bg-muted/50 p-3 font-mono text-[12.5px] leading-relaxed">{`[data-slot="button"] { border-radius: 9999px; }
[data-slot="badge"] { border-radius: 6px; }
[data-slot="tabs-list"], [data-slot="tabs-trigger"] { border-radius: 9999px; }
[data-slot="avatar"], [data-slot="avatar-fallback"] { border-radius: 9999px; }`}</pre>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ Lines and layout */

function FrameDiagram() {
  const col = "flex min-w-0 flex-col border-l first:border-l-0"
  const head = "flex h-7 shrink-0 items-center border-b px-2 text-[10px] font-medium"
  const tag = "px-2 pt-1.5 font-mono text-[10px] text-muted-foreground"
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-lg border">
        <div className="flex h-56 min-w-[640px] bg-background">
          <div className={cn(col, "w-[5%] bg-sidebar")}>
            <div className={head} />
            <div className={tag}>rail</div>
          </div>
          <div className={cn(col, "w-[19%] bg-sidebar")}>
            <div className={head}>Inbox</div>
            <div className={tag}>SubNav · 240</div>
          </div>
          <div className={cn(col, "w-[25%]")}>
            <div className={head}>Your inbox</div>
            <div className="flex flex-col divide-y border-b">
              {[0, 1, 2].map((i) => (
                <div key={i} className={cn("h-7 px-2", i === 0 && "bg-accent")} />
              ))}
            </div>
            <div className={tag}>list · 320</div>
          </div>
          <div className={cn(col, "flex-1")}>
            <div className={head}>Ananya Iyer</div>
            <div className={tag}>thread · fills</div>
          </div>
          <div className={cn(col, "w-[22%]")}>
            <div className={head}>Details</div>
            <div className="h-6 border-b" />
            <div className="h-10 border-b" />
            <div className={tag}>details · 320</div>
          </div>
        </div>
      </div>
      <figcaption className="text-[13px] text-muted-foreground">
        The Inbox at 1400 px and wider. Every header is 56 px with a line under it, so the lines meet across the screen. Panes touch with one line between them.
      </figcaption>
    </figure>
  )
}

const layoutRules: [string, string][] = [
  ["Panes touch.", "One 1 px line (--border) between neighbours. No gap, no shadow, no rounded pane, no floating container."],
  ["Headers are 56 px.", "The rail logo row, the SubNav title, the page header and every inbox pane header are 56 px with a line under them. The lines meet."],
  ["Filters sit in their own row.", "View switches, search and filters go in the Page filter row, under the header, with a full-width line under it."],
  ["The Inbox has no cards.", "Every inbox pane is cut into full-width sections by lines (PaneSection). Selected rows get bg-accent and a 2 px primary bar."],
  ["Other pages hold stock cards and tables.", "Home, list, report and settings pages put Cards, StatCards and DataTables in a padded column: 16 px gap and padding, 24 px from 768 px, 1400 px wide at most."],
  ["Spacing uses the Tailwind 4 px scale.", "Use gap on flex and grid parents. Do not use margins between siblings."],
]

const sizes: [string, string, string][] = [
  ["--header-height", "56px", "Every pane header (h-14)."],
  ["--rail-width", "56px", "The icon rail (w-14)."],
  ["--subnav-width", "240px", "The section navigation pane (w-60)."],
  ["--pane-width", "320px", "Inbox list and details panes (w-80)."],
]

const breakpoints: [string, string][] = [
  ["Under 768 px", "One pane at a time. The inbox list opens the thread; Back returns."],
  ["768 px (md)", "Inbox list and thread side by side. Page padding grows to 24 px."],
  ["1024 px (lg)", "The rail and SubNav show. Under it, a menu button opens the navigation in a sheet."],
  ["1400 px", "The inbox details pane shows."],
]

export function LayoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title="Lines and layout"
        lead="The layout idea comes from Intercom and Polaris: an icon rail, a section navigation pane and a main pane with a header and a filter row. BotSpace draws it with lines, not boxes."
      />
      <FrameDiagram />
      <section className="flex flex-col gap-3">
        <H2>Rules</H2>
        <ol className="flex flex-col divide-y rounded-lg border">
          {layoutRules.map(([t, b], i) => (
            <li key={t} className="flex gap-3 px-4 py-3 text-sm">
              <span className="w-5 shrink-0 font-mono text-[13px] text-muted-foreground tabular-nums">{i + 1}</span>
              <span>
                <span className="font-medium">{t}</span> <span className="text-muted-foreground">{b}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col gap-3">
        <H2>Sizes</H2>
        <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-[160px_80px_minmax(0,1fr)]">
          {sizes.map(([n, v, u]) => (
            <div key={n} className="contents">
              <dt className="font-mono text-[12.5px] font-medium">{n}</dt>
              <dd className="font-mono text-[12.5px] tabular-nums">{v}</dd>
              <dd className="text-muted-foreground">{u}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="flex flex-col gap-3">
        <H2>Breakpoints</H2>
        <dl className="grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-[160px_minmax(0,1fr)]">
          {breakpoints.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-medium">{k}</dt>
              <dd className="text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
