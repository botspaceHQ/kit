import * as React from "react"
import { ExpandIcon, XIcon } from "lucide-react"

import registry from "../../registry.json"
import { AppFrame, AppRail } from "@/components/kit/app-rail"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { componentDocs, type ComponentDoc } from "@/docs/component-docs"
import { demos, Logo, railGroups } from "@/docs/demos"
import { CodeBlock, Command, DocTitle, DoDont, Facts, H2, Preview, PropsTable, Prose } from "@/docs/parts"
import { patternDocs, type PatternDoc } from "@/docs/pattern-docs"
import { BroadcastsPage } from "@/examples/broadcasts"
import { InboxPage } from "@/examples/inbox"
import { ReportsPage } from "@/examples/reports"
import { SettingsPage } from "@/examples/settings"

export const KIT_VERSION = "0.1.0"
export const REGISTRY_URL = "https://kit.bot.space/r/{name}.json"

const importOf = (d: ComponentDoc) => `import { ${d.name.split(" ")[0]} } from "@botspacehq/kit"`

const installOf = (d: ComponentDoc) =>
  d.group === "Stock shadcn" ? `npx shadcn@latest add ${d.item}` : `npx shadcn@latest add @botspace/${d.item}`

/* ------------------------------------------------------------------ Introduction */

export function IntroPage({ go }: { go: (id: string) => void }) {
  const kitItems = registry.items
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title="BotSpace Kit"
        lead="The UI kit for the new BotSpace dashboard. It is stock shadcn/ui on Base UI, a small BotSpace theme, and a set of blocks for the frame, the inbox, tables, charts and settings. Apps install it as one npm package, @botspacehq/kit. A public shadcn registry offers the same parts for prototypes."
        meta={
          <>
            <Badge variant="outline">v{KIT_VERSION}</Badge>
            <Badge variant="outline">shadcn base-nova</Badge>
            <Badge variant="outline">Base UI</Badge>
            <Badge variant="outline">Tailwind 4</Badge>
            <Badge variant="outline">React 19</Badge>
          </>
        }
      />

      <section className="flex flex-col gap-3">
        <H2>Three layers</H2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Theme", "Colour tokens on the stock role names, tonal status pairs, chart colours and four shape rules. One registry item: @botspace/theme.", "colors"],
            ["Stock primitives", "Button, Input, Select, Card, Tabs and the rest, straight from the shadcn registry. We do not fork them. The theme shapes them.", "button"],
            ["Kit blocks", "The parts shadcn does not have: the app frame, sectioned inbox panes, DataTable, StatCards, charts, settings tiles and forms.", "app-frame"],
          ].map(([t, b, to]) => (
            <button
              key={t}
              type="button"
              onClick={() => go(to)}
              className="flex flex-col gap-1.5 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            >
              <span className="text-sm font-medium">{t}</span>
              <span className="text-[13px] leading-relaxed text-muted-foreground">{b}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Set up an app</H2>
        <Prose>
          <ol>
            <li>Install the package: <code>npm install @botspacehq/kit</code>.</li>
            <li>Import the styles once, in your CSS file, after Tailwind.</li>
            <li>Add one <code>@source</code> line for the package, so Tailwind sees the classes the kit uses.</li>
            <li>Import parts from <code>@botspacehq/kit</code>. Do not copy kit files into the app.</li>
          </ol>
          <p className="text-muted-foreground">The package ships in phase 1 of the kit plan. Until then, use the registry below.</p>
        </Prose>
        <CodeBlock
          label="app.css"
          code={`@import "tailwindcss";
@import "@botspacehq/kit/styles.css";
@source "../node_modules/@botspacehq/kit/dist";`}
        />
        <CodeBlock label="page.tsx" code={`import { Page, DataTable, StatusBadge } from "@botspacehq/kit"`} />
        <H2>Prototypes: the registry</H2>
        <Prose>
          <p>For a prototype or a small tool, copy parts in with the shadcn CLI. Add the registry to <code>components.json</code>, then add the theme and the parts.</p>
        </Prose>
        <CodeBlock
          label="components.json"
          code={`{
  "style": "base-nova",
  "registries": {
    "@botspace": "${REGISTRY_URL}"
  }
}`}
        />
        <Command command="npx shadcn@latest add @botspace/theme" />
        <Command command="npx shadcn@latest add button card @botspace/frame @botspace/data-table" />
      </section>

      <section className="flex flex-col gap-3">
        <H2>Registry items</H2>
        <ul className="divide-y rounded-lg border">
          {kitItems.map((i) => (
            <li key={i.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <span className="font-mono text-[13px] font-medium">@botspace/{i.name}</span>
              <span className="text-[13px] text-muted-foreground">{i.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <H2>Who uses it</H2>
        <Prose>
          <ul>
            <li><strong>New BotSpace dashboard.</strong> The rebuilt frontend at new.dashboard.bot.space installs <code>@botspacehq/kit</code>, the Inbox first. Workspaces can opt in early. On one set date, every workspace moves to it.</li>
            <li><strong>Prototypes and small tools.</strong> Any Vite or Next.js app installs the package, or copies parts in from the registry.</li>
            <li><strong>OS apps.</strong> Not now. They keep <code>@botspace/ui</code>. A merge of the two kits is a later decision.</li>
          </ul>
        </Prose>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ Component page */

export function ComponentPage({ doc, go }: { doc: ComponentDoc; go: (id: string) => void }) {
  const Demo = demos[doc.id]
  const usedIn = patternDocs.filter((p) => p.uses.includes(doc.id))
  return (
    <div className="flex flex-col gap-8">
      <DocTitle
        title={doc.name}
        lead={doc.summary}
        meta={
          <>
            <Badge variant="outline">{doc.group}</Badge>
            <Badge variant={doc.group === "Stock shadcn" ? "secondary" : "outline"}>
              {doc.group === "Stock shadcn" ? "Stock, not forked" : `@botspace/${doc.item}`}
            </Badge>
          </>
        }
      />
      <Preview code={doc.code} padded={doc.id !== "app-frame"}>
        {Demo ? <Demo /> : <p className="text-sm text-muted-foreground">No preview.</p>}
      </Preview>
      <section className="flex flex-col gap-3">
        <H2>When to use it</H2>
        <p className="max-w-[70ch] text-sm leading-relaxed">{doc.use}</p>
        <Command command={importOf(doc)} />
        <Command command={installOf(doc)} />
        <Facts
          items={[
            ["Source", doc.file],
            ["Registry item", doc.group === "Stock shadcn" ? `${doc.item} (shadcn base-nova)` : `@botspace/${doc.item}`],
          ]}
        />
      </section>
      <section className="flex flex-col gap-3">
        <H2>Props</H2>
        <PropsTable props={doc.props} />
      </section>
      <section className="flex flex-col gap-3">
        <H2>Do and don't</H2>
        <DoDont dos={doc.dos} donts={doc.donts} />
      </section>
      {usedIn.length > 0 && (
        <section className="flex flex-col gap-3">
          <H2>Used in</H2>
          <div className="flex flex-wrap gap-2">
            {usedIn.map((p) => (
              <Button key={p.id} variant="outline" size="sm" onClick={() => go(p.id)}>
                {p.name}
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ Pattern page */

const examples = {
  inbox: { Page: InboxPage, active: "inbox" },
  broadcasts: { Page: BroadcastsPage, active: "broadcasts" },
  reports: { Page: ReportsPage, active: "reports" },
  settings: { Page: SettingsPage, active: "settings" },
}

/** A pattern running in a product frame. Full screen covers the docs, so breakpoints act like the product. */
function PatternFrame({ example }: { example: PatternDoc["example"] }) {
  const [full, setFull] = React.useState(false)
  const { Page, active } = examples[example]
  React.useEffect(() => {
    if (!full) return
    const on = (e: KeyboardEvent) => e.key === "Escape" && setFull(false)
    window.addEventListener("keydown", on)
    return () => window.removeEventListener("keydown", on)
  }, [full])
  const frame = (
    <AppFrame rail={<AppRail logo={<Logo />} groups={railGroups} active={active} />}>
      <Page />
    </AppFrame>
  )
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] text-muted-foreground">Live example with sample data. Use Full screen to see the product breakpoints.</p>
          <Button variant="outline" size="sm" onClick={() => setFull(true)}>
            <ExpandIcon data-icon="inline-start" />
            Full screen
          </Button>
        </div>
        <div className="h-[720px] overflow-x-auto overflow-y-hidden rounded-xl border">
          {/* The examples use viewport breakpoints. A minimum width keeps the panes from crushing in a narrow docs column. */}
          <div className="h-full min-w-[1080px]">{frame}</div>
        </div>
      </div>
      {full && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background" role="dialog" aria-modal="true" aria-label="Example in full screen">
          <div className="flex h-10 shrink-0 items-center justify-between border-b px-3 text-[13px] text-muted-foreground">
            Example. Press Escape to close.
            <Button variant="ghost" size="icon-sm" aria-label="Close full screen" onClick={() => setFull(false)}>
              <XIcon />
            </Button>
          </div>
          <div className="min-h-0 flex-1">{frame}</div>
        </div>
      )}
    </>
  )
}

export function PatternPage({ doc, go }: { doc: PatternDoc; go: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      <DocTitle title={doc.name} lead={doc.summary} meta={<Badge variant="outline">Pattern</Badge>} />
      <PatternFrame example={doc.example} />
      <section className="flex flex-col gap-3">
        <H2>Anatomy</H2>
        <ol className="flex flex-col divide-y rounded-lg border">
          {doc.anatomy.map(([part, text], i) => (
            <li key={part} className="flex gap-3 px-4 py-3 text-sm">
              <span className="w-5 shrink-0 font-mono text-[13px] text-muted-foreground tabular-nums">{i + 1}</span>
              <span>
                <span className="font-medium">{part}.</span> <span className="text-muted-foreground">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col gap-3">
        <H2>Rules</H2>
        <Prose>
          <ul>
            {doc.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Prose>
      </section>
      <section className="flex flex-col gap-3">
        <H2>Built from</H2>
        <div className="flex flex-wrap gap-2">
          {doc.uses.map((id) => {
            const c = componentDocs.find((d) => d.id === id)
            return c ? (
              <Button key={id} variant="outline" size="sm" onClick={() => go(id)}>
                {c.name}
              </Button>
            ) : null
          })}
        </div>
      </section>
    </div>
  )
}
