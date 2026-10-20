import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  AtSignIcon,
  BarChart3Icon,
  BotIcon,
  BuildingIcon,
  ClockIcon,
  EllipsisIcon,
  HouseIcon,
  InboxIcon,
  KeyRoundIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  UserRoundIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
  WalletIcon,
  WorkflowIcon,
} from "lucide-react"

import logo from "@/assets/botspace-logo-white.svg"
import { AppFrame, AppRail, type RailGroup } from "@/components/kit/app-rail"
import { BarList, FlowChart, Heatmap, Legend, Ring, TimeChart } from "@/components/kit/charts"
import { DataTable, selectColumn } from "@/components/kit/data-table"
import { FormField, FormSection } from "@/components/kit/form-section"
import { Page, PaneHeader, Panel, SubNav, SubNavGroup, SubNavItem, ViewTabs } from "@/components/kit/frame"
import { DetailRow, ListRow, MessageBubble, PaneSection, ThreadDivider } from "@/components/kit/inbox-panes"
import { SegmentedControl } from "@/components/kit/segmented"
import { SettingsTiles } from "@/components/kit/settings-tiles"
import { StatCards } from "@/components/kit/stat-cards"
import { StatusBadge, type Tone } from "@/components/kit/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { aiResolved, days30, flowLinks, flowNodes, handedOver, heat, hours, reasons, weekdays } from "@/data/reports"

/* Live demos, keyed by the ids in component-docs.ts. The reference site and the
   design-system bundle both render these, so a demo is written once. */

export const railGroups: RailGroup[] = [
  {
    items: [
      { id: "home", label: "Home", icon: HouseIcon },
      { id: "inbox", label: "Inbox", icon: InboxIcon, count: 12 },
    ],
  },
  {
    items: [
      { id: "workflows", label: "Workflows", icon: WorkflowIcon },
      { id: "broadcasts", label: "Broadcasts", icon: MegaphoneIcon },
      { id: "reports", label: "Reports", icon: BarChart3Icon },
    ],
  },
  { items: [{ id: "settings", label: "Settings", icon: SettingsIcon }] },
]

export function Logo() {
  return (
    <span className="grid size-8 place-items-center rounded-md bg-primary">
      <img src={logo} alt="BotSpace" className="size-4 dark:invert" />
    </span>
  )
}

function Initials({ text, className }: { text: string; className?: string }) {
  return (
    <Avatar>
      <AvatarFallback className={className ?? "bg-secondary text-xs font-semibold text-secondary-foreground"}>{text}</AvatarFallback>
    </Avatar>
  )
}

function AppFrameDemo() {
  const [active, setActive] = React.useState("broadcasts")
  return (
    <div className="h-[340px] overflow-hidden rounded-lg border">
      <AppFrame
        rail={
          <AppRail
            logo={<Logo />}
            groups={railGroups}
            active={active}
            onSelect={setActive}
            footer={
              <Button variant="ghost" size="icon-sm" aria-label="Use dark theme">
                <MoonIcon />
              </Button>
            }
          />
        }
        mobileTitle="Nila Naturals"
        mobileNav={(close) => (
          <nav className="flex flex-col gap-0.5 p-2">
            {railGroups.flatMap((g) => g.items).map((i) => (
              <SubNavItem key={i.id} icon={i.icon} label={i.label} active={i.id === active} onClick={() => { setActive(i.id); close() }} />
            ))}
          </nav>
        )}
      >
        <Page title={railGroups.flatMap((g) => g.items).find((i) => i.id === active)?.label ?? ""} actions={<Button size="sm">New</Button>}>
          <p className="text-sm text-muted-foreground">Pick an icon in the rail. The header line meets the rail line.</p>
        </Page>
      </AppFrame>
    </div>
  )
}

function SubNavDemo() {
  const [view, setView] = React.useState("mine")
  return (
    <div className="flex h-[360px] overflow-hidden rounded-lg border [&>div]:flex [&>div]:border-l-0">
      <SubNav
        title="Inbox"
        action={
          <Button variant="ghost" size="icon-sm" aria-label="New conversation">
            <PlusIcon />
          </Button>
        }
      >
        <SubNavGroup>
          <SubNavItem icon={InboxIcon} label="Your inbox" count={3} active={view === "mine"} onClick={() => setView("mine")} />
          <SubNavItem icon={AtSignIcon} label="Mentions" count={0} active={view === "mentions"} onClick={() => setView("mentions")} />
          <SubNavItem icon={UsersRoundIcon} label="All" count={12} active={view === "all"} onClick={() => setView("all")} />
        </SubNavGroup>
        <SubNavGroup label="Teammates" collapsible>
          <SubNavItem icon={UserRoundIcon} label="Arjun Mehta" count={2} active={view === "arjun"} onClick={() => setView("arjun")} />
          <SubNavItem icon={BotIcon} label="AI agent" count={7} active={view === "ai"} onClick={() => setView("ai")} />
        </SubNavGroup>
      </SubNav>
    </div>
  )
}

function PageDemo() {
  const [tab, setTab] = React.useState("all")
  return (
    <div className="flex h-[280px] overflow-hidden rounded-lg border [&>div]:border-l-0">
      <Page
        title="Broadcasts"
        actions={
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            New broadcast
          </Button>
        }
        filters={
          <ViewTabs
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: "All", count: 48 },
              { value: "scheduled", label: "Scheduled", count: 3 },
              { value: "sent", label: "Sent", count: 45 },
            ]}
          />
        }
      >
        <Panel title="Diwali glow sale" description="Scheduled for 28 Oct, 7:00 pm">
          <p className="text-sm text-muted-foreground">12,480 contacts who opted in.</p>
        </Panel>
      </Page>
    </div>
  )
}

function PanelDemo() {
  return (
    <Panel title="Top reasons customers write" description="Last 30 days" action={<Button variant="ghost" size="sm">Export</Button>}>
      <BarList items={reasons.slice(0, 3)} />
    </Panel>
  )
}

function ViewTabsDemo() {
  const [v, setV] = React.useState("all")
  return (
    <ViewTabs
      value={v}
      onChange={setV}
      options={[
        { value: "all", label: "All", count: 48 },
        { value: "scheduled", label: "Scheduled", count: 3 },
        { value: "failed", label: "Failed", count: 1 },
      ]}
    />
  )
}

function SegmentedDemo() {
  const [v, setV] = React.useState("mine")
  return (
    <div className="max-w-sm">
      <SegmentedControl
        value={v}
        onChange={setV}
        options={[
          { value: "mine", label: "You", count: 3 },
          { value: "unassigned", label: "Unassigned", count: 1 },
          { value: "all", label: "All", count: 12 },
        ]}
      />
    </div>
  )
}

function PaneSectionDemo() {
  return (
    <div className="max-w-[320px] overflow-hidden rounded-lg border [&>section:last-child]:border-b-0">
      <PaneHeader>
        <h2 className="text-sm font-semibold">Details</h2>
      </PaneHeader>
      <PaneSection
        title="Contact"
        icon={UserRoundIcon}
        action={
          <Button variant="ghost" size="icon-sm" aria-label="Edit contact">
            <PencilIcon />
          </Button>
        }
      >
        <dl>
          <DetailRow label="Phone">+91 98201 44120</DetailRow>
          <DetailRow label="City">Pune</DetailRow>
          <DetailRow label="Opted in">Yes, 12 Aug 2026</DetailRow>
        </dl>
      </PaneSection>
      <PaneSection title="Shopify orders" icon={ShoppingBagIcon} count={3} defaultOpen={false}>
        <p className="text-sm">#1042 · ₹1,890</p>
      </PaneSection>
    </div>
  )
}

function ListRowDemo() {
  const [active, setActive] = React.useState("a")
  return (
    <ul className="max-w-[320px] divide-y overflow-hidden rounded-lg border">
      <li>
        <ListRow
          avatar={<Initials text="AI" className="bg-success text-xs font-semibold text-success-foreground" />}
          title="Ananya Iyer"
          time="2m"
          preview="Is the Kumkumadi oil back in stock?"
          unread={2}
          chips={
            <StatusBadge tone="warning" className="h-5 px-1.5">
              <ClockIcon />
              Reply in 4m
            </StatusBadge>
          }
          active={active === "a"}
          onClick={() => setActive("a")}
        />
      </li>
      <li>
        <ListRow
          avatar={<Initials text="RK" />}
          title="Rohan Kapoor"
          time="1h"
          preview="You: Your order is out for delivery."
          chips={<StatusBadge tone="info" className="h-5 px-1.5">Order #1042</StatusBadge>}
          active={active === "b"}
          onClick={() => setActive("b")}
        />
      </li>
    </ul>
  )
}

function MessageBubbleDemo() {
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <ThreadDivider>Today</ThreadDivider>
      <MessageBubble kind="in" time="10:42 am">Is the Kumkumadi oil back in stock?</MessageBubble>
      <MessageBubble kind="bot" time="10:42 am">Yes. The 30 ml bottle is back. It ships in 2 days.</MessageBubble>
      <ThreadDivider event>
        <UserRoundPlusIcon className="size-3.5" />
        AI agent assigned this to Riya Sharma
      </ThreadDivider>
      <MessageBubble kind="note" author="Riya Sharma" time="10:44 am">Offer free shipping. She is a repeat buyer.</MessageBubble>
      <MessageBubble kind="out" time="10:45 am" status="read">Done. Shipping is free on this order.</MessageBubble>
    </div>
  )
}

type Row = { id: string; name: string; status: "COMPLETED" | "SCHEDULED" | "FAILED"; sent: number; read: number }
const statusTone: Record<Row["status"], { label: string; tone: Tone }> = {
  COMPLETED: { label: "Sent", tone: "success" },
  SCHEDULED: { label: "Scheduled", tone: "info" },
  FAILED: { label: "Failed", tone: "danger" },
}
const rows: Row[] = [
  { id: "1", name: "Diwali glow sale · VIP preview", status: "SCHEDULED", sent: 0, read: 0 },
  { id: "2", name: "Kumkumadi oil restock", status: "COMPLETED", sent: 8412, read: 6105 },
  { id: "3", name: "New arrivals · rose range", status: "COMPLETED", sent: 12480, read: 8211 },
  { id: "4", name: "Abandoned cart · last call", status: "FAILED", sent: 214, read: 0 },
  { id: "5", name: "Welcome back offer", status: "COMPLETED", sent: 3920, read: 2874 },
]
const nf = (n: number) => n.toLocaleString("en-IN")
const columns: ColumnDef<Row, unknown>[] = [
  selectColumn<Row>(),
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge tone={statusTone[row.original.status].tone}>{statusTone[row.original.status].label}</StatusBadge>,
  },
  { accessorKey: "sent", header: "Sent", meta: { align: "right" }, cell: ({ getValue }) => nf(getValue() as number) },
  { accessorKey: "read", header: "Read", meta: { align: "right" }, cell: ({ getValue }) => nf(getValue() as number) },
]

function DataTableDemo() {
  const [q, setQ] = React.useState("")
  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(r) => r.id}
      globalFilter={q}
      pageSize={5}
      columnLabels={{ name: "Name", status: "Status", sent: "Sent", read: "Read" }}
      toolbar={
        <div className="relative w-full max-w-64">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="demo-table-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search broadcasts" className="h-8 pl-8" />
        </div>
      }
      bulkActions={(sel, clear) => (
        <Button size="sm" variant="outline" onClick={clear}>
          Archive {sel.length}
        </Button>
      )}
    />
  )
}

function StatCardsDemo() {
  return (
    <StatCards
      items={[
        { label: "Messages sent", value: "1,24,310", trend: <StatusBadge tone="success">+12%</StatusBadge>, hint: "Last 30 days" },
        { label: "Read rate", value: "71%", trend: <StatusBadge tone="success">+3 pts</StatusBadge>, hint: "Industry median 58%" },
        { label: "Revenue from chats", value: "₹6,71,400", hint: "Orders with a chat in 7 days" },
        { label: "Wallet", value: "₹18,420", trend: <StatusBadge tone="warning">Low</StatusBadge>, hint: "About 9 days left" },
      ]}
    />
  )
}

function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge tone="success">Paid</StatusBadge>
      <StatusBadge tone="warning">Unpaid COD</StatusBadge>
      <StatusBadge tone="info">In transit</StatusBadge>
      <StatusBadge tone="danger">Failed</StatusBadge>
      <StatusBadge tone="violet">AI agent</StatusBadge>
      <StatusBadge tone="secondary">VIP</StatusBadge>
      <StatusBadge tone="neutral">Refunded</StatusBadge>
      <StatusBadge tone="outline">Draft</StatusBadge>
    </div>
  )
}

function TimeChartDemo() {
  const series = [
    { key: "ai", label: "Resolved by AI agent", values: aiResolved, color: "var(--chart-1)" },
    { key: "team", label: "Handed to team", values: handedOver, color: "var(--chart-3)" },
  ]
  return (
    <div className="flex flex-col gap-3">
      <Legend items={series.map((s) => ({ label: s.label, color: s.color }))} />
      <TimeChart series={series} labels={days30} stacked ariaLabel="Conversations by outcome, last 30 days" />
    </div>
  )
}

function HeatmapDemo() {
  return <Heatmap rows={weekdays} cols={hours} values={heat} />
}

function RingDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <Ring value={64} label="Closed by the AI agent" />
      <Ring value={93} label="First reply inside SLA" color="var(--chart-1)" />
    </div>
  )
}

function SettingsTilesDemo() {
  return (
    <SettingsTiles
      groups={[
        {
          title: "Workspace",
          tone: "violet",
          tiles: [
            { icon: BuildingIcon, title: "General", body: "Workspace name, time zone, currency and language." },
            { icon: ShieldCheckIcon, title: "Security", body: "Two-step sign-in and allowed email domains.", badge: <StatusBadge tone="warning">Review</StatusBadge> },
            { icon: KeyRoundIcon, title: "API keys", body: "Public API keys and webhooks for your developers." },
          ],
        },
        {
          title: "Billing",
          tone: "warning",
          tiles: [
            { icon: WalletIcon, title: "Wallet", body: "Balance for message charges, top-ups and auto-recharge." },
            { icon: MessageCircleIcon, title: "Usage", body: "Conversations, AI replies and message charges by day." },
          ],
        },
      ]}
    />
  )
}

function FormSectionDemo() {
  const [optIn, setOptIn] = React.useState(true)
  return (
    <div className="flex flex-col gap-4">
      <FormSection title="Workspace name" description="Customers see this name in WhatsApp templates and the website chat.">
        <FormField id="demo-ws-name" label="Workspace name" hint="Up to 40 characters.">
          <Input id="demo-ws-name" defaultValue="Nila Naturals" />
        </FormField>
        <FormField id="demo-ws-email" label="Reply-to email" error="Enter an email address, for example care@nilanaturals.in.">
          <Input id="demo-ws-email" defaultValue="care@nila" aria-invalid />
        </FormField>
      </FormSection>
      <FormSection title="Marketing consent" description="Broadcasts only go to contacts who opted in.">
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={optIn} onCheckedChange={(v) => setOptIn(!!v)} />
          Ask for opt-in in the first WhatsApp reply
        </label>
      </FormSection>
    </div>
  )
}

function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Send broadcast</Button>
      <Button variant="secondary">Save draft</Button>
      <Button variant="outline">
        <PlusIcon data-icon="inline-start" />
        Add contact
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="ghost" size="icon-sm" aria-label="More actions">
        <EllipsisIcon />
      </Button>
    </div>
  )
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>New</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="destructive">Blocked</Badge>
    </div>
  )
}

function InputDemo() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id="demo-search" placeholder="Search name, phone or order" className="pl-8" />
      </div>
      <Textarea id="demo-note" placeholder="Write an internal note. Customers do not see it." />
    </div>
  )
}

const zones = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4:00)" },
  { value: "Europe/London", label: "Europe/London (GMT+1:00)" },
  { value: "America/New_York", label: "America/New_York (GMT-4:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (GMT+8:00)" },
]

function SelectDemo() {
  return (
    <Select items={zones} defaultValue="Asia/Kolkata">
      <SelectTrigger className="w-64" aria-label="Time zone">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {zones.map((z) => (
          <SelectItem key={z.value} value={z.value}>
            {z.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SwitchDemo() {
  const [on, setOn] = React.useState(true)
  const [c, setC] = React.useState(false)
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm">
        <Switch checked={on} onCheckedChange={(v) => setOn(!!v)} />
        Ask for opt-in in the first reply
      </label>
      <label className="flex items-center gap-3 text-sm">
        <Checkbox checked={c} onCheckedChange={(v) => setC(!!v)} />
        Send me a copy of each failed broadcast
      </label>
    </div>
  )
}

function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="ai">AI agent</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">1,317 conversations in the last 30 days.</TabsContent>
      <TabsContent value="team" className="pt-3 text-sm text-muted-foreground">4 teammates replied to 630 chats.</TabsContent>
      <TabsContent value="ai" className="pt-3 text-sm text-muted-foreground">The AI agent closed 780 chats on its own.</TabsContent>
    </Tabs>
  )
}

function CardDemo() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Balance for message charges</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-semibold tabular-nums">₹18,420</span>
        <Button size="sm" variant="secondary">
          Add money
        </Button>
      </CardContent>
    </Card>
  )
}

function DropdownDemo() {
  const [status, setStatus] = React.useState("open")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            {status === "open" ? "Open" : status === "pending" ? "Pending" : "Closed"}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuRadioGroup value={status} onValueChange={(v) => setStatus(String(v))}>
          <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TooltipDemo() {
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="outline" size="icon-sm" aria-label="Assign">
              <UserRoundPlusIcon />
            </Button>
          }
        />
        <TooltipContent>Assign</TooltipContent>
      </Tooltip>
      <Initials text="RS" />
      <Initials text="AM" className="bg-violet text-xs font-semibold text-violet-foreground" />
    </div>
  )
}

export const demos: Record<string, React.ComponentType> = {
  "app-frame": AppFrameDemo,
  "sub-nav": SubNavDemo,
  page: PageDemo,
  panel: PanelDemo,
  "view-tabs": ViewTabsDemo,
  segmented: SegmentedDemo,
  "pane-section": PaneSectionDemo,
  "list-row": ListRowDemo,
  "message-bubble": MessageBubbleDemo,
  "data-table": DataTableDemo,
  "stat-cards": StatCardsDemo,
  "status-badge": StatusBadgeDemo,
  "time-chart": TimeChartDemo,
  "bar-list": () => <BarList items={reasons} />,
  heatmap: HeatmapDemo,
  ring: RingDemo,
  "flow-chart": () => <FlowChart nodes={flowNodes} links={flowLinks} ariaLabel="Flow of conversations from first message to close" />,
  "settings-tiles": SettingsTilesDemo,
  "form-section": FormSectionDemo,
  button: ButtonDemo,
  badge: BadgeDemo,
  input: InputDemo,
  select: SelectDemo,
  switch: SwitchDemo,
  tabs: TabsDemo,
  card: CardDemo,
  "dropdown-menu": DropdownDemo,
  tooltip: TooltipDemo,
}

