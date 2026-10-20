// Proves the package works for an app: packs @botspace/kit, copies test/consumer (a clean Vite app
// that imports the styles and renders AppFrame, Page and DataTable) to a temp folder, installs the
// tarball, type-checks and builds it, then checks that Tailwind found the kit's classes via @source.
// Run after build:lib: node scripts/consumer-test.ts [--keep]
import { execSync } from "node:child_process"
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const dir = mkdtempSync(join(tmpdir(), "kit-consumer-"))
const run = (cmd: string, cwd: string) => execSync(cmd, { cwd, stdio: "inherit" })

cpSync(root + "test/consumer", dir, { recursive: true })
const tgz = execSync(`npm pack --silent --pack-destination "${dir}"`, { cwd: root, encoding: "utf8" }).trim().split("\n").pop()!
run(`npm install --no-audit --no-fund --loglevel=error "./${tgz}"`, dir)
run("npm run build", dir)

const assets = join(dir, "dist/assets")
const css = readdirSync(assets).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(assets, f), "utf8")).join("")
// max-w-[1400px] comes only from the kit's dist files (Page), so it is missing when the @source
// line is missing. --success: comes from styles.css.
const expected = [".max-w-\\[1400px\\]", "--success:"]
const missing = expected.filter((c) => !css.includes(c))
if (missing.length) throw new Error(`Kit classes missing from the app CSS (check @source): ${missing.join(", ")}`)

console.log(`Consumer test passed: ${tgz} installs, type-checks and builds in ${dir}`)
if (!process.argv.includes("--keep")) rmSync(dir, { recursive: true, force: true })
