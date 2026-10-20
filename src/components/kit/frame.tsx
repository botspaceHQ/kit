import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * App frame. Layout idea from Intercom (rail, section nav, main area with header and filter row),
 * drawn the BotSpace way: panes touch with one line between them, no gaps, no floating boxes.
 * Every header is 56 px with a line under it, so the lines meet across the whole screen.
 */

export const HEADER = "flex h-14 shrink-0 items-center gap-2 border-b px-4"

/** The 56 px header row of any pane. Put a title first; actions go after a ml-auto wrapper. */
export function PaneHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <header className={cn(HEADER, className)}>{children}</header>
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        // Panes touch: one line between neighbours, no gap, no rounding.
        "flex min-h-0 min-w-0 flex-col overflow-hidden border-l bg-background max-md:border-l-0",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Section navigation pane: title, optional action, then grouped links. */
export function SubNav({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Container className="hidden w-60 shrink-0 bg-sidebar lg:flex">
      <div className={HEADER}>
        <h2 className="text-base font-semibold">{title}</h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto">{children}</nav>
    </Container>
  )
}

/** A block of links inside SubNav. Blocks are split by full-width lines. */
export function SubNavGroup({
  label,
  collapsible = false,
  children,
}: {
  label?: string
  collapsible?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <div className="flex flex-col gap-0.5 border-b p-2 last:border-b-0">
      {label &&
        (collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex h-8 items-center justify-between rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {label}
            <ChevronDownIcon className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
          </button>
        ) : (
          <div className="flex h-8 items-center px-2 text-xs font-medium text-muted-foreground">{label}</div>
        ))}
      {open && children}
    </div>
  )
}

export function SubNavItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  indent,
  badge,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  count?: number | string
  active?: boolean
  onClick?: () => void
  indent?: boolean
  badge?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-left text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        indent && "pl-8",
        active && "bg-accent font-medium text-foreground hover:bg-accent",
        !onClick && "cursor-default"
      )}
    >
      {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge}
      {count !== undefined && <span className="text-xs text-muted-foreground tabular-nums">{count}</span>}
    </button>
  )
}

/**
 * A page: optional section nav, then the main container with a 56 px header,
 * an optional filter row (full-width line under it), and padded content.
 */
export function Page({
  title,
  description,
  actions,
  filters,
  nav,
  children,
  bodyClassName,
}: {
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  filters?: React.ReactNode
  nav?: React.ReactNode
  children: React.ReactNode
  bodyClassName?: string
}) {
  return (
    <>
      {nav}
      <Container className="flex-1">
        <header className={HEADER}>
          <h1 className="truncate text-base font-semibold">{title}</h1>
          {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        {filters && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2">{filters}</div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn("mx-auto flex max-w-[1400px] flex-col gap-4 p-4 md:gap-6 md:p-6", bodyClassName)}>
            {description && <p className="-mb-1 text-sm text-muted-foreground md:-mb-2">{description}</p>}
            {children}
          </div>
        </div>
      </Container>
    </>
  )
}

/** A Card with the standard header (title, description, action) and content. */
export function Panel({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}

/** View switch on stock Tabs, with an optional count per view. */
export function ViewTabs({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; count?: number }[]
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(String(v))}>
      <TabsList>
        {options.map((o) => (
          <TabsTrigger key={o.value} value={o.value} className="px-2.5">
            {o.label}
            {o.count !== undefined && (
              <span className="text-xs text-muted-foreground tabular-nums">{o.count}</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

// Older name kept so pages that filter rows read the same.
export const FilterChips = ViewTabs
