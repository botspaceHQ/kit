import { cn } from "@/lib/utils"

/** BotSpace kit: Material 3 style segmented control (pill track, tonal selected segment). */
export function SegmentedControl({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; count?: number }[]
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn("flex w-full rounded-full bg-accent p-1", className)}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
              active && "bg-card text-foreground shadow-sm"
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("text-xs tabular-nums", active ? "text-muted-foreground" : "opacity-70")}>
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
