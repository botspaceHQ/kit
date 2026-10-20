import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  BanIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  CirclePlusIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  ListOrderedIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RotateCwIcon,
  SearchIcon,
  SendIcon,
  TimerIcon,
  UsersRoundIcon,
  MegaphoneIcon,
  LayoutTemplateIcon,
  ClipboardListIcon,
  LinkIcon,
} from "lucide-react"

import { StatusBadge } from "@/components/kit/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTable, selectColumn } from "@/components/kit/data-table"
import { FilterChips, Page, SubNav, SubNavGroup, SubNavItem } from "@/components/kit/frame"
import { StatCards } from "@/components/kit/stat-cards"
import { broadcasts, type Broadcast, type BroadcastStatus } from "@/data/lists"

const inr = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2)} L`
    : `₹${n.toLocaleString("en-IN")}`
const num = (n: number) => n.toLocaleString("en-IN")
const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0)

const statusMeta: Record<
  BroadcastStatus,
  { label: string; variant: "success" | "info" | "danger" | "default" | "secondary"; icon: React.ComponentType<{ className?: string }> }
> = {
  CREATED: { label: "Draft", variant: "default", icon: CirclePlusIcon },
  QUEUING: { label: "Queuing", variant: "secondary", icon: ListOrderedIcon },
  SENDING: { label: "Sending", variant: "success", icon: SendIcon },
  COMPLETED: { label: "Completed", variant: "success", icon: CheckCircle2Icon },
  SCHEDULED: { label: "Scheduled", variant: "info", icon: CalendarIcon },
  SCHEDULED_RETRY: { label: "Retry scheduled", variant: "info", icon: RotateCwIcon },
  CANCELLED: { label: "Cancelled", variant: "default", icon: BanIcon },
  FAILED: { label: "Failed", variant: "danger", icon: CircleAlertIcon },
}

function BroadcastStatusBadge({ status }: { status: BroadcastStatus }) {
  const m = statusMeta[status]
  const Icon = m.icon
  return (
    <StatusBadge tone={m.variant}>
      <Icon />
      {m.label}
    </StatusBadge>
  )
}

/** Delivered → read → replied in one bar, so the funnel reads at a glance. */
function Funnel({ b }: { b: Broadcast }) {
  if (!b.sent) return <span className="text-muted-foreground">Not sent yet</span>
  const d = pct(b.delivered, b.total)
  const r = pct(b.read, b.total)
  const rep = pct(b.replied, b.total)
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div className="flex w-44 flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-foreground tabular-nums">{r}% read</span>
              <span className="text-muted-foreground tabular-nums">{rep}% replied</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-accent">
              <div className="absolute inset-y-0 left-0 rounded-full bg-chart-1/30" style={{ width: `${d}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-chart-1" style={{ width: `${r}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-chart-2" style={{ width: `${rep}%` }} />
            </div>
          </div>
        }
      />
      <TooltipContent className="flex-col items-start gap-0.5">
        <span>Sent {num(b.sent)}</span>
        <span>Delivered {num(b.delivered)} ({d}%)</span>
        <span>Read {num(b.read)} ({r}%)</span>
        <span>Replied {num(b.replied)} ({rep}%)</span>
        <span>Failed {num(b.failed)}</span>
      </TooltipContent>
    </Tooltip>
  )
}

const columns: ColumnDef<Broadcast, unknown>[] = [
  selectColumn<Broadcast>(),
  {
    id: "name",
    accessorKey: "name",
    header: "Broadcast",
    enableHiding: false,
    cell: ({ row: { original: b } }) => (
      <div className="min-w-0">
        <div className="max-w-[260px] truncate font-medium">{b.name}</div>
        <div className="max-w-[260px] truncate font-mono text-xs text-muted-foreground">{b.template}</div>
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <BroadcastStatusBadge status={row.original.status} />,
  },
  {
    id: "audience",
    accessorKey: "total",
    header: "Audience",
    cell: ({ row: { original: b } }) => (
      <div className="min-w-0">
        <div className="max-w-[200px] truncate text-[13px]">{b.audience}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
          <UsersRoundIcon className="size-3" />
          {num(b.total)} contacts
        </div>
      </div>
    ),
  },
  {
    id: "funnel",
    accessorFn: (b) => (b.total ? b.read / b.total : -1),
    header: "Performance",
    cell: ({ row }) => <Funnel b={row.original} />,
  },
  {
    id: "clicks",
    accessorFn: (b) => b.clicked ?? -1,
    header: "Link clicks",
    meta: { align: "right" },
    cell: ({ row: { original: b } }) =>
      b.clicked === null || !b.sent ? <span className="text-muted-foreground">–</span> : num(b.clicked),
  },
  {
    id: "revenue",
    accessorKey: "revenue",
    header: "Revenue",
    meta: { align: "right" },
    cell: ({ row: { original: b } }) =>
      b.revenue ? <span className="font-medium">{inr(b.revenue)}</span> : <span className="text-muted-foreground">–</span>,
  },
  {
    id: "sendAt",
    accessorKey: "sendAtSort",
    header: "Sent at",
    cell: ({ row: { original: b } }) => (
      <span className="text-[13px] whitespace-nowrap text-muted-foreground">{b.sendAt}</span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    size: 48,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row: { original: b } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${b.name}`} onClick={(e) => e.stopPropagation()}>
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <EyeIcon />
            View report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Export contacts
          </DropdownMenuItem>
          {(b.status === "SCHEDULED" || b.status === "SENDING" || b.status === "SCHEDULED_RETRY") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <BanIcon />
                Cancel broadcast
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const groups: Record<string, BroadcastStatus[] | null> = {
  all: null,
  live: ["SENDING", "QUEUING", "SCHEDULED", "SCHEDULED_RETRY"],
  completed: ["COMPLETED"],
  drafts: ["CREATED"],
  problems: ["FAILED", "CANCELLED"],
}

export function BroadcastsPage() {
  const [group, setGroup] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const rows = groups[group] ? broadcasts.filter((b) => groups[group]!.includes(b.status)) : broadcasts
  const count = (g: string) => (groups[g] ? broadcasts.filter((b) => groups[g]!.includes(b.status)).length : broadcasts.length)

  const done = broadcasts.filter((b) => b.sent > 0)
  const sent = done.reduce((s, b) => s + b.sent, 0)
  const read = done.reduce((s, b) => s + b.read, 0)
  const replied = done.reduce((s, b) => s + b.replied, 0)
  const revenue = broadcasts.reduce((s, b) => s + b.revenue, 0)
  const cost = done.reduce((s, b) => s + b.cost, 0)

  return (
    <Page
      nav={
        <SubNav title="Outbound">
          <SubNavGroup>
            <SubNavItem icon={MegaphoneIcon} label="Broadcasts" count={12} active />
            <SubNavItem icon={LayoutTemplateIcon} label="Templates" count={46} />
            <SubNavItem icon={UsersRoundIcon} label="Segments" count={18} />
            <SubNavItem icon={ClipboardListIcon} label="Signup forms" count={3} />
            <SubNavItem icon={LinkIcon} label="Links and QR codes" />
          </SubNavGroup>
          <SubNavGroup label="Logs" collapsible>
            <SubNavItem label="Message logs" indent />
            <SubNavItem label="Failed messages" indent count={23} />
          </SubNavGroup>
        </SubNav>
      }
      title="Broadcasts"
      description="Send a WhatsApp template to a segment. Results update as messages are read."
      actions={
        <>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <CalendarIcon data-icon="inline-start" />
            1 Sep – 20 Oct 2026
          </Button>
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            New broadcast
          </Button>
        </>
      }
    >
        <StatCards
          items={[
            { label: "Messages sent", value: num(sent), hint: `Cost ${inr(cost)} · ₹0.88 each` },
            { label: "Read rate", value: `${pct(read, sent)}%`, hint: `${num(read)} read`, trend: <StatusBadge tone="success">+4%</StatusBadge> },
            { label: "Replies", value: num(replied), hint: "Opened a conversation in the inbox" },
            { label: "Revenue from broadcasts", value: inr(revenue), hint: `${Math.round(revenue / Math.max(cost, 1))}x return on cost`, trend: <StatusBadge tone="success">+18%</StatusBadge> },
          ]}
        />

        <DataTable
          columns={columns}
          data={rows}
          globalFilter={query}
          getRowId={(b) => b.id}
          initialSorting={[{ id: "sendAt", desc: true }]}
          columnLabels={{ status: "Status", audience: "Audience", funnel: "Performance", clicks: "Link clicks", revenue: "Revenue", sendAt: "Sent at" }}
          toolbar={
            <>
              <FilterChips
                value={group}
                onChange={setGroup}
                options={[
                  { value: "all", label: "All", count: count("all") },
                  { value: "live", label: "Scheduled and sending", count: count("live") },
                  { value: "completed", label: "Completed", count: count("completed") },
                  { value: "drafts", label: "Drafts", count: count("drafts") },
                  { value: "problems", label: "Failed or cancelled", count: count("problems") },
                ]}
              />
              <div className="relative ml-auto w-full sm:w-60">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="broadcast-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search broadcasts"
                  className="h-8 pl-9"
                />
              </div>
            </>
          }
          bulkActions={(sel, clear) => (
            <>
              <Button size="sm" variant="outline" onClick={clear}>
                <DownloadIcon data-icon="inline-start" />
                Export {sel.length}
              </Button>
              <Button size="sm" variant="outline" onClick={clear}>
                <CopyIcon data-icon="inline-start" />
                Duplicate
              </Button>
            </>
          )}
          emptyState={
            <div className="flex flex-col items-center gap-2">
              <TimerIcon className="size-5" />
              No broadcasts in this date range.
            </div>
          }
        />
    </Page>
  )
}
