# Changelog

All changes to `@botspace/kit` are in this file. The kit follows [semantic versions](https://semver.org):

- **Patch**: a fix with no visible change.
- **Minor**: a new part, a new prop or a new token.
- **Major**: a token renamed or removed, a prop removed, or a visible change to an existing part.

While the kit is at 0.x, apps pin an exact version.

## 0.1.1 (21 Oct 2026)

No change to components or styles.

- Releases publish with npm trusted publishing (OIDC). The release workflow uses no npm token.
- README: kit.bot.space is live.

## 0.1.0 (21 Oct 2026)

The first release.

### Package

- One npm package, `@botspace/kit`. It exports the stock shadcn primitives (base-nova style on Base UI), the kit blocks, `ThemeProvider` and `cn`.
- `@botspace/kit/styles.css` holds the shadcn base, the BotSpace colour tokens (light and dark), the theme map, the layout sizes and the four shape rules.
- Types ship with the package.

### Primitives

Alert, Avatar, Badge, Button, Card, Checkbox, DropdownMenu, Input, Kbd, Popover, Progress, ScrollArea, Select, Separator, Sheet, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.

### Kit blocks

- Frame: AppFrame, AppRail, SubNav, Page, PaneHeader, Container, Panel, ViewTabs.
- Inbox panes: PaneSection, DetailRow, ListRow, PaneEmpty, MessageBubble, ThreadDivider.
- DataTable (TanStack Table v8) and `selectColumn`.
- StatCards, StatusBadge, SegmentedControl, SettingsTiles.
- FormSection, FormField, FormStack.
- Charts: TimeChart, Legend, BarList, Heatmap, Ring, FlowChart.

### Site and registry

- The reference site at kit.bot.space: Foundations, 28 component pages, 4 live patterns.
- The public shadcn registry at kit.bot.space/r: 10 items for prototypes and small tools.
