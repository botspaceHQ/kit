import * as React from "react"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

/** BotSpace kit: page title row used by every list page. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Stat card (shadcn section-card pattern) with a small icon next to the label. */
export function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
  tone?: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <Icon className="size-3.5" />
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums group-data-[size=sm]/card:text-2xl">{value}</CardTitle>
      </CardHeader>
      {hint && <CardFooter className="text-xs text-muted-foreground">{hint}</CardFooter>}
    </Card>
  )
}

/** BotSpace kit: filter chips with counts (replaces grid toolbar tabs). */
export function FilterChips({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; count: number }[]
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={
              "flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none " +
              (active
                ? "border-transparent bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            {o.label}
            <span className="text-xs tabular-nums opacity-70">{o.count}</span>
          </button>
        )
      })}
    </div>
  )
}
