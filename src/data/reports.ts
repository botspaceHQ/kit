import type { FlowLink, FlowNode } from "@/components/kit/charts"

// Demo data only, shaped like the product's metrics (conversations, first response, AI agent, attribution).

export const days30 = Array.from({ length: 30 }, (_, i) =>
  new Date(2026, 8, 21 + i).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
)

const wave = (base: number, amp: number, seed: number) =>
  days30.map((_, i) => {
    const d = new Date(2026, 8, 21 + i).getDay()
    const weekend = d === 0 || d === 6 ? 1.18 : 1
    const n = Math.sin(i * 1.7 + seed) * 0.5 + Math.sin(i * 0.6 + seed * 2) * 0.5
    return Math.round((base + amp * n) * weekend)
  })

export const aiResolved = wave(30, 6, 1)
export const handedOver = wave(12, 4, 2)

export const hours = Array.from({ length: 24 }, (_, h) =>
  h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`
)
export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
// Indian D2C pattern: quiet at night, lunch bump, big 8 to 11 pm peak, weekends later.
export const heat = weekdays.map((_, d) =>
  hours.map((_, h) => {
    const night = h < 7 ? 0.08 : 1
    const lunch = Math.exp(-((h - 13) ** 2) / 6) * 0.6
    const evening = Math.exp(-((h - 21) ** 2) / 5) * (d >= 5 ? 1.25 : 1)
    const morning = Math.exp(-((h - 10) ** 2) / 8) * 0.4
    return Math.round((lunch + evening + morning) * 60 * night + (h === 3 ? 0 : 0))
  })
)

export const reasons = [
  { label: "Where is my order", value: 318, hint: "25%" },
  { label: "Product question", value: 241, hint: "19%" },
  { label: "Address change", value: 152, hint: "12%" },
  { label: "Return or exchange", value: 129, hint: "10%" },
  { label: "Payment or COD", value: 104, hint: "8%" },
  { label: "Discount code", value: 77, hint: "6%" },
]

export const handoverReasons = [
  { label: "Needs to edit an order", value: 96 },
  { label: "Asked for a person", value: 71 },
  { label: "Refund request", value: 48 },
  { label: "No answer in knowledge base", value: 39 },
  { label: "Angry customer", value: 18 },
]

export const team = [
  { id: "t1", name: "Riya Sharma", initials: "RS", online: true, assigned: 214, closed: 205, firstReply: "1 m 42 s", firstReplySort: 102, sla: 96, csat: 4.8 },
  { id: "t2", name: "Arjun Mehta", initials: "AM", online: true, assigned: 188, closed: 176, firstReply: "2 m 05 s", firstReplySort: 125, sla: 93, csat: 4.6 },
  { id: "t3", name: "Kabir Rao", initials: "KR", online: false, assigned: 131, closed: 119, firstReply: "3 m 31 s", firstReplySort: 211, sla: 84, csat: 4.4 },
  { id: "t4", name: "Sana Khan", initials: "SK", online: true, assigned: 97, closed: 95, firstReply: "1 m 58 s", firstReplySort: 118, sla: 95, csat: 4.9 },
]
export type TeamRow = (typeof team)[number]

export const attributionRows = [
  { source: "Abandoned cart · 3 steps", type: "Workflow", orders: 412, revenue: 742300 },
  { source: "Diwali glow sale · VIP preview", type: "Broadcast", orders: 236, revenue: 412800 },
  { source: "AI agent product answers", type: "AI agent", orders: 301, revenue: 455900 },
  { source: "Kumkumadi oil restock", type: "Broadcast", orders: 171, revenue: 268350 },
  { source: "AI agent upsell after purchase", type: "AI agent", orders: 142, revenue: 229500 },
  { source: "New arrivals · rose range", type: "Broadcast", orders: 119, revenue: 186900 },
  { source: "Abandoned cart · last call", type: "Broadcast", orders: 98, revenue: 154200 },
  { source: "Welcome and menu", type: "Workflow", orders: 61, revenue: 96400 },
  { source: "Price please", type: "Workflow", orders: 52, revenue: 81200 },
]

export const flowNodes: FlowNode[] = [
  { id: "all", label: "Conversations", value: 1317, col: 0, color: "var(--chart-1)" },
  { id: "ai", label: "AI agent involved", value: 912, col: 1, color: "var(--chart-4)" },
  { id: "team", label: "Teammate replied", value: 270, col: 1, color: "var(--chart-3)" },
  { id: "noreply", label: "No reply needed", value: 135, col: 1, color: "var(--muted-foreground)" },
  { id: "aiResolved", label: "Resolved by AI agent", value: 780, col: 2, color: "var(--chart-2)" },
  { id: "escalated", label: "Handed to team", value: 132, col: 2, color: "var(--destructive)" },
  { id: "teamClosed", label: "Closed by teammate", value: 252, col: 2, color: "var(--chart-2)" },
  { id: "pending", label: "Pending", value: 18, col: 2, color: "var(--muted-foreground)" },
  { id: "auto", label: "Closed automatically", value: 135, col: 2, color: "var(--muted-foreground)" },
  { id: "escClosed", label: "Closed by teammate", value: 118, col: 3, color: "var(--chart-2)" },
  { id: "escOpen", label: "Still open", value: 14, col: 3, color: "var(--muted-foreground)" },
]
export const flowLinks: FlowLink[] = [
  { source: "all", target: "ai", value: 912 },
  { source: "all", target: "team", value: 270 },
  { source: "all", target: "noreply", value: 135 },
  { source: "ai", target: "aiResolved", value: 780 },
  { source: "ai", target: "escalated", value: 132 },
  { source: "team", target: "teamClosed", value: 252 },
  { source: "team", target: "pending", value: 18 },
  { source: "noreply", target: "auto", value: 135 },
  { source: "escalated", target: "escClosed", value: 118 },
  { source: "escalated", target: "escOpen", value: 14 },
]
