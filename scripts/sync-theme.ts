// Fills the "theme" item of registry.json from the two CSS files, so the CSS stays the one source.
// Run: node scripts/sync-theme.ts (Node 22.18+ runs TypeScript as is).
import { readFileSync, writeFileSync } from "node:fs"
import { parseTokens } from "./tokens.ts"

const root = new URL("../", import.meta.url)
const read = (p: string) => readFileSync(new URL(p, root), "utf8")

const tokens = parseTokens(read("src/styles/botspace-tokens.css"))
const kit = read("src/styles/botspace-kit.css")

const vars = (block: string) =>
  Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))

const themeBlock = /@theme inline\s*{([\s\S]*?)\n}/.exec(kit)?.[1] ?? ""
const layoutBlock = /:root\s*{([\s\S]*?)}/.exec(kit)?.[1] ?? ""

const light: Record<string, string> = {}
const dark: Record<string, string> = {}
for (const t of tokens) {
  light[t.name] = t.light
  if (t.dark && t.dark !== t.light) dark[t.name] = t.dark
}

const registryPath = new URL("registry.json", root)
const registry = JSON.parse(readFileSync(registryPath, "utf8"))
const item = registry.items.find((i: { name: string }) => i.name === "theme")
item.cssVars = { theme: vars(themeBlock), light, dark }
item.css = {
  // Layout sizes are plain custom properties, not theme colours: keep them out of cssVars.
  ":root": Object.fromEntries(Object.entries(vars(layoutBlock)).map(([k, v]) => [`--${k}`, v])),
  '[data-slot="button"]': { "border-radius": "9999px" },
  '[data-slot="badge"]': { "border-radius": "6px" },
  '[data-slot="tabs-list"], [data-slot="tabs-trigger"]': { "border-radius": "9999px" },
  '[data-slot="avatar"], [data-slot="avatar-fallback"]': { "border-radius": "9999px" },
  'button:not(:disabled), [role="button"]:not([aria-disabled="true"]), a[href], label[for], summary': { cursor: "pointer" },
  'button:disabled, [aria-disabled="true"]': { cursor: "not-allowed" },
  "@layer base": { body: { "font-feature-settings": "'cv11', 'ss01'" } },
}
writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n")
console.log(`theme: ${Object.keys(light).length} light, ${Object.keys(dark).length} dark, ${Object.keys(item.cssVars.theme).length} theme vars`)
