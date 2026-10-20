import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderState = {
  theme: Theme
  resolved: "dark" | "light"
  setTheme: (theme: Theme) => void
}

const QUERY = "(prefers-color-scheme: dark)"
const KEY = "bs-kit-theme"

const ThemeContext = React.createContext<ThemeProviderState | undefined>(
  undefined
)

function readStored(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === "dark" || v === "light" || v === "system") return v
  } catch {
    // storage blocked: fall back to system
  }
  return "system"
}

function systemTheme(): "dark" | "light" {
  // The artifact viewer may pin a theme on <html data-theme>.
  const pinned = document.documentElement.getAttribute("data-theme")
  if (pinned === "dark" || pinned === "light") return pinned
  return window.matchMedia(QUERY).matches ? "dark" : "light"
}

/** The theme this page should show now: the stored choice, else the viewer's or the system's. */
export function initialTheme(): "dark" | "light" {
  const t = readStored()
  return t === "system" ? systemTheme() : t
}

/**
 * Set the theme class on <html>. Colour transitions are switched off for the change: without this,
 * every element with transition-colors animates from the old theme, and where the browser holds
 * frames (a background tab, a throttled frame) the old colours stay, for example black text on dark.
 */
export function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement
  if (root.classList.contains("dark") === (resolved === "dark") && root.style.colorScheme === resolved) return
  const off = document.createElement("style")
  off.textContent = "*,*::before,*::after{transition:none!important}"
  document.head.appendChild(off)
  root.classList.toggle("dark", resolved === "dark")
  root.style.colorScheme = resolved
  // Force the new styles before transitions come back.
  void window.getComputedStyle(document.body).color
  setTimeout(() => off.remove(), 0)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(readStored)
  const [system, setSystem] = React.useState<"dark" | "light">(systemTheme)
  const resolved = theme === "system" ? system : theme

  React.useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const update = () => setSystem(systemTheme())
    mq.addEventListener("change", update)
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    return () => {
      mq.removeEventListener("change", update)
      obs.disconnect()
    }
  }, [])

  React.useLayoutEffect(() => applyTheme(resolved), [resolved])

  const setTheme = React.useCallback((next: Theme) => {
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // ignore
    }
    setThemeState(next)
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
