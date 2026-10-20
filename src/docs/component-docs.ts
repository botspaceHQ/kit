/* Component reference data. Plain data, no JSX: the reference site and the design-system export
   (scripts/build-ds.ts) both read this file. Write prose in ASD-STE100 (short, active, one topic). */

export type Prop = { name: string; type: string; default?: string; description: string }

export type ComponentDoc = {
  id: string
  name: string
  group: "Frame" | "Inbox" | "Data" | "Charts" | "Forms and settings" | "Status" | "Stock shadcn"
  /** Registry item that installs it. Stock parts install from the shadcn registry. */
  item: string
  /** Where the source lives in this repo. */
  file: string
  summary: string
  /** When to use it, in one or two sentences. */
  use: string
  code: string
  props: Prop[]
  dos: string[]
  donts: string[]
  /** Preview height in the design-system export. */
  height?: number
  /** Layout width of the export card. Wide cards lay out at this width and scale down, so lg: breakpoints apply. */
  width?: number
}

export const componentDocs: ComponentDoc[] = [
  /* ---------------------------------------------------------------- Frame */
  {
    id: "app-frame",
    name: "AppFrame and AppRail",
    group: "Frame",
    item: "frame",
    file: "src/components/kit/app-rail.tsx",
    summary: "The product frame: a 56 px icon rail on the left, then the panes of the page.",
    use: "Use it once, at the root of the product. Under 1024 px the rail hides and a menu button opens the same links in a sheet.",
    code: `<AppFrame
  rail={<AppRail logo={<Logo />} groups={groups} active={route} onSelect={go} />}
  mobileTitle="Nila Naturals"
  mobileNav={(close) => <MobileNav onPick={close} />}
>
  <Page title="Broadcasts">…</Page>
</AppFrame>`,
    props: [
      { name: "rail", type: "ReactNode", description: "The AppRail. Shows from 1024 px." },
      { name: "mobileNav", type: "(close) => ReactNode", description: "Links for the sheet under 1024 px. Call close after a pick." },
      { name: "mobileTitle", type: "ReactNode", description: "Workspace name in the 48 px phone bar." },
      { name: "AppRail.groups", type: "RailGroup[]", description: "Groups of { id, label, icon, count }. The last group sits at the bottom." },
      { name: "AppRail.active", type: "string", description: "The id of the current page." },
      { name: "AppRail.footer", type: "ReactNode", description: "Theme switch and the person's avatar, under a line." },
    ],
    dos: [
      "Give every rail icon a label. The rail shows it as a tooltip and as the aria-label.",
      "Put settings and help in the last group, so they sit at the bottom.",
      "Show a count only for work that waits for the person (open chats, tickets).",
    ],
    donts: [
      "Do not put a gap or a shadow between the rail and the first pane. One line only.",
      "Do not add a second wide sidebar. Use SubNav inside the page for section links.",
    ],
    width: 1100,
    height: 360,
  },
  {
    id: "sub-nav",
    name: "SubNav",
    group: "Frame",
    item: "frame",
    file: "src/components/kit/frame.tsx",
    summary: "The section navigation pane: a 240 px column with a 56 px title row and groups of links.",
    use: "Use it when a page has views or sub-pages (Inbox views, Settings areas, report tabs). Pass it to Page as nav.",
    code: `<SubNav title="Inbox" action={<Button size="icon-sm" variant="ghost" aria-label="New"><PlusIcon /></Button>}>
  <SubNavGroup>
    <SubNavItem icon={InboxIcon} label="Your inbox" count={3} active />
    <SubNavItem icon={UsersRoundIcon} label="All" count={12} />
  </SubNavGroup>
  <SubNavGroup label="Teammates" collapsible>
    <SubNavItem label="Arjun Mehta" count={2} />
  </SubNavGroup>
</SubNav>`,
    props: [
      { name: "title", type: "string", description: "The pane title in the 56 px header." },
      { name: "action", type: "ReactNode", description: "One icon button on the right of the title." },
      { name: "SubNavGroup.label", type: "string", description: "Small group title. Groups are split by full-width lines." },
      { name: "SubNavGroup.collapsible", type: "boolean", default: "false", description: "Lets the person fold the group." },
      { name: "SubNavItem.count", type: "number | string", description: "Right-aligned count in tabular figures." },
      { name: "SubNavItem.active", type: "boolean", description: "Marks the current view with bg-accent and aria-current." },
      { name: "SubNavItem.indent", type: "boolean", description: "Indents a child link under a group." },
    ],
    dos: ["Keep labels short: one to three words.", "Show counts that match the list the link opens."],
    donts: ["Do not put forms or filters in SubNav. Filters go in the Page filter row.", "Do not nest groups more than one level."],
    width: 1100,
    height: 380,
  },
  {
    id: "page",
    name: "Page and PaneHeader",
    group: "Frame",
    item: "frame",
    file: "src/components/kit/frame.tsx",
    summary: "The main pane of a page: a 56 px header, an optional filter row, then padded content that scrolls.",
    use: "Use Page for every page except the Inbox. Use PaneHeader and Container when you build panes by hand (Inbox list, thread, details).",
    code: `<Page
  title="Broadcasts"
  actions={<Button size="sm"><PlusIcon data-icon="inline-start" />New broadcast</Button>}
  filters={<ViewTabs value={tab} onChange={setTab} options={tabs} />}
  nav={<SubNav title="Engage">…</SubNav>}
>
  <StatCards items={stats} />
  <DataTable columns={columns} data={rows} />
</Page>`,
    props: [
      { name: "title", type: "string", description: "Page title, 16 px semibold, in the header." },
      { name: "actions", type: "ReactNode", description: "Buttons on the right of the header. One primary at most." },
      { name: "filters", type: "ReactNode", description: "Filter row under the header, with a full-width line under it." },
      { name: "nav", type: "ReactNode", description: "A SubNav shown to the left of the main pane." },
      { name: "description", type: "ReactNode", description: "One line of muted text above the content." },
      { name: "bodyClassName", type: "string", description: "Extra classes on the content column." },
    ],
    dos: [
      "Keep the header at 56 px. Its line meets the SubNav and rail lines across the screen.",
      "Put view switches and search in filters, not in the header.",
    ],
    donts: ["Do not put a card around the whole page.", "Do not add a second title inside the content."],
    width: 1100,
    height: 300,
  },
  {
    id: "panel",
    name: "Panel",
    group: "Frame",
    item: "frame",
    file: "src/components/kit/frame.tsx",
    summary: "A stock Card with the standard header: title, description and one action.",
    use: "Use it for a chart, a short table or a list on report, home and list pages.",
    code: `<Panel title="Conversations" description="Last 30 days" action={<Button variant="ghost" size="sm">Export</Button>}>
  <TimeChart series={series} labels={days} ariaLabel="Conversations by day" />
</Panel>`,
    props: [
      { name: "title", type: "string", description: "Card title." },
      { name: "description", type: "string", description: "One muted line under the title." },
      { name: "action", type: "ReactNode", description: "Goes into CardAction, top right." },
      { name: "contentClassName", type: "string", description: "Classes on CardContent. Use p-0 for a table that runs edge to edge." },
    ],
    dos: ["Give every panel a title that names the number or the list."],
    donts: ["Do not use Panel inside the Inbox. Inbox panes use PaneSection."],
    height: 220,
  },
  {
    id: "view-tabs",
    name: "ViewTabs",
    group: "Frame",
    item: "frame",
    file: "src/components/kit/frame.tsx",
    summary: "A view switch on stock Tabs, with an optional count for each view.",
    use: "Use it in the Page filter row to switch the rows a list shows (All, Scheduled, Sent).",
    code: `<ViewTabs
  value={view}
  onChange={setView}
  options={[
    { value: "all", label: "All", count: 48 },
    { value: "scheduled", label: "Scheduled", count: 3 },
  ]}
/>`,
    props: [
      { name: "value", type: "string", description: "The current view." },
      { name: "onChange", type: "(value: string) => void", description: "Called with the new view." },
      { name: "options", type: "{ value, label, count? }[]", description: "Two to six views." },
    ],
    dos: ["Show the count for each view, so people know before they click."],
    donts: ["Do not use ViewTabs for page navigation. Use SubNav for that."],
    height: 96,
  },
  {
    id: "segmented",
    name: "SegmentedControl",
    group: "Frame",
    item: "segmented",
    file: "src/components/kit/segmented.tsx",
    summary: "A full-width pill track with a tonal selected segment (Material 3 style).",
    use: "Use it in narrow panes where ViewTabs do not fit, for example the inbox list on a phone.",
    code: `<SegmentedControl
  value={view}
  onChange={setView}
  options={[{ value: "mine", label: "You", count: 3 }, { value: "all", label: "All", count: 12 }]}
/>`,
    props: [
      { name: "value", type: "string", description: "The selected segment." },
      { name: "onChange", type: "(value: string) => void", description: "Called with the new value." },
      { name: "options", type: "{ value, label, count? }[]", description: "Two to four segments." },
      { name: "className", type: "string", description: "Width and responsive classes." },
    ],
    dos: ["Use two to four segments with short labels."],
    donts: ["Do not use it when the choices do not fit on one line. Use a Select."],
    height: 96,
  },

  /* ---------------------------------------------------------------- Inbox */
  {
    id: "pane-section",
    name: "PaneSection and DetailRow",
    group: "Inbox",
    item: "inbox",
    file: "src/components/kit/inbox-panes.tsx",
    summary: "A collapsible block of an inbox pane: a 40 px title row, a padded body, a full-width line under it.",
    use: "Use it for every block in the inbox details pane (Contact, Shopify, Notes). The inbox has no cards.",
    code: `<PaneSection title="Contact" icon={UserRoundIcon} action={<Button variant="ghost" size="icon-sm" aria-label="Edit"><PencilIcon /></Button>}>
  <dl>
    <DetailRow label="Phone">+91 98201 44120</DetailRow>
    <DetailRow label="City">Pune</DetailRow>
  </dl>
</PaneSection>`,
    props: [
      { name: "title", type: "string", description: "Section name, 13 px medium." },
      { name: "count", type: "number", description: "Muted count after the title." },
      { name: "icon", type: "ComponentType", description: "A 16 px Lucide icon before the title." },
      { name: "action", type: "ReactNode", description: "One small ghost button on the right." },
      { name: "defaultOpen", type: "boolean", default: "true", description: "Start open or folded." },
      { name: "flush", type: "boolean", default: "false", description: "No body padding, for lists that run edge to edge." },
      { name: "DetailRow.label", type: "string", description: "Muted key on the left. The value aligns right." },
    ],
    dos: ["Start the two most-used sections open and fold the rest.", "Put key and value pairs in a dl with DetailRow."],
    donts: ["Do not put a Card inside a PaneSection.", "Do not give sections their own background colour."],
    height: 300,
  },
  {
    id: "list-row",
    name: "ListRow",
    group: "Inbox",
    item: "inbox",
    file: "src/components/kit/inbox-panes.tsx",
    summary: "One row of a list pane: avatar, name and time, a preview line, an unread count and chips.",
    use: "Use it for conversation lists and other master lists in a sectioned layout. Put rows in a ul with divide-y.",
    code: `<ul className="divide-y border-b">
  <li>
    <ListRow
      avatar={<Avatar>…</Avatar>}
      title="Ananya Iyer"
      time="2m"
      preview="Is the Kumkumadi oil back in stock?"
      unread={2}
      chips={<StatusBadge tone="warning">Reply in 4m</StatusBadge>}
      active
      onClick={() => open(id)}
    />
  </li>
</ul>`,
    props: [
      { name: "title", type: "string", description: "Name. Semibold when unread." },
      { name: "time", type: "string", description: "Short relative time (2m, 1h, Mon)." },
      { name: "preview", type: "ReactNode", description: "One line, cut with an ellipsis." },
      { name: "unread", type: "number", default: "0", description: "Primary pill on the right of the preview." },
      { name: "chips", type: "ReactNode", description: "Up to two StatusBadges (SLA, labels)." },
      { name: "active", type: "boolean", description: "Selected: bg-accent and a 2 px primary bar on the left edge." },
    ],
    dos: ["Show at most two chips. Put the rest in the details pane."],
    donts: ["Do not use rounded, separated cards for rows. Rows touch and lines split them."],
    height: 260,
  },
  {
    id: "message-bubble",
    name: "MessageBubble",
    group: "Inbox",
    item: "inbox",
    file: "src/components/kit/inbox-panes.tsx",
    summary: "One chat message: incoming on the left, outgoing, AI agent and internal notes on the right.",
    use: "Use it in the thread pane. Use ThreadDivider for day labels and system events.",
    code: `<ThreadDivider>Today</ThreadDivider>
<MessageBubble kind="in" time="10:42 am">Is the oil back in stock?</MessageBubble>
<MessageBubble kind="bot" time="10:42 am">Yes. It ships in 2 days.</MessageBubble>
<MessageBubble kind="note" author="Riya" time="10:44 am">Offer free shipping.</MessageBubble>
<MessageBubble kind="out" time="10:45 am" status="read">Done. Here is your link.</MessageBubble>`,
    props: [
      { name: "kind", type: '"in" | "out" | "bot" | "note"', description: "Who sent it. Sets side and colour." },
      { name: "time", type: "string", description: "Local time, lower case (10:42 am)." },
      { name: "author", type: "string", description: "Name above bot replies and notes." },
      { name: "status", type: '"sent" | "delivered" | "read"', description: "Ticks on outgoing messages." },
    ],
    dos: ["Use the note colour only for internal notes. Customers never see them."],
    donts: ["Do not use brand channel colours for bubbles."],
    height: 320,
  },

  /* ---------------------------------------------------------------- Data */
  {
    id: "data-table",
    name: "DataTable",
    group: "Data",
    item: "data-table",
    file: "src/components/kit/data-table.tsx",
    summary: "One grid for every list page, on TanStack Table v8: sort, select, hide columns, page.",
    use: "Use it for every list of records. It replaces StyledDataGrid and x-data-grid in the dashboard.",
    code: `const columns: ColumnDef<Broadcast, unknown>[] = [
  selectColumn<Broadcast>(),
  { accessorKey: "name", header: "Name" },
  { accessorKey: "sent", header: "Sent", meta: { align: "right" } },
]

<DataTable
  columns={columns}
  data={rows}
  getRowId={(r) => r.id}
  toolbar={<Input placeholder="Search" />}
  bulkActions={(rows, clear) => <Button size="sm" onClick={clear}>Archive {rows.length}</Button>}
  columnLabels={{ sent: "Sent" }}
/>`,
    props: [
      { name: "columns", type: "ColumnDef<T>[]", description: "TanStack columns. meta.align = 'right' for numbers." },
      { name: "data", type: "T[]", description: "The rows." },
      { name: "getRowId", type: "(row: T) => string", description: "Stable ids keep the selection across sorts." },
      { name: "globalFilter", type: "string", description: "Text filter over all columns." },
      { name: "toolbar", type: "ReactNode", description: "Left of the Columns menu. Search and filters." },
      { name: "bulkActions", type: "(rows, clear) => ReactNode", description: "Replaces the toolbar while rows are selected." },
      { name: "onRowClick", type: "(row: T) => void", description: "Opens a record. Adds the pointer cursor." },
      { name: "pageSize", type: "number", default: "8", description: "Rows on a page." },
      { name: "columnLabels", type: "Record<string, string>", description: "Names in the Columns menu." },
      { name: "emptyState", type: "ReactNode", description: "Text when no rows match." },
    ],
    dos: [
      "Align numbers right. The table sets tabular figures for you.",
      "Use StatusBadge for state columns, mapped once next to the data type.",
    ],
    donts: ["Do not build a table by hand for a list page.", "Do not put more than one primary action in bulkActions."],
    width: 1100,
    height: 420,
  },
  {
    id: "stat-cards",
    name: "StatCards",
    group: "Data",
    item: "stat-cards",
    file: "src/components/kit/stat-cards.tsx",
    summary: "A row of shadcn section cards: one number per card, a trend in the corner, context in the footer.",
    use: "Use it at the top of home, list and report pages when the numbers are the point.",
    code: `<StatCards
  items={[
    { label: "Messages sent", value: "1,24,310", trend: <StatusBadge tone="success">+12%</StatusBadge>, hint: "Last 30 days" },
    { label: "Read rate", value: "71%" },
  ]}
/>`,
    props: [
      { name: "items", type: "{ label, value, trend?, hint? }[]", description: "Two to four numbers. Four fill a row on wide screens." },
    ],
    dos: ["Format numbers in Indian grouping (1,24,310) and give units.", "Use four or fewer cards in a row."],
    donts: ["Do not add stat cards that nobody acts on."],
    height: 200,
  },
  {
    id: "status-badge",
    name: "StatusBadge",
    group: "Status",
    item: "status-badge",
    file: "src/components/kit/status-badge.tsx",
    summary: "A stock Badge with BotSpace tonal colours. One map from tone to colour.",
    use: "Use it for the state of a record (paid, scheduled, failed) and for chat labels.",
    code: `const ORDER_TONE: Record<OrderStatus, Tone> = { paid: "success", pending: "warning", voided: "danger" }

<StatusBadge tone={ORDER_TONE[order.status]}>{label}</StatusBadge>`,
    props: [
      { name: "tone", type: '"neutral" | "success" | "warning" | "info" | "danger" | "violet" | "secondary" | "outline"', default: '"neutral"', description: "The colour pair. OS names good, serious and critical map to success, warning and danger." },
      { name: "variant", type: "Tone", description: "Same as tone." },
      { name: "className", type: "string", description: "Size changes only (h-5 px-1.5 in dense rows)." },
    ],
    dos: ["Always show a word. Colour is never the only signal.", "Map values to tones once, next to the data type."],
    donts: ["Do not choose a tone inline in a page.", "Do not use danger for things that are only new or unread."],
    height: 120,
  },

  /* ---------------------------------------------------------------- Charts */
  {
    id: "time-chart",
    name: "TimeChart",
    group: "Charts",
    item: "charts",
    file: "src/components/kit/charts.tsx",
    summary: "Line or stacked area over time, drawn in SVG at the real width, with a hover read-out.",
    use: "Use it for one to five series over days or weeks. Add a Legend above it.",
    code: `<Legend items={[{ label: "WhatsApp", color: "var(--chart-1)" }, { label: "Instagram", color: "var(--chart-2)" }]} />
<TimeChart series={series} labels={days} stacked ariaLabel="Conversations by channel, last 30 days" />`,
    props: [
      { name: "series", type: "{ key, label, values, color }[]", description: "One entry per line. Colours from --chart-1 to --chart-5." },
      { name: "labels", type: "string[]", description: "X-axis labels, one per value." },
      { name: "stacked", type: "boolean", default: "false", description: "Stacked areas with a total in the read-out." },
      { name: "height", type: "number", default: "220", description: "Height in px." },
      { name: "format", type: "(n) => string", description: "Number format for the axis and read-out." },
      { name: "tickEvery", type: "number", default: "7", description: "Show every Nth x label." },
      { name: "ariaLabel", type: "string", description: "Required. Says what the chart shows." },
    ],
    dos: ["Use the chart tokens in order. They work in both themes."],
    donts: ["Do not use more than five series. Group the rest as Other with --chart-5."],
    width: 1000,
    height: 300,
  },
  {
    id: "bar-list",
    name: "BarList",
    group: "Charts",
    item: "charts",
    file: "src/components/kit/charts.tsx",
    summary: "Horizontal bars with the value at the end. For rankings and funnels.",
    use: "Use it for top-N lists: top templates, top agents, drop-off by step.",
    code: `<BarList items={[{ label: "Order confirmed", value: 4210 }, { label: "Cart reminder", value: 2894, hint: "31%" }]} />`,
    props: [
      { name: "items", type: "{ label, value, color?, hint? }[]", description: "Rows, largest first." },
      { name: "format", type: "(n) => string", description: "Number format." },
      { name: "max", type: "number", description: "Scale end. Default is the largest value." },
    ],
    dos: ["Sort rows from largest to smallest."],
    donts: ["Do not use BarList for values over time. Use TimeChart."],
    height: 200,
  },
  {
    id: "heatmap",
    name: "Heatmap",
    group: "Charts",
    item: "charts",
    file: "src/components/kit/charts.tsx",
    summary: "A day by hour grid. The shade is the share of the busiest cell.",
    use: "Use it to show when customers write in, so teams set office hours.",
    code: `<Heatmap rows={["Mon", "Tue", …]} cols={hours} values={grid} />`,
    props: [
      { name: "rows", type: "string[]", description: "Row labels (days)." },
      { name: "cols", type: "string[]", description: "Column labels (hours). Every third shows." },
      { name: "values", type: "number[][]", description: "rows × cols counts." },
      { name: "format", type: "(n) => string", description: "Number in the cell title." },
    ],
    dos: ["Keep the cell title: it gives the exact number on hover."],
    donts: ["Do not use a second colour scale. Shade --chart-1 only."],
    height: 260,
  },
  {
    id: "ring",
    name: "Ring",
    group: "Charts",
    item: "charts",
    file: "src/components/kit/charts.tsx",
    summary: "A thin ring for one percentage, with the number in the middle.",
    use: "Use it for one share that matters, for example the share of chats the AI agent closed.",
    code: `<Ring value={64} label="Closed by the AI agent" />`,
    props: [
      { name: "value", type: "number", description: "0 to 100." },
      { name: "label", type: "string", description: "What the share is. Also the aria-label." },
      { name: "color", type: "string", default: "var(--chart-2)", description: "Ring colour." },
    ],
    dos: ["Put a label next to every ring."],
    donts: ["Do not show three rings in place of a bar chart."],
    height: 140,
  },
  {
    id: "flow-chart",
    name: "FlowChart",
    group: "Charts",
    item: "charts",
    file: "src/components/kit/charts.tsx",
    summary: "A flow (Sankey) chart: columns left to right, bands sized by value.",
    use: "Use it to show where conversations go: AI agent, handed to a person, resolved, dropped.",
    code: `<FlowChart nodes={nodes} links={links} ariaLabel="Where conversations went this week" />`,
    props: [
      { name: "nodes", type: "{ id, label, value, col, color }[]", description: "Boxes. col is the column, from 0." },
      { name: "links", type: "{ source, target, value }[]", description: "Bands between nodes." },
      { name: "height", type: "number", default: "360", description: "Height in px." },
      { name: "ariaLabel", type: "string", description: "Required. Says what the chart shows." },
    ],
    dos: ["Keep to three or four columns."],
    donts: ["Do not use it for fewer than three nodes. Use a BarList."],
    width: 1000,
    height: 380,
  },

  /* ---------------------------------------------------------------- Forms and settings */
  {
    id: "settings-tiles",
    name: "SettingsTiles",
    group: "Forms and settings",
    item: "settings-tiles",
    file: "src/components/kit/settings-tiles.tsx",
    summary: "The settings home: a titled grid of tiles for each group, three across on wide screens.",
    use: "Use it on the Settings home page. Each tile opens one settings page.",
    code: `<SettingsTiles
  groups={[
    { title: "Workspace", tone: "violet", tiles: [
      { icon: BuildingIcon, title: "General", body: "Workspace name, time zone and language.", onClick: open },
    ] },
  ]}
/>`,
    props: [
      { name: "groups", type: "{ title, tone, tiles }[]", description: "One tone per group: violet, success, secondary, warning or info." },
      { name: "tiles[].body", type: "string", description: "One sentence: what a person changes there." },
      { name: "tiles[].badge", type: "ReactNode", description: "A StatusBadge for a state that needs action." },
    ],
    dos: ["Write the body as what the person can change, not how the system works."],
    donts: ["Do not give each tile its own tone."],
    width: 1100,
    height: 300,
  },
  {
    id: "form-section",
    name: "FormSection and FormField",
    group: "Forms and settings",
    item: "form-section",
    file: "src/components/kit/form-section.tsx",
    summary: "A two-column form block: title and one sentence on the left, fields on the right.",
    use: "Use it for settings pages. Stack the blocks in FormStack and put Save in the page header.",
    code: `<FormStack>
  <FormSection title="Workspace name" description="Customers see this name in templates.">
    <FormField id="ws-name" label="Workspace name" hint="Up to 40 characters.">
      <Input id="ws-name" defaultValue="Nila Naturals" />
    </FormField>
  </FormSection>
</FormStack>`,
    props: [
      { name: "FormSection.title", type: "string", description: "What the block sets." },
      { name: "FormSection.description", type: "string", description: "One sentence: what changes when you set it." },
      { name: "FormField.id", type: "string", description: "The id of the control. The label points at it." },
      { name: "FormField.hint", type: "string", description: "Muted help under the control." },
      { name: "FormField.error", type: "string", description: "Replaces the hint. Says what is wrong and how to fix it." },
    ],
    dos: ["Give every control an id and a label.", "Write errors that say how to fix the value."],
    donts: ["Do not put Save at the bottom of each block. One Save in the header."],
    width: 1000,
    height: 280,
  },

  /* ---------------------------------------------------------------- Stock shadcn */
  {
    id: "button",
    name: "Button",
    group: "Stock shadcn",
    item: "button",
    file: "src/components/ui/button.tsx",
    summary: "Stock shadcn Button. The theme makes it a pill.",
    use: "Use default for the one main action, outline and ghost for the rest, secondary for a tonal action.",
    code: `<Button>Send broadcast</Button>
<Button variant="secondary">Save draft</Button>
<Button variant="outline" size="sm"><PlusIcon data-icon="inline-start" />Add</Button>
<Button variant="ghost" size="icon-sm" aria-label="More"><EllipsisIcon /></Button>`,
    props: [
      { name: "variant", type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"', default: '"default"', description: "Look." },
      { name: "size", type: '"xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "Height 24 to 36 px." },
      { name: "render", type: "ReactElement", description: "Base UI: render as a link or another element." },
    ],
    dos: ["Use one default button in a header.", "Give icon-only buttons an aria-label."],
    donts: ["Do not set a radius on a button. The theme sets the pill shape."],
    height: 120,
  },
  {
    id: "badge",
    name: "Badge",
    group: "Stock shadcn",
    item: "badge",
    file: "src/components/ui/badge.tsx",
    summary: "Stock shadcn Badge with 6 px corners. For state, use StatusBadge on top of it.",
    use: "Use it for neutral tags and counts. Use StatusBadge when the badge shows a state.",
    code: `<Badge>New</Badge>
<Badge variant="outline">Draft</Badge>`,
    props: [{ name: "variant", type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"', default: '"default"', description: "Look." }],
    dos: ["Keep badge text to one or two words."],
    donts: ["Do not make a badge a button."],
    height: 96,
  },
  {
    id: "input",
    name: "Input and Textarea",
    group: "Stock shadcn",
    item: "input",
    file: "src/components/ui/input.tsx",
    summary: "Stock shadcn Input and Textarea with 8 px corners.",
    use: "Use them inside FormField so every control has a label.",
    code: `<Input id="search" placeholder="Search name, phone or order" />
<Textarea id="note" placeholder="Write a note" />`,
    props: [
      { name: "aria-invalid", type: "boolean", description: "Shows the error ring." },
      { name: "disabled", type: "boolean", description: "Greys the control out." },
    ],
    dos: ["Write placeholders as examples of real values."],
    donts: ["Do not use a placeholder in place of a label."],
    height: 180,
  },
  {
    id: "select",
    name: "Select",
    group: "Stock shadcn",
    item: "select",
    file: "src/components/ui/select.tsx",
    summary: "Stock shadcn Select on Base UI. Menus have 8 px corners.",
    use: "Use it for one choice from five or more options. For two to four, use SegmentedControl or a radio group.",
    code: `<Select items={zones} defaultValue="Asia/Kolkata">
  <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
  <SelectContent>
    {zones.map((z) => <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>)}
  </SelectContent>
</Select>`,
    props: [
      { name: "items", type: "{ value, label }[]", description: "Base UI uses it to show the label of the value." },
      { name: "SelectTrigger.size", type: '"sm" | "default"', default: '"default"', description: "28 or 32 px." },
    ],
    dos: ["Sort options in an order people expect (A to Z, or most used first)."],
    donts: ["Do not use Select for actions. Use DropdownMenu."],
    height: 120,
  },
  {
    id: "switch",
    name: "Switch and Checkbox",
    group: "Stock shadcn",
    item: "switch",
    file: "src/components/ui/switch.tsx",
    summary: "Stock shadcn Switch and Checkbox.",
    use: "Use Switch for a setting that takes effect at once. Use Checkbox in forms with Save and for row selection.",
    code: `<label className="flex items-center gap-3 text-sm">
  <Switch checked={on} onCheckedChange={setOn} />
  Ask for opt-in in the first reply
</label>`,
    props: [
      { name: "checked", type: "boolean", description: "Controlled value." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called on change." },
    ],
    dos: ["Wrap the control and its text in one label, so the text is clickable."],
    donts: ["Do not use a Switch that needs a Save button."],
    height: 120,
  },
  {
    id: "tabs",
    name: "Tabs",
    group: "Stock shadcn",
    item: "tabs",
    file: "src/components/ui/tabs.tsx",
    summary: "Stock shadcn Tabs. The theme makes the list and triggers pills.",
    use: "Use Tabs to switch panels on one page (report tabs). Use ViewTabs to filter a list.",
    code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`,
    props: [{ name: "TabsList.variant", type: '"default" | "line"', default: '"default"', description: "Pill track or underline." }],
    dos: ["Keep tab labels to one or two words."],
    donts: ["Do not nest tabs inside tabs."],
    height: 140,
  },
  {
    id: "card",
    name: "Card",
    group: "Stock shadcn",
    item: "card",
    file: "src/components/ui/card.tsx",
    summary: "Stock shadcn Card. Used on every page except the Inbox.",
    use: "Use Panel for the usual header. Use Card directly for custom content.",
    code: `<Card>
  <CardHeader>
    <CardTitle>Wallet</CardTitle>
    <CardDescription>Balance for message charges</CardDescription>
  </CardHeader>
  <CardContent>₹18,420</CardContent>
</Card>`,
    props: [{ name: "size", type: '"default" | "sm"', default: '"default"', description: "16 or 12 px inner spacing." }],
    dos: ["Use cards on list, report, home and settings pages."],
    donts: ["Do not put cards in the Inbox.", "Do not put a card inside a card."],
    height: 180,
  },
  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    group: "Stock shadcn",
    item: "dropdown-menu",
    file: "src/components/ui/dropdown-menu.tsx",
    summary: "Stock shadcn DropdownMenu on Base UI. Menus have 8 px corners.",
    use: "Use it for actions on a record and for small pickers (assign, status filter).",
    code: `<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" size="sm">Open</Button>} />
  <DropdownMenuContent align="end">
    <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
      <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
    props: [
      { name: "DropdownMenuTrigger.render", type: "ReactElement", description: "The button that opens the menu." },
      { name: "DropdownMenuContent.align", type: '"start" | "center" | "end"', description: "Edge to line up with." },
    ],
    dos: ["Put destructive items last, after a separator."],
    donts: ["Do not hide the only way to do a main task in a menu."],
    height: 120,
  },
  {
    id: "tooltip",
    name: "Tooltip and Avatar",
    group: "Stock shadcn",
    item: "tooltip",
    file: "src/components/ui/tooltip.tsx",
    summary: "Stock shadcn Tooltip and Avatar. Avatars are circles.",
    use: "Use a tooltip to name an icon-only control. Use Avatar with initials when there is no photo.",
    code: `<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Assign"><UserRoundPlusIcon /></Button>} />
  <TooltipContent>Assign</TooltipContent>
</Tooltip>`,
    props: [{ name: "TooltipContent.side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Side to show on." }],
    dos: ["Keep tooltips to a few words."],
    donts: ["Do not put information in a tooltip that people need to finish a task."],
    height: 120,
  },
]

export const componentGroups = [
  "Frame",
  "Inbox",
  "Data",
  "Status",
  "Charts",
  "Forms and settings",
  "Stock shadcn",
] as const
