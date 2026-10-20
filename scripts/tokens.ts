// Reads src/styles/botspace-tokens.css into a list. Shared by the reference site, the registry
// sync and the design-system export, so the CSS file is the one source for values and notes.

export type Token = {
  name: string
  light: string
  dark?: string
  note: string
  group: string
}

/** Group titles, in file order. A blank line in the :root block starts the next group. */
const GROUPS = ["Radius", "Core roles", "Navigation", "Status", "Chat and marks", "Charts"]

function block(css: string, selector: string) {
  const i = css.indexOf(`${selector} {`)
  if (i < 0) return ""
  return css.slice(css.indexOf("{", i) + 1, css.indexOf("\n}", i))
}

export function parseTokens(css: string): Token[] {
  const out: Token[] = []
  let group = 0
  let seen = false
  for (const line of block(css, ":root").split("\n")) {
    if (!line.trim()) {
      if (seen) group++
      seen = false
      continue
    }
    const m = /--([\w-]+):\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/.exec(line)
    if (!m) continue
    seen = true
    out.push({ name: m[1], light: m[2].trim(), note: m[3] ?? "", group: GROUPS[group] ?? "Other" })
  }
  const dark = block(css, ".dark")
  for (const m of dark.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    const t = out.find((x) => x.name === m[1])
    if (t) t.dark = m[2].trim()
  }
  return out
}

/** WCAG 2 contrast ratio of two #rrggbb colours. */
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const n = hex.replace("#", "")
    const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    const [r, g, bl] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
