import * as React from "react"
import { CheckCheckIcon, CheckIcon, ChevronDownIcon, SparklesIcon, StickyNoteIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Sectioned inbox panes (Chats OS style). The inbox is the one place with no cards:
 * every pane is cut into full-width sections by lines, and each section has a 40 px title row.
 * Use these with Container, SubNav and PaneHeader from ./frame.
 */

/** A collapsible block of a pane. A line under it, a 40 px title row, padded body. */
export function PaneSection({
  title,
  count,
  icon: Icon,
  action,
  defaultOpen = true,
  flush = false,
  children,
}: {
  title: string
  count?: number
  icon?: React.ComponentType<{ className?: string }>
  /** One small ghost button on the right of the title row. */
  action?: React.ReactNode
  defaultOpen?: boolean
  /** No body padding. Use it for lists that run edge to edge. */
  flush?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const id = React.useId()
  return (
    <section className="border-b">
      <div className="flex h-10 items-center gap-1 pr-2 pl-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-2 text-left text-[13px] font-medium hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <ChevronDownIcon className={cn("size-4 shrink-0 text-muted-foreground transition-transform", !open && "-rotate-90")} />
          {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
          <span className="truncate">{title}</span>
          {count !== undefined && <span className="text-xs text-muted-foreground tabular-nums">{count}</span>}
        </button>
        {action}
      </div>
      {open && (
        <div id={id} className={flush ? "" : "px-4 pb-4"}>
          {children}
        </div>
      )}
    </section>
  )
}

/** Key and value on one row. Put a run of these inside a <dl>. Values align right and may wrap. */
export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-[13px]">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium break-words">{children}</dd>
    </div>
  )
}

/**
 * One row of a list pane: avatar, title and time, a preview line, optional chips.
 * The selected row gets bg-accent and a 2 px primary bar on its left edge.
 */
export function ListRow({
  avatar,
  title,
  time,
  preview,
  unread = 0,
  chips,
  active,
  onClick,
}: {
  avatar?: React.ReactNode
  title: string
  time?: string
  preview?: React.ReactNode
  unread?: number
  chips?: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active || undefined}
      className={cn(
        "relative flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none",
        active && "bg-accent hover:bg-accent"
      )}
    >
      {active && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("truncate text-sm", unread ? "font-semibold" : "font-medium")}>{title}</span>
          {time && <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">{time}</span>}
        </div>
        {(preview || unread > 0) && (
          <div className="mt-0.5 flex items-center gap-2">
            <span className={cn("truncate text-[13px]", unread ? "text-foreground" : "text-muted-foreground")}>{preview}</span>
            {unread > 0 && (
              <span className="ml-auto grid min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[11px] leading-5 font-semibold text-primary-foreground tabular-nums">
                {unread}
              </span>
            )}
          </div>
        )}
        {chips && <div className="mt-2 flex flex-wrap gap-1">{chips}</div>}
      </div>
    </button>
  )
}

/** Empty state for a pane: one plain sentence that says what to do next. */
export function PaneEmpty({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-12 text-center text-sm text-muted-foreground">{children}</div>
}

export type BubbleKind = "in" | "out" | "bot" | "note"

/** One chat message. Incoming on the left, outgoing, bot and notes on the right. */
export function MessageBubble({
  kind,
  children,
  time,
  author,
  status,
}: {
  kind: BubbleKind
  children: React.ReactNode
  time?: string
  /** Shown above the text for bot replies and notes. */
  author?: string
  /** Delivery ticks for outgoing messages. */
  status?: "sent" | "delivered" | "read"
}) {
  const incoming = kind === "in"
  if (kind === "note") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[min(440px,85%)] rounded-2xl rounded-br-md bg-note px-3.5 py-2">
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-medium text-note-foreground">
            <StickyNoteIcon className="size-3" />
            Internal note{author ? ` · ${author}` : ""}
          </div>
          <p className="text-sm leading-relaxed">{children}</p>
          {time && <div className="mt-1 text-right text-[11px] text-muted-foreground">{time}</div>}
        </div>
      </div>
    )
  }
  return (
    <div className={cn("flex", incoming ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[min(440px,80%)] rounded-2xl px-3.5 py-2",
          incoming ? "rounded-bl-md bg-bubble-in" : "rounded-br-md bg-bubble-out text-foreground"
        )}
      >
        {kind === "bot" && (
          <div className="mb-0.5 flex items-center gap-1 text-[11px] font-medium opacity-75">
            <SparklesIcon className="size-3" />
            {author ?? "AI agent"}
          </div>
        )}
        <p className="text-sm leading-relaxed">{children}</p>
        {time && (
          <div className={cn("mt-0.5 flex items-center justify-end gap-1 text-[11px]", incoming ? "text-muted-foreground" : "opacity-70")}>
            {time}
            {!incoming && status === "sent" && <CheckIcon className="size-3.5" aria-label="Sent" />}
            {!incoming && (status === "delivered" || status === "read") && (
              <CheckCheckIcon className={cn("size-3.5", status === "read" && "text-tint")} aria-label={status === "read" ? "Read" : "Delivered"} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** A centred day label or a system event between messages. */
export function ThreadDivider({ children, event = false }: { children: React.ReactNode; event?: boolean }) {
  if (!event) {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-muted-foreground">{children}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 px-6 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      <span className="flex items-center gap-1.5 text-center">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
