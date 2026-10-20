import * as React from "react"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"

/** Stock Badge plus BotSpace tonal colours. One place maps a tone to colours. */
export type Tone = "neutral" | "success" | "warning" | "info" | "danger" | "violet" | "secondary" | "outline"

/** Tone names from the OS kit (@botspace/ui StatusTone). They map to kit tones until the OS apps move. */
export type LegacyTone = "good" | "serious" | "critical"

const legacy: Record<LegacyTone, Tone> = { good: "success", serious: "warning", critical: "danger" }

/** A tone's fill and text, for small pieces that are not a badge (a calendar chip, a dot). */
export const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-accent text-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  danger: "bg-danger text-danger-foreground",
  violet: "bg-violet text-violet-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border-border bg-transparent text-muted-foreground",
}

/**
 * A record's state (paid, scheduled, failed). Map values to tones once, next to the data type,
 * never inline in a page. Always carries a word: colour is never the only signal.
 */
export function StatusBadge({
  tone: t,
  variant,
  className,
  children,
}: {
  tone?: Tone | LegacyTone | "default"
  /** Same as tone; kept so status tables can say `variant`. */
  variant?: Tone | LegacyTone | "default"
  className?: string
  children: React.ReactNode
}) {
  const raw = t ?? variant ?? "neutral"
  const key: Tone = raw === "default" ? "neutral" : raw in legacy ? legacy[raw as LegacyTone] : (raw as Tone)
  return (
    <Badge variant="secondary" className={cn(TONE_CLASS[key], className)}>
      {children}
    </Badge>
  )
}
