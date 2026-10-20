import * as React from "react"
import { MenuIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export type RailItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  /** Unread or open count. Shows as a small pill on the icon. */
  count?: number
}

export type RailGroup = { label?: string; items: RailItem[] }

/**
 * Icon rail: the product's main navigation, 56 px wide, on bg-sidebar.
 * Groups are split by a short line. The last group sits at the bottom (settings, help).
 * Every icon has a tooltip and an aria-label, because the rail shows no words.
 */
export function AppRail({
  logo,
  groups,
  footer,
  active,
  onSelect,
}: {
  logo: React.ReactNode
  groups: RailGroup[]
  /** Pinned to the bottom: settings, help, theme switch, the person's avatar. */
  footer?: React.ReactNode
  active?: string
  onSelect?: (id: string) => void
}) {
  const last = groups.length - 1
  return (
    <div className="flex h-full w-14 flex-col items-center bg-sidebar">
      <div className="flex h-14 w-full shrink-0 items-center justify-center border-b">{logo}</div>
      <nav className="flex min-h-0 flex-1 flex-col items-center gap-1 overflow-y-auto py-2" aria-label="Main">
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <span aria-hidden className={cn("my-1 h-px w-6 shrink-0 bg-border", gi === last && groups.length > 1 && "mt-auto")} />}
            {g.items.map((item) => {
              const Icon = item.icon
              const on = item.id === active
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        aria-label={item.label}
                        aria-current={on ? "page" : undefined}
                        onClick={() => onSelect?.(item.id)}
                        className={cn(
                          "relative grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          on && "bg-sidebar-accent text-foreground"
                        )}
                      >
                        <Icon className="size-[18px]" />
                        {item.count ? (
                          <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-primary px-1 text-[9px] leading-4 font-semibold text-primary-foreground tabular-nums">
                            {item.count}
                          </span>
                        ) : null}
                      </button>
                    }
                  />
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </React.Fragment>
        ))}
      </nav>
      {footer && <div className="flex w-full flex-col items-center gap-2 border-t py-2">{footer}</div>}
    </div>
  )
}

/**
 * The whole product frame: rail on the left (hidden under 1024 px, where a menu button
 * opens `mobileNav` in a sheet), then the page panes. Panes touch: no gap, one line between.
 */
export function AppFrame({
  rail,
  mobileTitle,
  mobileNav,
  children,
  className,
}: {
  rail: React.ReactNode
  mobileTitle?: React.ReactNode
  mobileNav?: (close: () => void) => React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className={cn("flex h-full min-h-0 bg-background", className)}>
      <aside className="hidden shrink-0 lg:block">{rail}</aside>
      {mobileNav && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            {mobileNav(() => setOpen(false))}
          </SheetContent>
        </Sheet>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {mobileNav && (
          <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2 lg:hidden">
            <Button variant="ghost" size="icon-sm" aria-label="Open navigation" onClick={() => setOpen(true)}>
              <MenuIcon />
            </Button>
            <span className="truncate text-sm font-semibold">{mobileTitle}</span>
          </div>
        )}
        <main className="flex min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
