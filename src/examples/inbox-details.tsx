import * as React from "react"
import {
  BotIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SendHorizontalIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TruckIcon,
  WorkflowIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DetailRow as Field, PaneSection as Section } from "@/components/kit/inbox-panes"

import { StatusBadge } from "@/components/kit/status-badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SegmentedControl } from "@/components/kit/segmented"
import type { Conversation } from "@/data/inbox"
import {
  abandonedCheckout,
  notes,
  shopifyCustomer,
  shopifyOrders,
  workflowRuns,
  type FinancialStatus,
  type FulfilmentLabel,
  type ShopifyOrder,
} from "@/data/shopify"

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

// One mapping for each Shopify status, kept next to the data type (old code had a colour bug here).
const financialChip: Record<FinancialStatus, { label: string; variant: "success" | "warning" | "danger" | "default" | "info" }> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Unpaid", variant: "warning" },
  partially_paid: { label: "Partially paid", variant: "warning" },
  refunded: { label: "Refunded", variant: "default" },
  partially_refunded: { label: "Partly refunded", variant: "default" },
  voided: { label: "Voided", variant: "danger" },
  authorized: { label: "Authorized", variant: "info" },
}
const fulfilmentChip: Record<FulfilmentLabel, "success" | "warning" | "danger" | "default" | "info"> = {
  Unfulfilled: "default",
  "Label printed": "info",
  "In transit": "info",
  "Out for delivery": "info",
  Delivered: "success",
  "Attempted delivery": "danger",
  Canceled: "default",
}

function Thumb({ hue, size = 32 }: { hue: number; size?: number }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-md ring-1 ring-border"
      style={{ width: size, height: size, background: `oklch(0.92 0.05 ${hue})` }}
    >
      <span className="h-1/2 w-1/3 rounded-sm" style={{ background: `oklch(0.7 0.09 ${hue})` }} />
    </span>
  )
}

function OrderCard({ o, open, onToggle }: { o: ShopifyOrder; open: boolean; onToggle: () => void }) {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + o.shipping + o.tax - (o.discount?.amount ?? 0)
  const fin = financialChip[o.financial]
  return (
    <div className={cn("transition-colors", open && "bg-muted/40")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 focus-visible:bg-muted focus-visible:outline-none"
      >
        <div className="flex -space-x-2 pt-0.5">
          {o.items.slice(0, 3).map((i) => (
            <Thumb key={i.title} hue={i.hue} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold">{o.name}</span>
            <span className="text-sm font-semibold tabular-nums">{inr(total)}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {o.createdAgo} · {o.items.reduce((s, i) => s + i.qty, 0)} items · {o.gateway}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <StatusBadge tone={fin.variant} className="h-5 px-1.5">{fin.label}</StatusBadge>
            <StatusBadge tone={fulfilmentChip[o.fulfilment]} className="h-5 px-1.5">
              {o.fulfilment === "Delivered" ? <CircleCheckIcon /> : o.fulfilment === "Unfulfilled" ? null : <TruckIcon />}
              {o.fulfilment}
            </StatusBadge>
          </div>
        </div>
        <ChevronDownIcon className={cn("mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform", !open && "-rotate-90")} />
      </button>

      {open && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {o.items.map((i) => (
              <li key={i.title} className="flex items-center gap-2.5 text-[13px]">
                <Thumb hue={i.hue} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{i.title}</div>
                  <div className="text-xs text-muted-foreground">{i.variant} · {i.qty} x {inr(i.price)}</div>
                </div>
                <span className="tabular-nums">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="rounded-md border bg-background px-3 py-1.5">
            <Field label="Subtotal">{inr(subtotal)}</Field>
            {o.discount && (
              <Field label={`Discount ${o.discount.code}`}>
                <span className="text-success-foreground">-{inr(o.discount.amount)}</span>
              </Field>
            )}
            <Field label="Shipping">{o.shipping ? inr(o.shipping) : "Free"}</Field>
            <Field label="Total">{inr(total)}</Field>
          </dl>
          {o.tracking ? (
            <div className="flex items-start gap-2 text-[13px]">
              <TruckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div>{o.tracking.courier} · <span className="font-mono text-xs">{o.tracking.number}</span></div>
                <div className="text-xs text-muted-foreground">{o.tracking.eta}</div>
              </div>
            </div>
          ) : null}
          <div className="flex items-start gap-2 text-[13px]">
            <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>{o.address}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {o.fulfilment === "Unfulfilled" && (
              <Button size="xs" variant="secondary">
                <PencilIcon data-icon="inline-start" />
                Edit address
              </Button>
            )}
            {o.tracking && (
              <Button size="xs" variant="outline">
                <SendHorizontalIcon data-icon="inline-start" />
                Send tracking
              </Button>
            )}
            <Button size="xs" variant="outline">
              <CopyIcon data-icon="inline-start" />
              Share in chat
            </Button>
            <Button size="xs" variant="ghost">
              Shopify
              <ExternalLinkIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ShopifySection() {
  const [openId, setOpenId] = React.useState<string | null>(shopifyOrders[0].id)
  const c = shopifyCustomer
  return (
    <Section
      title="Shopify"
      icon={ShoppingBagIcon}
      flush
      action={
        <Button size="xs" variant="ghost" className="text-muted-foreground">
          <PlusIcon data-icon="inline-start" />
          Order
        </Button>
      }
    >
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-px border-y bg-border text-center">
          {[
            { label: "Orders", value: String(c.orders) },
            { label: "Spent", value: inr(c.spent) },
            { label: "Avg order", value: inr(c.aov) },
          ].map((s) => (
            <div key={s.label} className="bg-background px-1 py-2">
              <div className="text-[13px] font-semibold tabular-nums">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1 border-b px-4 py-2 text-xs text-muted-foreground">
          Customer since {c.since} ·
          {c.tags.map((t) => (
            <StatusBadge key={t} variant="outline" className="h-5 px-1.5 font-mono text-[11px]">
              {t}
            </StatusBadge>
          ))}
        </div>

        {!abandonedCheckout.recovered && (
          <div className="flex items-center gap-2.5 border-b bg-warning/50 px-4 py-2.5 text-warning-foreground">
            <ShoppingCartIcon className="size-4 shrink-0" />
            <div className="min-w-0 flex-1 text-xs">
              <div className="font-medium">Cart left {abandonedCheckout.ago}</div>
              <div className="truncate opacity-80">
                {abandonedCheckout.items[0].title} · {inr(abandonedCheckout.total)}
              </div>
            </div>
            <Button size="xs" className="bg-warning-foreground text-warning hover:bg-warning-foreground/90">
              Send cart link
            </Button>
          </div>
        )}

        <div className="divide-y">
          {shopifyOrders.map((o) => (
            <OrderCard key={o.id} o={o} open={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function DetailsTab({ c }: { c: Conversation }) {
  const k = c.contact
  const [subscribed, setSubscribed] = React.useState(true)
  return (
    <div className="flex flex-col pb-8">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{c.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {c.phone} · {k.city}
          </div>
        </div>
        <StatusBadge tone="success">
          <ClockIcon />
          {c.windowLeft ? c.windowLeft.split(" ").slice(0, 2).join(" ") : "Expired"}
        </StatusBadge>
      </div>

      <div className="border-b bg-violet/40 px-4 py-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-violet-foreground">
          <SparklesIcon className="size-3.5" />
          AI summary
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/90">{k.summary}</p>
      </div>

      <Section title="Contact">
        <dl>
          <Field label="Phone">{c.phone}</Field>
          {k.email && <Field label="Email">{k.email}</Field>}
          {k.attributes.map((a) => (
            <Field key={a.label} label={a.label}>
              {a.value}
            </Field>
          ))}
          <div className="flex items-center justify-between py-1 text-[13px]">
            <span className="text-muted-foreground">Subscribed</span>
            <Switch checked={subscribed} onCheckedChange={(v) => setSubscribed(!!v)} aria-label="Subscribed to marketing" />
          </div>
          <div className="flex flex-wrap items-center gap-1 pt-1.5">
            {k.tags.map((t) => (
              <StatusBadge key={t} variant="secondary">
                {t}
              </StatusBadge>
            ))}
            <button type="button" className="rounded-md px-1.5 text-xs font-medium text-link hover:underline">
              + Label
            </button>
          </div>
        </dl>
      </Section>

      <Section title="Conversation">
        <dl>
          <Field label="Assignee">{c.assignee ?? "Unassigned"}</Field>
          <Field label="Reply window">
            <StatusBadge tone="success" className="h-5 px-1.5">Open · {c.windowLeft ?? "0 h"}</StatusBadge>
          </Field>
          <Field label="First response due">
            {c.sla ? <StatusBadge tone={c.sla.tone} className="h-5 px-1.5">{c.sla.text}</StatusBadge> : "Met"}
          </Field>
          <Field label="Blocked">No</Field>
        </dl>
      </Section>

      <ShopifySection />

      <Section title="Workflow runs" icon={WorkflowIcon} count={workflowRuns.length} defaultOpen={false}>
        <ul className="flex flex-col gap-1.5">
          {workflowRuns.map((w) => (
            <li key={w.name} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-[13px]">
              <span className="min-w-0 flex-1 truncate">{w.name}</span>
              <StatusBadge tone={w.tone} className="h-5 px-1.5">{w.state}</StatusBadge>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Notes"
        count={notes.length}
        action={
          <Button size="xs" variant="ghost" className="text-muted-foreground">
            <PlusIcon data-icon="inline-start" />
            Note
          </Button>
        }
      >
        {notes.map((n) => (
          <div key={n.text} className="rounded-lg bg-note px-3 py-2 text-[13px]">
            <p>{n.text}</p>
            <div className="mt-1 text-xs text-note-foreground">{n.author} · {n.time}</div>
          </div>
        ))}
      </Section>
    </div>
  )
}

function CopilotTab({ onUse }: { onUse: (text: string) => void }) {
  const [q, setQ] = React.useState("")
  const answer =
    "Order #NN-20481 is unfulfilled and pickup is at 2 pm, so the address can still change. Ask for the full new address with pincode, update it in Shopify, then send the new tracking link once the label is printed."
  const draft = "Sure Ananya! Please share the new address with the pincode. I will update it before the courier pickup at 2 pm today."
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3 py-2 text-[13px]">
          Can we still change her address?
        </div>
        <div className="flex flex-col gap-2 rounded-2xl rounded-bl-md bg-violet/50 p-3 text-[13px]">
          <div className="flex items-center gap-1.5 text-xs font-medium text-violet-foreground">
            <BotIcon className="size-3.5" />
            AI Copilot
          </div>
          <p className="leading-relaxed">{answer}</p>
          <div className="rounded-lg bg-card p-2.5 text-[13px] ring-1 ring-border">{draft}</div>
          <Button size="xs" variant="secondary" className="self-start" onClick={() => onUse(draft)}>
            Add to composer
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t p-3">
        <div className="flex flex-wrap gap-1.5">
          {["Suggest a reply", "Summarise", "What did she buy before?"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQ(s)}
              className="rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full border bg-card py-1 pr-1 pl-3 focus-within:ring-3 focus-within:ring-ring/25">
          <input
            id="copilot-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask about this customer"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
          <Button size="icon-sm" aria-label="Ask AI Copilot" disabled={!q.trim()}>
            <SendHorizontalIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function InboxDetails({ c, onUseDraft }: { c: Conversation; onUseDraft: (t: string) => void }) {
  const [tab, setTab] = React.useState("details")
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center border-b px-3">
        <SegmentedControl
          value={tab}
          onChange={setTab}
          options={[
            { value: "details", label: "Details" },
            { value: "copilot", label: "AI Copilot" },
          ]}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "details" ? <DetailsTab c={c} /> : <CopilotTab onUse={onUseDraft} />}
      </div>
    </div>
  )
}
