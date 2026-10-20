import * as React from "react"
import {
  ArrowLeftIcon,
  AtSignIcon,
  CircleUserRoundIcon,
  HeadsetIcon,
  InboxIcon,
  PlusIcon,
  UserRoundXIcon,
  UsersRoundIcon,
  BotIcon,
  CheckCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  ClockIcon,
  ExternalLinkIcon,
  GlobeIcon,
  ImageIcon,
  LayoutTemplateIcon,
  ListFilterIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PanelRightIcon,
  PaperclipIcon,
  SearchIcon,
  SendHorizontalIcon,
  SmileIcon,
  SparklesIcon,
  StickyNoteIcon,
  UserRoundPlusIcon,
  ZapIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { InstagramIcon } from "@/components/kit/brand-icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/kit/status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SegmentedControl } from "@/components/kit/segmented"
import { InboxDetails } from "@/examples/inbox-details"
import { Container, SubNav, SubNavGroup, SubNavItem } from "@/components/kit/frame"
import {
  conversations as seed,
  quickReplies,
  teammates,
  type Channel,
  type Conversation,
  type Message,
} from "@/data/inbox"

const channelMeta: Record<Channel, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircleIcon, className: "bg-brand-wa text-white dark:text-[#00382c]" },
  instagram: { label: "Instagram", icon: InstagramIcon, className: "bg-brand-ig text-white dark:text-[#3f1121]" },
  web: { label: "Website chat", icon: GlobeIcon, className: "bg-tint text-white dark:text-[#00344a]" },
}

function ContactAvatar({ c, size = "default" }: { c: Conversation; size?: "default" | "lg" | "sm" }) {
  const ch = channelMeta[c.channel]
  const Icon = ch.icon
  return (
    <div className="relative h-fit shrink-0 self-start">
      <Avatar size={size === "lg" ? "lg" : "default"} className={size === "lg" ? "size-11" : size === "sm" ? "size-8" : "size-10"}>
        <AvatarFallback
          className="text-[13px] font-semibold"
          style={{
            background: `oklch(0.9 0.05 ${c.hue})`,
            color: `oklch(0.32 0.08 ${c.hue})`,
          }}
        >
          {c.initials}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute -right-0.5 -bottom-0.5 grid size-[18px] place-items-center rounded-full ring-2 ring-background",
          ch.className
        )}
        aria-label={ch.label}
      >
        <Icon className="size-2.5" />
      </span>
    </div>
  )
}

type View = string


function viewLabel(v: View) {
  if (v === "mine") return "Your inbox"
  if (v === "unassigned") return "Unassigned"
  if (v === "mentions") return "Mentions"
  if (v.startsWith("member:")) return v.slice(7)
  if (v === "team:support") return "Support"
  if (v === "team:returns") return "Returns"
  return "All"
}

/** Inbox views (Intercom pattern): fixed views, teammates, team inboxes. Blocks split by full-width lines. */
function InboxViews({ items, view, onView }: { items: Conversation[]; view: View; onView: (v: View) => void }) {
  const open = items.filter((c) => c.status === "open")
  const n = (f: (c: Conversation) => boolean) => open.filter(f).length
  const people = ["Riya Sharma", "Arjun Mehta", "Kabir Rao", "AI agent"]
  return (
    <SubNav
      title="Inbox"
      action={
        <Button variant="ghost" size="icon-sm" aria-label="New conversation">
          <PlusIcon />
        </Button>
      }
    >
      <SubNavGroup>
        <SubNavItem icon={SearchIcon} label="Search" onClick={() => document.getElementById("inbox-search")?.focus()} />
      </SubNavGroup>
      <SubNavGroup>
        <SubNavItem icon={InboxIcon} label="Your inbox" count={n((c) => c.assignee === "Riya Sharma")} active={view === "mine"} onClick={() => onView("mine")} />
        <SubNavItem icon={AtSignIcon} label="Mentions" count={0} active={view === "mentions"} onClick={() => onView("mentions")} />
        <SubNavItem icon={UserRoundXIcon} label="Unassigned" count={n((c) => !c.assignee)} active={view === "unassigned"} onClick={() => onView("unassigned")} />
        <SubNavItem icon={UsersRoundIcon} label="All" count={open.length} active={view === "all"} onClick={() => onView("all")} />
      </SubNavGroup>
      <SubNavGroup label="Teammates" collapsible>
        {people.map((p) => (
          <SubNavItem
            key={p}
            label={p}
            count={n((c) => c.assignee === p)}
            active={view === `member:${p}`}
            onClick={() => onView(`member:${p}`)}
            badge={undefined}
            icon={p === "AI agent" ? BotIcon : CircleUserRoundIcon}
          />
        ))}
      </SubNavGroup>
      <SubNavGroup label="Team inboxes" collapsible>
        <SubNavItem icon={HeadsetIcon} label="Support" count={open.length} active={view === "team:support"} onClick={() => onView("team:support")} />
        <SubNavItem icon={PackageIcon} label="Returns" count={n((c) => c.labels.some((l) => /return/i.test(l.text)))} active={view === "team:returns"} onClick={() => onView("team:returns")} />
      </SubNavGroup>
    </SubNav>
  )
}

function ConversationList({
  items,
  activeId,
  onSelect,
  view,
  onView,
  status,
  onStatus,
  query,
  onQuery,
}: {
  items: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  view: View
  onView: (v: View) => void
  status: string
  onStatus: (s: string) => void
  query: string
  onQuery: (q: string) => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <h1 className="text-base font-semibold">{viewLabel(view)}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  <ListFilterIcon data-icon="inline-start" />
                  {status === "open" ? "Open" : status === "pending" ? "Pending" : "Closed"}
                  <ChevronDownIcon className="size-3.5 opacity-60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup value={status} onValueChange={(v) => onStatus(String(v))}>
                <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="closed">Closed</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
      <div className="flex flex-col gap-2.5 border-b p-3">
        <SegmentedControl
          className="lg:hidden"
          value={view}
          onChange={(v) => onView(v as View)}
          options={[
            { value: "mine", label: "You", count: 3 },
            { value: "unassigned", label: "Unassigned", count: 1 },
            { value: "all", label: "All", count: 12 },
          ]}
        />
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="inbox-search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search name, phone or order"
            className="pl-9"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No conversations here. Try another view or clear the search.
          </div>
        ) : (
          <ul className="divide-y border-b">
            {items.map((c) => {
              const active = c.id === activeId
              return (
                <li key={c.id} className="">
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    aria-current={active || undefined}
                    className={cn(
                      "relative flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none",
                      active && "bg-accent hover:bg-accent"
                    )}
                  >
                    {active && <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-primary" />}
                    <ContactAvatar c={c} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className={cn("truncate text-sm", c.unread ? "font-semibold" : "font-medium")}>
                          {c.name}
                        </span>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
                          {c.time}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={cn(
                            "truncate text-[13px]",
                            c.unread ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {c.botHandled && <BotIcon className="mr-1 inline size-3.5 -translate-y-px text-tint" />}
                          {c.preview}
                        </span>
                        {c.unread > 0 && (
                          <span className="ml-auto grid min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 text-[11px] leading-5 font-semibold text-primary-foreground">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      {(c.labels.length > 0 || c.sla) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.sla && (
                            <StatusBadge tone={c.sla.tone} className="h-5 px-1.5">
                              <ClockIcon />
                              {c.sla.text}
                            </StatusBadge>
                          )}
                          {c.labels.slice(0, 2).map((l) => (
                            <StatusBadge key={l.text} variant={l.tone} className="h-5 px-1.5">
                              {l.text}
                            </StatusBadge>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Ticks({ status }: { status?: "sent" | "delivered" | "read" }) {
  if (!status) return null
  if (status === "sent") return <CheckIcon className="size-3.5" aria-label="Sent" />
  return (
    <CheckCheckIcon
      className={cn("size-3.5", status === "read" && "text-tint")}
      aria-label={status === "read" ? "Read" : "Delivered"}
    />
  )
}

function MessageRow({ m }: { m: Message }) {
  if (m.kind === "day") {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-muted-foreground">
          {m.label}
        </span>
      </div>
    )
  }
  if (m.kind === "event") {
    return (
      <div className="flex items-center gap-3 px-6 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-1.5 text-center">
          <UserRoundPlusIcon className="size-3.5 shrink-0" />
          {m.text}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  }
  if (m.kind === "template") {
    return (
      <div className="flex justify-end">
        <div className="w-[min(380px,85%)] overflow-hidden rounded-2xl rounded-br-md bg-card ring-1 ring-border">
          <div className="flex items-center gap-1.5 border-b bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
            <LayoutTemplateIcon className="size-3.5" />
            Template · {m.name}
          </div>
          <div className="px-3.5 pt-2.5 pb-2">
            <div className="text-sm font-semibold">{m.header}</div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">{m.body}</p>
            <div className="mt-1.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
              {m.time}
              <Ticks status={m.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 border-t">
            {m.buttons.map((b, i) => (
              <div
                key={b}
                className={cn(
                  "flex items-center justify-center gap-1.5 py-2 text-[13px] font-medium text-link",
                  i > 0 && "border-l"
                )}
              >
                <ExternalLinkIcon className="size-3.5" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (m.kind === "order") {
    return (
      <div className="flex justify-center">
        <div className="flex w-[min(420px,100%)] items-center gap-3 rounded-xl border border-dashed bg-muted px-3.5 py-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-success text-success-foreground">
            <PackageIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              Shopify order {m.orderNo}
              <span className="ml-auto text-sm font-semibold tabular-nums">{m.total}</span>
            </div>
            <div className="truncate text-xs text-muted-foreground">{m.items}</div>
            <div className="mt-0.5 text-xs text-success-foreground">{m.state}</div>
          </div>
        </div>
      </div>
    )
  }
  if (m.kind === "note") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[min(440px,85%)] rounded-2xl rounded-br-md bg-note px-3.5 py-2">
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-medium text-note-foreground">
            <StickyNoteIcon className="size-3" />
            Internal note · {m.author}
          </div>
          <p className="text-sm leading-relaxed">{m.text}</p>
          <div className="mt-1 text-right text-[11px] text-muted-foreground">{m.time}</div>
        </div>
      </div>
    )
  }
  const incoming = m.kind === "in"
  const bot = m.kind === "bot"
  return (
    <div className={cn("flex", incoming ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[min(440px,80%)] rounded-2xl px-3.5 py-2",
          incoming && "rounded-bl-md bg-bubble-in",
          !incoming && "rounded-br-md bg-bubble-out text-foreground"
        )}
      >
        {bot && (
          <div className="mb-0.5 flex items-center gap-1 text-[11px] font-medium opacity-75">
            <SparklesIcon className="size-3" />
            {m.author}
          </div>
        )}
        <p className="text-sm leading-relaxed">{m.text}</p>
        <div
          className={cn(
            "mt-0.5 flex items-center justify-end gap-1 text-[11px]",
            incoming ? "text-muted-foreground" : "opacity-70"
          )}
        >
          {m.time}
          {!incoming && <Ticks status={m.status} />}
        </div>
      </div>
    </div>
  )
}

function Composer({
  onSend,
  draft,
}: {
  onSend: (text: string, note: boolean) => void
  draft?: { text: string; n: number }
}) {
  const [mode, setMode] = React.useState<"reply" | "note">("reply")
  const [text, setText] = React.useState("")
  React.useEffect(() => {
    if (draft) {
      setMode("reply")
      setText(draft.text)
    }
  }, [draft])
  const note = mode === "note"
  const send = () => {
    if (!text.trim()) return
    onSend(text.trim(), note)
    setText("")
  }
  return (
    <div className="border-t p-3">
      <div className="mb-2 flex gap-1.5 overflow-x-auto">
        {quickReplies.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setText(q)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <SparklesIcon className="size-3 text-tint" />
            {q}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "rounded-lg border bg-card transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
          note && "border-note-foreground/30 bg-note"
        )}
      >
        <div className="flex items-center gap-1 px-2 pt-2">
          {(["reply", "note"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground",
                mode === m && (m === "note" ? "bg-note-foreground/15 text-note-foreground" : "bg-accent text-foreground")
              )}
            >
              {m === "reply" ? "Reply" : "Internal note"}
            </button>
          ))}
        </div>
        <textarea
          id="composer"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={2}
          placeholder={note ? "Write a note only your team can see" : "Type a reply. Press / for saved replies"}
          className="block w-full resize-none bg-transparent px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-0.5 px-2 pb-2">
          {[
            { icon: PaperclipIcon, label: "Attach file" },
            { icon: ImageIcon, label: "Send image" },
            { icon: SmileIcon, label: "Emoji" },
            { icon: LayoutTemplateIcon, label: "Send template" },
            { icon: ZapIcon, label: "Saved replies" },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label={label} className="text-muted-foreground">
                    <Icon />
                  </Button>
                }
              />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
          <Button variant="secondary" size="sm" className="ml-1 hidden sm:inline-flex">
            <SparklesIcon data-icon="inline-start" />
            Suggest a reply
          </Button>
          <Button variant="ghost" size="sm" className="hidden text-muted-foreground xl:inline-flex">
            Summarise
          </Button>
          <Button size="sm" className="ml-auto" onClick={send} disabled={!text.trim()}>
            {note ? "Add note" : "Send"}
            <SendHorizontalIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Thread({
  c,
  onBack,
  onToggleDetails,
  onResolve,
  onAssign,
  onSend,
  draft,
}: {
  draft?: { text: string; n: number }
  c: Conversation
  onBack: () => void
  onToggleDetails: () => void
  onResolve: () => void
  onAssign: (who: string) => void
  onSend: (text: string, note: boolean) => void
}) {
  const end = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    end.current?.scrollIntoView({ block: "end" })
  }, [c.id, c.messages.length])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Back to list" onClick={onBack}>
          <ArrowLeftIcon />
        </Button>
        <ContactAvatar c={c} size="sm" />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-semibold">{c.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {channelMeta[c.channel].label} · {c.phone}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Avatar size="sm" className="-ml-1.5 size-5">
                  <AvatarFallback className="bg-violet text-[9px] text-violet-foreground">
                    {c.assignee ? c.assignee.split(" ").map((p) => p[0]).join("") : "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate xl:inline">{c.assignee ?? "Assign"}</span>
                <ChevronDownIcon className="size-3.5 opacity-60" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Assign to</DropdownMenuLabel>
              {teammates.map((t) => (
                <DropdownMenuItem key={t} onClick={() => onAssign(t)}>
                  {t === "AI agent" ? <BotIcon /> : <UserRoundPlusIcon />}
                  {t}
                  {c.assignee === t && <CheckIcon className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" onClick={onResolve} disabled={c.status === "closed"}>
          <CircleCheckIcon data-icon="inline-start" />
          {c.status === "closed" ? "Closed" : "Close"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="More actions">
                <MoreHorizontalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Snooze until tomorrow</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Create ticket</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Block contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Show contact details"
          className="hidden min-[1400px]:inline-flex"
          onClick={onToggleDetails}
        >
          <PanelRightIcon />
        </Button>
      </header>

      {c.windowLeft && (
        <div className="flex items-center gap-2 border-b bg-muted px-4 py-1.5 text-xs text-muted-foreground">
          <ClockIcon className="size-3.5 text-tint" />
          Reply window open for <span className="font-medium text-foreground tabular-nums">{c.windowLeft}</span>
          <span className="hidden sm:inline">· after that, only templates can be sent</span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-5">
        {c.messages.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Open a conversation with messages to see the thread. This demo fills the first one.
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {c.messages.map((m) => (
              <MessageRow key={m.id} m={m} />
            ))}
            <div ref={end} />
          </div>
        )}
      </div>

      <Composer onSend={onSend} draft={draft} />
    </div>
  )
}

export function InboxPage() {
  const [items, setItems] = React.useState(seed)
  const [activeId, setActiveId] = React.useState(seed[0].id)
  const [view, setView] = React.useState<View>("all")
  const [status, setStatus] = React.useState("open")
  const [query, setQuery] = React.useState("")
  const [details, setDetails] = React.useState(true)
  const [mobileThread, setMobileThread] = React.useState(false)
  const [draft, setDraft] = React.useState<{ text: string; n: number }>()

  const filtered = items.filter((c) => {
    if (status === "open" && c.status !== "open") return false
    if (status === "pending" && c.status !== "pending") return false
    if (status === "closed" && c.status !== "closed") return false
    if (view === "mine" && c.assignee !== "Riya Sharma") return false
    if (view === "unassigned" && c.assignee) return false
    if (view === "mentions") return false
    if (view.startsWith("member:") && c.assignee !== view.slice(7)) return false
    if (view === "team:returns" && !c.labels.some((l) => /return/i.test(l.text))) return false
    const q = query.trim().toLowerCase()
    if (q && !`${c.name} ${c.phone} ${c.labels.map((l) => l.text).join(" ")}`.toLowerCase().includes(q)) return false
    return true
  })

  const active = items.find((c) => c.id === activeId) ?? items[0]
  const update = (id: string, fn: (c: Conversation) => Conversation) =>
    setItems((xs) => xs.map((c) => (c.id === id ? fn(c) : c)))

  const now = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toLowerCase()

  return (
    <>
      <InboxViews items={items} view={view} onView={setView} />
      <Container className={cn("w-full shrink-0 md:w-[320px]", mobileThread ? "hidden md:flex" : "flex")}>
        <ConversationList
          items={filtered}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id)
            setMobileThread(true)
            update(id, (c) => ({ ...c, unread: 0 }))
          }}
          view={view}
          onView={setView}
          status={status}
          onStatus={setStatus}
          query={query}
          onQuery={setQuery}
        />
      </Container>
      <Container className={cn("flex-1", mobileThread ? "flex" : "hidden md:flex")}>
        <Thread
          c={active}
          draft={draft}
          onBack={() => setMobileThread(false)}
          onToggleDetails={() => setDetails((d) => !d)}
          onResolve={() =>
            update(active.id, (c) => ({
              ...c,
              status: "closed",
              sla: undefined,
              messages: [...c.messages, { kind: "event", id: `e${Date.now()}`, text: "Closed by Riya Sharma" }],
            }))
          }
          onAssign={(who) =>
            update(active.id, (c) => ({
              ...c,
              assignee: who,
              messages: [
                ...c.messages,
                { kind: "event", id: `e${Date.now()}`, text: `Riya Sharma assigned this to ${who}` },
              ],
            }))
          }
          onSend={(text, note) =>
            update(active.id, (c) => ({
              ...c,
              preview: note ? c.preview : `You: ${text}`,
              sla: note ? c.sla : undefined,
              messages: [
                ...c.messages,
                note
                  ? { kind: "note", id: `n${Date.now()}`, text, time: now(), author: "Riya Sharma" }
                  : { kind: "out", id: `m${Date.now()}`, text, time: now(), status: "sent" },
              ],
            }))
          }
        />
      </Container>
      {details && (
        <Container className="hidden w-[320px] shrink-0 min-[1400px]:flex">
          <InboxDetails c={active} onUseDraft={(text) => setDraft({ text, n: Date.now() })} />
        </Container>
      )}
    </>
  )
}
