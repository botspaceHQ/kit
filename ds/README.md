BotSpace Kit is the UI kit for the new BotSpace dashboard. It is stock shadcn/ui (base-nova style, Base UI, Tailwind 4) with a small BotSpace theme and a set of blocks: the app frame, sectioned inbox panes, a data table, stat cards, charts, settings tiles and two-column forms. Apps install it as one npm package, `@botspace/kit`. A public shadcn registry offers the same parts for prototypes. The OS apps keep their own kit for now.

## Content fundamentals

- Write for the merchant and their support team. Say "you" to the person who reads the screen.
- Use sentence case for every title, button and menu item ("New broadcast", not "New Broadcast").
- Name things the way a merchant knows them: chats, orders, broadcasts, wallet. Do not name the system parts (webhook config, job queue).
- Write buttons as the action they do: "Send broadcast", "Close", "Add money". Show the result in a toast: "Broadcast scheduled".
- Write errors that say what is wrong and how to fix it: "Enter an email address, for example care@nilanaturals.in."
- Write numbers in Indian grouping (1,24,310) and money with the rupee sign (₹18,420). Write times in lower case (10:42 am).
- Do not use emoji in the product UI. Do not use exclamation marks.
- Real examples: "Ask for opt-in in the first WhatsApp reply", "Reply in 4m", "Wallet: about 9 days left".

## Visual foundations

### Colour

- Use the shadcn role tokens for every surface: `background` for pages and panes, `card` for cards, `popover` for menus, `sidebar` for the rail and the section navigation.
- Put body text in `foreground` and secondary text (hints, times, counts) in `muted-foreground`.
- Use `primary` (near-black) for the one main button, the unread count and the selected-row bar. Primary is not a brand colour: colour in BotSpace means state.
- Use `accent` for hover and the selected item in lists and menus. Use `muted` for table heads and quiet blocks.
- Draw every line in `border`. Draw input borders in `input` and the focus ring in `ring`.
- Show state with the tonal pairs: `success`, `warning`, `info`, `danger`, `violet`, each with its `-foreground` text. Always add a word: colour is never the only signal.
- Use `destructive` only for actions you cannot undo.
- Use `bubble-in`, `bubble-out` and `note` only in the inbox thread. Use `brand-wa` and `brand-ig` only for the channel mark.
- Colour chart series with `chart-1` to `chart-5`, in order. Use `chart-5` for Other.
- Do not write a hex value or a Tailwind palette class (`bg-gray-100`) in a component.

### Type

- Set all text in Inter (`sans`) with the `cv11` and `ss01` features on. Set IDs and code in `mono`.
- The base size is 14 px (`body`). Titles are 16 px: `page-title` (600) in headers, `card-title` (500) on cards. The page has no larger headings.
- Use `small` (13 px) for list previews and tile bodies, `caption` (12 px, muted) for hints and counts, `micro` (11 px) only for chart axes and message times.
- Use `stat` (24 px, 600) only for the number in a stat card.
- Use tabular figures wherever numbers line up.

### Lines and layout

- Panes touch. Put one 1 px `border` line between neighbours. Do not use a gap, a shadow or a rounded pane.
- Make every header 56 px (`header-height`) with a line under it, so the lines meet across the screen.
- The frame is an icon rail (`rail-width`, 56 px), an optional section navigation pane (`subnav-width`, 240 px), then the main pane. Inbox list and details panes are `pane-width` (320 px).
- Put view switches, search and filters in their own row under the header, with a full-width line under it.
- The Inbox is fully sectioned: lines cut every pane into sections, and it has no cards. Every other page puts stock cards and tables in a padded column (16 px, 24 px from 768 px, 1,400 px wide at most).
- Use the Tailwind 4 px spacing scale and `gap` on flex and grid parents.

### Radius and shape

- `radius` (8 px) is the base. Inputs, selects, menus and tables use it. Cards use `radius-xl` (11.2 px).
- Buttons, tabs, segmented controls and avatars are pills (`radius-pill`). Badges have 6 px corners (`radius-chip`).
- These shapes come from four rules on `[data-slot]` in the theme. Do not set a radius on a stock component.

### States and motion

- Hover: `muted` on rows, `accent` on navigation items. Selected: `accent`, plus the 2 px `primary` bar on list rows.
- Focus: a 3 px `ring` at 50% on controls, 2 px on navigation items. Never remove the focus ring.
- Disabled: 50% opacity and the not-allowed cursor.
- Motion is short and plain: colour and transform changes only. Respect reduced motion.
- The kit uses no custom shadows. Cards use the stock 1 px ring. Menus and popovers use the stock shadow.

## Iconography

- Use Lucide icons in the product UI: 16 px in controls and navigation, 18 px in the rail, stroke 2.
- Use `brand-wa` and `brand-ig` for the WhatsApp and Instagram marks. Lucide has no brand marks, so the kit draws a simple outline Instagram glyph in the Lucide style.
- OS app marks (the launcher tiles) use Phosphor filled icons. Use Lucide for every other icon in the OS apps too.
- Give every icon-only button an `aria-label` and a tooltip.

## Components

- Stock shadcn parts (Button, Badge, Input, Select, Switch, Checkbox, Tabs, Card, DropdownMenu, Tooltip, Avatar, Sheet) come from the shadcn registry. Do not fork them. The theme shapes them.
- Kit blocks fill the gaps: AppFrame and AppRail, SubNav, Page and PaneHeader, Panel, ViewTabs, SegmentedControl, PaneSection, ListRow, MessageBubble, DataTable, StatCards, StatusBadge, the charts, SettingsTiles and FormSection.
- Map a record's values to StatusBadge tones once, next to the data type. Do not choose a tone inline in a page.
- In a preview or a prototype, call `BotSpaceKit.mount(element, id)` or use the components on `window.BotSpaceKit` with React 18 from the page.

## Install in an app

1. Install the package: `npm install @botspace/kit`.
2. In the app's CSS file, after `@import "tailwindcss";`, add `@import "@botspace/kit/styles.css";` and `@source "../node_modules/@botspace/kit/dist";`.
3. Import parts from `@botspace/kit`. Do not copy kit files into the app.

For a prototype, copy parts in with the shadcn CLI instead:

1. Add `"registries": { "@botspace": "https://kit.bot.space/r/{name}.json" }` to `components.json`.
2. Add the theme: `npx shadcn@latest add @botspace/theme`.
3. Add the parts you need: `npx shadcn@latest add button card @botspace/frame @botspace/data-table`.
