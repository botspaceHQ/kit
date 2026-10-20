import * as React from "react"
import { CheckIcon, CopyIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Prop } from "@/docs/component-docs"

/** Copy text inside the click handler. Some viewers refuse the clipboard: then select the text. */
export function useCopy() {
  const [done, setDone] = React.useState(false)
  const copy = (text: string, fallback?: HTMLElement | null) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setDone(true)
        setTimeout(() => setDone(false), 1500)
      })
      .catch(() => {
        if (!fallback) return
        const r = document.createRange()
        r.selectNodeContents(fallback)
        const s = window.getSelection()
        s?.removeAllRanges()
        s?.addRange(r)
      })
  }
  return [done, copy] as const
}

export function DocTitle({ title, lead, meta }: { title: string; lead: string; meta?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
      <p className="max-w-[65ch] text-[15px] leading-relaxed text-muted-foreground">{lead}</p>
      {meta && <div className="flex flex-wrap items-center gap-2 pt-1">{meta}</div>}
    </div>
  )
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-20 border-b pb-2 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  )
}

export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex max-w-[70ch] flex-col gap-3 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12.5px] [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const ref = React.useRef<HTMLPreElement>(null)
  const [done, copy] = useCopy()
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/50">
      <div className="flex h-9 items-center gap-2 border-b pr-1 pl-3 text-xs text-muted-foreground">
        <span className="font-medium">{label ?? "tsx"}</span>
        <Button variant="ghost" size="icon-xs" className="ml-auto" aria-label="Copy code" onClick={() => copy(code, ref.current)}>
          {done ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <pre ref={ref} className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/** The command people copy. One line, mono, with a copy button. */
export function Command({ command }: { command: string }) {
  const ref = React.useRef<HTMLElement>(null)
  const [done, copy] = useCopy()
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/50 py-1 pr-1 pl-3">
      <code ref={ref} className="min-w-0 flex-1 truncate font-mono text-[12.5px]">
        {command}
      </code>
      <Button variant="ghost" size="icon-xs" aria-label="Copy command" onClick={() => copy(command, ref.current)}>
        {done ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}

/** Live preview on the canvas ground, with a Code tab. */
export function Preview({ children, code, padded = true }: { children: React.ReactNode; code?: string; padded?: boolean }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  return (
    <div className="overflow-hidden rounded-xl border">
      {code && (
        <div className="flex h-10 items-center gap-1 border-b bg-background px-2" role="tablist" aria-label="Preview or code">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "h-7 rounded-full px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
                tab === t && "bg-accent text-foreground"
              )}
            >
              {t === "preview" ? "Preview" : "Code"}
            </button>
          ))}
        </div>
      )}
      {tab === "preview" ? (
        <div className={cn("min-w-0 overflow-x-auto bg-background", padded && "p-6")}>{children}</div>
      ) : (
        <pre className="overflow-x-auto bg-muted/50 p-4 font-mono text-[12.5px] leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="w-48 pl-4">Prop</TableHead>
            <TableHead className="w-64">Type</TableHead>
            <TableHead className="pr-4">What it does</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((p) => (
            <TableRow key={p.name} className="hover:bg-transparent">
              <TableCell className="pl-4 align-top font-mono text-[12.5px] font-medium">{p.name}</TableCell>
              <TableCell className="align-top font-mono text-[12px] whitespace-normal text-muted-foreground">
                {p.type}
                {p.default && <div className="mt-0.5 text-foreground/70">default {p.default}</div>}
              </TableCell>
              <TableCell className="pr-4 align-top text-[13px] whitespace-normal">{p.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RuleList title="Do" items={dos} good />
      <RuleList title="Don't" items={donts} />
    </div>
  )
}

function RuleList({ title, items, good = false }: { title: string; items: string[]; good?: boolean }) {
  const Icon = good ? CheckIcon : XIcon
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className={cn("flex h-9 items-center gap-2 border-b px-3 text-[13px] font-semibold", good ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground")}>
        <Icon className="size-4" />
        {title}
      </div>
      <ul className="flex flex-col divide-y">
        {items.map((t) => (
          <li key={t} className="px-3 py-2.5 text-[13px] leading-relaxed">
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Small key and value list for page facts (item, file, group). */
export function Facts({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-[auto_minmax(0,1fr)]">
      {items.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="min-w-0 font-mono text-[12.5px] break-all">{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
