/* Page patterns. Plain data, read by the reference site and the design-system export. */

export type PatternDoc = {
  id: string
  name: string
  example: "inbox" | "broadcasts" | "reports" | "settings"
  summary: string
  anatomy: [string, string][]
  rules: string[]
  uses: string[]
}

export const patternDocs: PatternDoc[] = [
  {
    id: "inbox-pattern",
    name: "Inbox sections",
    example: "inbox",
    summary: "The Inbox is fully sectioned, in the Chats OS style: four panes that touch, cut into sections by lines. It has no cards.",
    anatomy: [
      ["Views pane (SubNav)", "Your inbox, Mentions, Unassigned, All, then teammates and team inboxes. Counts are open chats."],
      ["List pane (320 px)", "PaneHeader with the view name and a status menu, a search row, then ListRows split by lines."],
      ["Thread pane (fills)", "PaneHeader with the contact, assignee and Close. MessageBubbles, then the composer on a line."],
      ["Details pane (320 px)", "PaneSections: Contact, Shopify orders, Notes, AI copilot. The first two start open."],
    ],
    rules: [
      "Use PaneSection for every block in the details pane. Do not use Card or Panel in the Inbox.",
      "Mark the selected conversation with bg-accent and the 2 px primary bar. Do not use a ring or a shadow.",
      "Show at most two chips on a row: the SLA first, then one label.",
      "Under 768 px show one pane at a time, with a Back button in the thread header.",
    ],
    uses: ["sub-nav", "list-row", "message-bubble", "pane-section", "status-badge", "segmented"],
  },
  {
    id: "list-pattern",
    name: "List page",
    example: "broadcasts",
    summary: "A page of records: SubNav for areas, a header with one main action, a filter row, stat cards, then one DataTable.",
    anatomy: [
      ["Header", "Page title and one default button (New broadcast)."],
      ["Filter row", "ViewTabs with counts on the left, search and filters on the right."],
      ["Stat cards", "Up to four numbers that matter for this list."],
      ["DataTable", "Sortable columns, row selection with bulk actions, the Columns menu, paging."],
    ],
    rules: [
      "Use DataTable for the records. Do not build a table by hand.",
      "Map each status to a tone once, next to the data type, and show it with StatusBadge.",
      "Align numbers right. Format them in Indian grouping.",
      "Open a record on row click. Put row actions in a menu at the end of the row.",
    ],
    uses: ["page", "view-tabs", "stat-cards", "data-table", "status-badge"],
  },
  {
    id: "report-pattern",
    name: "Report page",
    example: "reports",
    summary: "A page of numbers: stat cards first, then Panels with charts in a two-column grid, then tables.",
    anatomy: [
      ["Header and filter row", "Title, the date range and Export. Tabs for report areas (Overview, Team, AI agent, Attribution)."],
      ["Stat cards", "The headline numbers with the change against the last period."],
      ["Chart panels", "Panel with a title that names the number, a Legend, then the chart."],
      ["Tables", "DataTable or a stock Table in a Panel for the rows behind the charts."],
    ],
    rules: [
      "Put the summary before the detail: numbers, then charts, then tables.",
      "Colour series with --chart-1 to --chart-5 in order. Use --chart-5 for Other.",
      "Give every chart an ariaLabel that says what it shows.",
      "Show a delta as a word and a sign (+12%), not as colour alone.",
    ],
    uses: ["stat-cards", "panel", "time-chart", "bar-list", "heatmap", "ring", "flow-chart"],
  },
  {
    id: "settings-pattern",
    name: "Settings page",
    example: "settings",
    summary: "Settings home is a grid of tiles. Each settings page is a stack of two-column FormSections with one Save in the header.",
    anatomy: [
      ["SubNav", "Search, Home, then one collapsible group for each area (Workspace, Channels, Inbox and AI, Billing)."],
      ["Home", "SettingsTiles: one tone per group, one sentence per tile, a badge for a state that needs action."],
      ["Settings page", "FormStack of FormSections: what it is on the left, fields on the right."],
      ["Save", "One Save button in the page header. Switches that act at once need no Save."],
    ],
    rules: [
      "Write tile and section text as what the person changes, not how the system works.",
      "Give every control an id and a FormField label.",
      "Write errors that say what is wrong and how to fix it.",
      "Do not put a Save button in each section.",
    ],
    uses: ["sub-nav", "settings-tiles", "form-section", "input", "switch", "select"],
  },
]
