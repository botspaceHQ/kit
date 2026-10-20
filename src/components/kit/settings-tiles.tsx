import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** The tonal fill behind a tile's icon. One tone per settings group, not per tile. */
export type TileTone = "violet" | "success" | "secondary" | "warning" | "info"

const toneClass: Record<TileTone, string> = {
  violet: "bg-violet text-violet-foreground",
  success: "bg-success text-success-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
}

export type SettingsTile = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  /** One sentence: what a person changes here. */
  body: string
  /** A StatusBadge that needs attention ("Review", "Connected"). */
  badge?: React.ReactNode
  onClick?: () => void
}

export type SettingsGroup = { title: string; tone: TileTone; tiles: SettingsTile[] }

/** Settings home: a titled grid of tiles for each group. Three across on wide screens, one on phones. */
export function SettingsTiles({ groups }: { groups: SettingsGroup[] }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      {groups.map((g) => (
        <section key={g.title} className="flex flex-col gap-3">
          <h2 className="font-medium">{g.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.tiles.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.title}
                  type="button"
                  onClick={t.onClick}
                  className="group flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                >
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", toneClass[g.tone])}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {t.title}
                      {t.badge}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{t.body}</span>
                  </span>
                  <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
