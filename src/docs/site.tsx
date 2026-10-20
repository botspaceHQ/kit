import * as React from "react"
import {
  BookOpenIcon,
  BoxIcon,
  LayoutTemplateIcon,
  MenuIcon,
  MoonIcon,
  PaletteIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Page, SubNav, SubNavGroup, SubNavItem } from "@/components/kit/frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { componentDocs, componentGroups } from "@/docs/component-docs"
import { ColorsPage, LayoutPage, RadiusPage, TypePage } from "@/docs/foundations"
import { ComponentPage, IntroPage, KIT_VERSION, PatternPage } from "@/docs/pages"
import { patternDocs } from "@/docs/pattern-docs"

type NavEntry = { id: string; label: string }
type NavSection = { label: string; icon: React.ComponentType<{ className?: string }>; groups: { label?: string; items: NavEntry[] }[] }

const foundations: NavEntry[] = [
  { id: "colors", label: "Colour" },
  { id: "typography", label: "Typography" },
  { id: "radius", label: "Radius and shape" },
  { id: "layout", label: "Lines and layout" },
]

const nav: NavSection[] = [
  { label: "Get started", icon: BookOpenIcon, groups: [{ items: [{ id: "intro", label: "Introduction" }] }] },
  { label: "Foundations", icon: PaletteIcon, groups: [{ items: foundations }] },
  {
    label: "Components",
    icon: BoxIcon,
    groups: componentGroups.map((g) => ({
      label: g,
      items: componentDocs.filter((d) => d.group === g).map((d) => ({ id: d.id, label: d.name })),
    })),
  },
  { label: "Patterns", icon: LayoutTemplateIcon, groups: [{ items: patternDocs.map((p) => ({ id: p.id, label: p.name })) }] },
]

const allIds = nav.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.id)))
const titleOf = (id: string) => nav.flatMap((s) => s.groups.flatMap((g) => g.items)).find((i) => i.id === id)?.label ?? ""
const sectionOf = (id: string) => nav.find((s) => s.groups.some((g) => g.items.some((i) => i.id === id)))?.label ?? ""

function readHash() {
  const h = window.location.hash.replace("#", "")
  return allIds.includes(h) ? h : "intro"
}

function NavList({ route, go, query }: { route: string; go: (id: string) => void; query: string }) {
  const q = query.trim().toLowerCase()
  return (
    <>
      {nav.map((s) => {
        const groups = s.groups
          .map((g) => ({ ...g, items: g.items.filter((i) => !q || i.label.toLowerCase().includes(q)) }))
          .filter((g) => g.items.length > 0)
        if (groups.length === 0) return null
        return (
          <SubNavGroup key={s.label} label={s.label}>
            {groups.map((g, gi) => (
              <React.Fragment key={gi}>
                {g.label && s.groups.length > 1 && (
                  <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase">{g.label}</div>
                )}
                {g.items.map((i) => (
                  <SubNavItem key={i.id} label={i.label} active={route === i.id} onClick={() => go(i.id)} />
                ))}
              </React.Fragment>
            ))}
          </SubNavGroup>
        )
      })}
    </>
  )
}

function NavSearch({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  return (
    <div className="border-b p-2">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Find a page" className="h-8 pl-8" aria-label="Find a page" />
      </div>
    </div>
  )
}

export function DocsSite() {
  const [route, setRoute] = React.useState(readHash)
  const [query, setQuery] = React.useState("")
  const [menu, setMenu] = React.useState(false)
  const { resolved, setTheme } = useTheme()

  React.useEffect(() => {
    const on = () => setRoute(readHash())
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])

  React.useEffect(() => {
    document.title = route === "intro" ? "BotSpace Kit" : `${titleOf(route)} · BotSpace Kit`
    // Page scrolls inside the main pane: go back to the top on every page change.
    document.querySelector("[data-docs-main] .overflow-y-auto")?.scrollTo({ top: 0 })
  }, [route])

  const go = (id: string) => {
    setRoute(id)
    setMenu(false)
    try {
      window.history.replaceState(null, "", `#${id}`)
    } catch {
      // some viewers block history changes; the page still works
    }
  }

  const doc = componentDocs.find((d) => d.id === route)
  const pattern = patternDocs.find((p) => p.id === route)
  const wide = !!pattern

  return (
    <div className="flex h-full min-h-0 bg-background">
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72 gap-0 p-0">
          <SheetTitle className="flex h-14 shrink-0 items-center border-b px-4 text-base">BotSpace Kit</SheetTitle>
          <NavSearch value={query} onChange={setQuery} id="docs-search-mobile" />
          <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Kit pages">
            <NavList route={route} go={go} query={query} />
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1" data-docs-main="">
        <Page
          title={route === "intro" ? "Introduction" : titleOf(route)}
          bodyClassName={wide ? "max-w-[1400px] md:py-8" : "max-w-4xl md:py-8"}
          actions={
            <>
              <span className="hidden text-[13px] text-muted-foreground sm:inline">{sectionOf(route)}</span>
              <Badge variant="outline" className="hidden sm:inline-flex">
                v{KIT_VERSION}
              </Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={resolved === "dark" ? "Use light theme" : "Use dark theme"}
                onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
              >
                {resolved === "dark" ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open the page list" onClick={() => setMenu(true)}>
                <MenuIcon />
              </Button>
            </>
          }
          nav={
            <SubNav
              title="BotSpace Kit"
              action={
                <Badge variant="secondary" className="font-mono">
                  {KIT_VERSION}
                </Badge>
              }
            >
              <NavSearch value={query} onChange={setQuery} id="docs-search" />
              <NavList route={route} go={go} query={query} />
            </SubNav>
          }
        >
          {route === "intro" && <IntroPage go={go} />}
          {route === "colors" && <ColorsPage />}
          {route === "typography" && <TypePage />}
          {route === "radius" && <RadiusPage />}
          {route === "layout" && <LayoutPage />}
          {doc && <ComponentPage key={doc.id} doc={doc} go={go} />}
          {pattern && <PatternPage key={pattern.id} doc={pattern} go={go} />}
        </Page>
      </div>
    </div>
  )
}
