# BotSpace Kit

The UI kit for the new BotSpace dashboard. It is stock shadcn/ui (base-nova style, Base UI, Tailwind 4) with a small BotSpace theme and a set of blocks. Apps install it as one npm package, `@botspace/kit`. The OS apps keep their own kit for now. This repo holds four things:

- **The package.** `npm run build:lib` writes `@botspace/kit` to `dist/`: the primitives, the kit blocks, `styles.css` and types.

- **The registry.** `registry.json` lists 10 items. `npm run build:registry` writes them to `public/r/*.json`. Apps install them with the shadcn CLI.
- **The reference site.** `src/docs` (Foundations, Components, Patterns). `npm run build` writes one self-contained `site/index.html` plus `site/r/`. kit.bot.space serves this folder.
- **The design-system export.** `npm run build:ds` writes `ds-out/project/`, the files of the BotSpace Kit Design System artifact (tokens, brand book, live previews on a bundle that runs on React 18 globals).

## Where things live

| Path | What |
| --- | --- |
| `src/styles/botspace-tokens.css` | Colour tokens, light and dark. One token on each line, with its usage note. The one source for values. |
| `src/styles/botspace-kit.css` | The theme map, layout sizes, the four shape rules, the base layer. |
| `src/components/ui/` | Stock shadcn parts. Do not edit them. |
| `src/components/kit/` | The kit blocks. These are the registry sources. |
| `src/docs/` | The reference site, and the data the design-system export reads (`component-docs.ts`, `pattern-docs.ts`, `type-scale.ts`). |
| `src/examples/` | The four pattern pages (Inbox, Broadcasts, Reports, Settings) with sample data. |
| `ds/` | Design-system bundle entry, cover and brand book source. |
| `src/index.ts` | The package entry. `build-lib.ts` writes it. Do not edit. |
| `scripts/` | `build-lib.ts` (npm package), `consumer-test.ts` (install test), `sync-theme.ts` (CSS to registry theme item), `build-ds.ts` (design-system export), `tokens.ts`. |
| `test/consumer/` | A clean Vite app. `consumer-test.ts` installs the packed package into a copy of it and builds it. |
| `.github/workflows/` | `ci.yml` builds on every push. `release.yml` publishes and deploys on a `v*` tag. |

## Commands

```bash
npm run dev
```

```bash
npm run build
```

`npm run build` runs, in order: the TypeScript check, `build:registry`, the site build, `build:ds` and `build:lib`.

```bash
node scripts/consumer-test.ts
```

## Use the kit in an app (npm)

1. Install the package: `npm install @botspace/kit`. It needs React 19 and Tailwind 4.
2. In the app's CSS file, import the styles after Tailwind. Add one `@source` line for the package, so Tailwind sees the classes the kit uses. The path is relative to the CSS file.

   ```css
   @import "tailwindcss";
   @import "@botspace/kit/styles.css";
   @source "../node_modules/@botspace/kit/dist";
   ```

3. Wrap the app in `ThemeProvider` and `TooltipProvider`.
4. Import every part from the package: `import { Page, DataTable, Button } from "@botspace/kit"`.
5. Load Inter on the page (Google Fonts or `@fontsource-variable/inter`).

## Install the kit in a prototype (registry)

1. Set up shadcn with the base-nova style: `npx shadcn@latest init`.
2. Add the registry to `components.json`: `"registries": { "@botspace": "https://kit.bot.space/r/{name}.json" }`.
3. Add the theme: `npx shadcn@latest add @botspace/theme`.
4. Add parts: `npx shadcn@latest add @botspace/frame @botspace/data-table`.

Until kit.bot.space is live, serve `public/` on a local port and point the registry URL at it.

## Change the kit

1. Change a value in `botspace-tokens.css` or a block in `src/components/kit/`.
2. Update its entry in `src/docs/component-docs.ts` (props, do, don't).
3. Raise `meta.version` of the item in `registry.json` and the `version` in `package.json`.
4. Add an entry to `CHANGELOG.md`.
5. Run `npm run build` and check the change in light and dark on the reference site.

## Release

1. Merge the change to `main`. CI must pass.
2. Tag the commit with the version in `package.json`: `git tag v0.1.1`.
3. Push the tag: `git push origin v0.1.1`.

The release workflow builds, runs the install test, publishes `@botspace/kit` to npm and deploys `site/` to kit.bot.space. It skips the npm step when that version is already on npm.

- npm: the package uses npm trusted publishing. GitHub Actions signs in with OIDC, so there is no npm token. The trusted publisher on npmjs.com is `botspaceHQ/kit`, workflow `release.yml`. The npm account is `botspace`.
- Vercel: three repo secrets, `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
