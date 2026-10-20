import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  BarChart3Icon,
  CircleUserRoundIcon,
  GlobeIcon,
  LayoutGridIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  BotIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  HandshakeIcon,
  IndianRupeeIcon,
  MessagesSquareIcon,
  PercentIcon,
  ShieldCheckIcon,
  SmileIcon,
  TimerIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/kit/status-badge"
import { Button } from "@/components/ui/button"
import { BarList, FlowChart, Heatmap, Legend, Ring, TimeChart, type Series } from "@/components/kit/charts"
import { DataTable } from "@/components/kit/data-table"
import { StatTile } from "@/examples/page-header"
import { FilterChips, Page, Panel, SubNav, SubNavGroup, SubNavItem } from "@/components/kit/frame"
import {
  aiResolved,
  attributionRows,
  days30,
  handedOver,
  handoverReasons,
  heat,
  hours,
  reasons,
  team,
  weekdays,
  type TeamRow,
  flowLinks,
  flowNodes,
} from "@/data/reports"

const lakh = (n: number) => `₹${(n / 100000).toFixed(2)} L`
const num = (n: number) => n.toLocaleString("en-IN")

function Delta({ value, good = "up" }: { value: number; good?: "up" | "down" }) {
  const positive = value >= 0
  const isGood = good === "up" ? positive : !positive
  return (
    <span className={cn("font-medium", isGood ? "text-success-foreground" : "text-danger-foreground")}>
      {positive ? "+" : ""}
      {value}%
    </span>
  )
}


function OverviewTab() {
  const series: Series[] = [
    { key: "ai", label: "AI agent alone", values: aiResolved, color: "var(--chart-4)" },
    { key: "team", label: "Handed to team", values: handedOver, color: "var(--chart-1)" },
  ]
  const total = aiResolved.reduce((a, b) => a + b, 0) + handedOver.reduce((a, b) => a + b, 0)
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="New conversations" value={num(total)} hint={<><Delta value={12} /> vs previous 30 days</>} icon={MessagesSquareIcon} />
        <StatTile label="Median first response time" value="2 m 10 s" hint={<><Delta value={-18} good="down" /> · office hours</>} icon={TimerIcon} tone="info" />
        <StatTile label="Median time to close" value="38 m" hint={<><Delta value={-6} good="down" /> · office hours</>} icon={ClockIcon} tone="violet" />
        <StatTile label="Overall CX score" value="87%" hint={<><Delta value={3} /> · from 412 rated chats</>} icon={SmileIcon} tone="success" />
      </div>

      <Panel title="How conversations are handled" description="Every new conversation in the period, and where it ended up.">
        <FlowChart nodes={flowNodes} links={flowLinks} ariaLabel="Flow of conversations from first message to close" />
      </Panel>

      <Panel title="New conversations by day"
        description="Stacked: conversations the AI agent closed alone, and the ones it handed to the team."
        action={<Legend items={series.map((s) => ({ label: s.label, color: s.color }))} />}
      >
        <TimeChart series={series} labels={days30} stacked ariaLabel="New conversations per day" />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="When customers write"
          description="Conversations by weekday and hour, last 30 days. Plan shifts for the 8 to 11 pm peak."
          className="lg:col-span-3"
        >
          <Heatmap rows={weekdays} cols={hours} values={heat} />
          <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
            Fewer
            {[15, 35, 55, 75, 100].map((p) => (
              <span
                key={p}
                className="h-2.5 w-4 rounded-[3px]"
                style={{ background: `color-mix(in oklch, var(--chart-1) ${p}%, var(--accent))` }}
              />
            ))}
            More
          </div>
        </Panel>
        <Panel title="Why customers write" description="Resolution reasons used to close conversations." className="lg:col-span-2">
          <BarList items={reasons} />
        </Panel>
      </div>
    </div>
  )
}

const teamColumns: ColumnDef<TeamRow, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Member",
    enableHiding: false,
    cell: ({ row: { original: t } }) => (
      <div className="flex items-center gap-2.5">
        <span className="relative">
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">{t.initials}</AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-card",
              t.online ? "bg-[#1e6b4f]" : "bg-muted-foreground"
            )}
          />
        </span>
        <span className="font-medium">{t.name}</span>
      </div>
    ),
  },
  { id: "assigned", accessorKey: "assigned", header: "Assigned", meta: { align: "right" } },
  { id: "closed", accessorKey: "closed", header: "Resolved", meta: { align: "right" } },
  {
    id: "firstReply",
    accessorKey: "firstReplySort",
    header: "Median first response",
    meta: { align: "right" },
    cell: ({ row: { original: t } }) => t.firstReply,
  },
  {
    id: "sla",
    accessorKey: "sla",
    header: "SLA hit rate",
    cell: ({ row: { original: t } }) => (
      <div className="flex w-36 items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-accent">
          <div
            className={cn("h-1.5 rounded-full", t.sla >= 90 ? "bg-chart-2" : "bg-chart-3")}
            style={{ width: `${t.sla}%` }}
          />
        </div>
        <span className="w-9 text-right text-[13px] tabular-nums">{t.sla}%</span>
      </div>
    ),
  },
  {
    id: "csat",
    accessorKey: "csat",
    header: "Surveyed CSAT",
    meta: { align: "right" },
    cell: ({ row: { original: t } }) => (
      <StatusBadge tone={t.csat >= 4.7 ? "success" : t.csat >= 4.5 ? "secondary" : "warning"}>{t.csat.toFixed(1)} / 5</StatusBadge>
    ),
  },
]

function TeamTab() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Replies by team member" value="3,912" hint={<><Delta value={8} /> vs previous 30 days</>} icon={MessagesSquareIcon} />
        <StatTile label="Resolved by team member" value="595" hint="46% of handed-over chats" icon={HandshakeIcon} tone="success" />
        <StatTile label="SLA hit rate" value="92%" hint="Target 90% · 48 missed" icon={ShieldCheckIcon} tone="info" />
        <StatTile label="Team member CX score" value="84%" hint="AI agent CX score 89%" icon={SmileIcon} tone="violet" />
      </div>
      <DataTable
        columns={teamColumns}
        data={team}
        getRowId={(t) => t.id}
        initialSorting={[{ id: "closed", desc: true }]}
        columnLabels={{ assigned: "Assigned", closed: "Resolved", firstReply: "Median first response", sla: "SLA hit rate", csat: "Surveyed CSAT" }}
        toolbar={<span className="text-sm text-muted-foreground">4 members · office hours only</span>}
      />
    </div>
  )
}

function AiTab() {
  const handled = 1284
  const resolved = 912
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Conversations handled" value={num(handled)} hint="Every chat starts with the AI agent" icon={BotIcon} tone="violet" />
        <StatTile label="Resolved by AI" value={num(resolved)} hint={<><Delta value={9} /> vs previous 30 days</>} icon={HandshakeIcon} tone="success" />
        <StatTile label="Deflection rate" value="78%" hint="Did not need a person at any point" icon={PercentIcon} tone="info" />
        <StatTile label="Hours saved" value="152 h" hint="At 10 min per chat · ₹45,600 cost saved" icon={ClockIcon} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Resolution rate" description="Share of AI agent chats closed without the team.">
          <div className="flex flex-col">
            <Ring value={Math.round((resolved / handled) * 100)} label="Closed by the AI agent alone" color="var(--chart-4)" />
            <Ring value={89} label="AI agent CX score" color="var(--chart-2)" />
          </div>
        </Panel>
        <Panel title="From chat to order" description="AI agent product recommendations, last 30 days.">
          <BarList
            items={[
              { label: "Recommendations made", value: 2140, color: "var(--chart-4)" },
              { label: "Clicked", value: 812, hint: "38%", color: "var(--chart-4)" },
              { label: "Added to cart", value: 301, hint: "37%", color: "var(--chart-4)" },
              { label: "Ordered", value: 142, hint: "47%", color: "var(--chart-2)" },
            ]}
          />
        </Panel>
        <Panel title="Why it handed over" description="Top reasons the AI agent routed a chat to the team.">
          <BarList items={handoverReasons} format={(n) => String(n)} />
        </Panel>
      </div>
    </div>
  )
}

const attributionColumns: ColumnDef<(typeof attributionRows)[number], unknown>[] = [
  {
    id: "source",
    accessorKey: "source",
    header: "Source",
    enableHiding: false,
    cell: ({ row: { original: r } }) => <span className="font-medium">{r.source}</span>,
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    cell: ({ row: { original: r } }) => (
      <StatusBadge tone={r.type === "Broadcast" ? "info" : r.type === "Workflow" ? "success" : "violet"}>{r.type}</StatusBadge>
    ),
  },
  { id: "orders", accessorKey: "orders", header: "Orders", meta: { align: "right" } },
  {
    id: "aov",
    accessorFn: (r) => r.revenue / r.orders,
    header: "AOV",
    meta: { align: "right" },
    cell: ({ getValue }) => `₹${num(Math.round(getValue() as number))}`,
  },
  {
    id: "revenue",
    accessorKey: "revenue",
    header: "Revenue",
    meta: { align: "right" },
    cell: ({ row: { original: r } }) => <span className="font-medium">{lakh(r.revenue)}</span>,
  },
]

function AttributionTab() {
  const total = attributionRows.reduce((s, r) => s + r.revenue, 0)
  const by = (t: string) => attributionRows.filter((r) => r.type === t).reduce((s, r) => s + r.revenue, 0)
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total revenue" value="₹78.40 L" hint="All Shopify orders" icon={IndianRupeeIcon} />
        <StatTile label="Attributed revenue" value={lakh(total)} hint={<><Delta value={18} /> vs previous 30 days</>} icon={IndianRupeeIcon} tone="success" />
        <StatTile label="Contribution" value={`${Math.round((total / 7840000) * 100)}%`} hint="Of store revenue" icon={PercentIcon} tone="info" />
        <StatTile label="Attributed AOV vs store" value="₹1,623" hint="Store AOV ₹1,212 · 34% higher" icon={HandshakeIcon} tone="violet" />
      </div>
      <Panel title="Revenue by source" description="Last-touch within 3 days of a message.">
        <BarList
          format={lakh}
          items={[
            { label: "Workflows", value: by("Workflow"), color: "var(--chart-2)" },
            { label: "AI agent", value: by("AI agent"), color: "var(--chart-4)" },
            { label: "Broadcasts", value: by("Broadcast"), color: "var(--chart-1)" },
          ]}
        />
      </Panel>
      <DataTable
        columns={attributionColumns}
        data={attributionRows}
        getRowId={(r) => r.source}
        initialSorting={[{ id: "revenue", desc: true }]}
        columnLabels={{ type: "Type", orders: "Orders", aov: "AOV", revenue: "Revenue" }}
        toolbar={<span className="text-sm text-muted-foreground">Top sources by attributed revenue</span>}
      />
    </div>
  )
}

const reportTitle: Record<string, string> = {
  overview: "Overview",
  team: "Teammate performance",
  ai: "AI agent overview",
  attribution: "Attribution",
}

export function ReportsPage() {
  const [tab, setTab] = React.useState("overview")
  const go = (t: string) => () => setTab(t)
  return (
    <Page
      title={reportTitle[tab]}
      nav={
        <SubNav
          title="Reports"
          action={
            <Button variant="ghost" size="icon-sm" aria-label="New report">
              <PlusIcon />
            </Button>
          }
        >
          <SubNavGroup>
            <SubNavItem icon={SparklesIcon} label="AI insights" />
          </SubNavGroup>
          <SubNavGroup>
            <SubNavItem icon={LayoutGridIcon} label="Overview" active={tab === "overview"} onClick={go("overview")} />
            <SubNavItem icon={BarChart3Icon} label="All reports" count={18} />
            <SubNavItem icon={CircleUserRoundIcon} label="Your reports" count={3} />
            <SubNavItem icon={StarIcon} label="Saved filters" />
            <SubNavItem icon={DownloadIcon} label="Data export" />
          </SubNavGroup>
          <SubNavGroup label="Human support" collapsible>
            <SubNavItem label="Conversations" indent />
            <SubNavItem label="Teammate performance" indent active={tab === "team"} onClick={go("team")} />
            <SubNavItem label="Responsiveness" indent />
            <SubNavItem label="SLAs" indent />
            <SubNavItem label="Customer satisfaction" indent />
            <SubNavItem label="Tickets" indent />
          </SubNavGroup>
          <SubNavGroup label="AI agent" collapsible>
            <SubNavItem label="Overview" indent active={tab === "ai"} onClick={go("ai")} />
            <SubNavItem label="Online store" indent />
            <SubNavItem label="Recommendations" indent />
          </SubNavGroup>
          <SubNavGroup label="Revenue" collapsible>
            <SubNavItem label="Attribution" indent active={tab === "attribution"} onClick={go("attribution")} />
            <SubNavItem label="Broadcasts" indent />
            <SubNavItem label="Workflows" indent />
          </SubNavGroup>
        </SubNav>
      }
      actions={
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <DownloadIcon data-icon="inline-start" />
          Export CSV
        </Button>
      }
      filters={
        <>
          <Button variant="outline" size="sm">
            <CalendarIcon data-icon="inline-start" />
            21 Sep – 20 Oct 2026
          </Button>
          <Button variant="ghost" size="sm">
            <PlusIcon data-icon="inline-start" />
            Add filter
          </Button>
          <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <GlobeIcon className="size-3.5" />
            Kolkata time (GMT+5:30)
          </span>
          <div className="w-full lg:hidden">
            <FilterChips
              value={tab}
              onChange={setTab}
              options={[
                { value: "overview", label: "Overview" },
                { value: "team", label: "Team" },
                { value: "ai", label: "AI agent" },
                { value: "attribution", label: "Attribution" },
              ]}
            />
          </div>
        </>
      }
    >
      {tab === "overview" && <OverviewTab />}
      {tab === "team" && <TeamTab />}
      {tab === "ai" && <AiTab />}
      {tab === "attribution" && <AttributionTab />}
    </Page>
  )
}
