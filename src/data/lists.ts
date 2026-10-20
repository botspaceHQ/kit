// Demo data only. Status values match the product enums (BroadcastStatus, workflow triggers).

export type BroadcastStatus =
  | "CREATED"
  | "QUEUING"
  | "SENDING"
  | "COMPLETED"
  | "SCHEDULED"
  | "SCHEDULED_RETRY"
  | "CANCELLED"
  | "FAILED"

export type Broadcast = {
  id: string
  name: string
  template: string
  channel: string
  status: BroadcastStatus
  audience: string
  total: number
  sent: number
  delivered: number
  read: number
  replied: number
  clicked: number | null
  failed: number
  revenue: number
  cost: number
  sendAt: string
  sendAtSort: number
}

const b = (
  id: string,
  name: string,
  template: string,
  status: BroadcastStatus,
  audience: string,
  total: number,
  rates: [number, number, number, number, number | null, number],
  revenue: number,
  sendAt: string,
  sendAtSort: number
): Broadcast => {
  const [s, d, r, rep, c, f] = rates
  const sent = Math.round(total * s)
  return {
    id,
    name,
    template,
    channel: "Nila Naturals · +91 80 4•••• 210",
    status,
    audience,
    total,
    sent,
    delivered: Math.round(total * d),
    read: Math.round(total * r),
    replied: Math.round(total * rep),
    clicked: c === null ? null : Math.round(total * c),
    failed: Math.round(total * f),
    revenue,
    cost: Math.round(sent * 0.88),
    sendAt,
    sendAtSort,
  }
}

export const broadcasts: Broadcast[] = [
  b("b1", "Diwali glow sale · early access", "diwali_sale_2026", "SENDING", "Repeat buyers · 90 days", 18420, [0.62, 0.58, 0.31, 0.04, 0.09, 0.01], 0, "Today at 10:30am", 20),
  b("b2", "Diwali glow sale · VIP preview", "diwali_vip_preview", "COMPLETED", "VIP (5+ orders)", 2310, [0.99, 0.97, 0.81, 0.14, 0.32, 0.01], 412800, "18 Oct 26 at 7:00pm", 19),
  b("b3", "Kumkumadi oil restock", "back_in_stock_v2", "COMPLETED", "Waitlist · Kumkumadi", 4870, [0.99, 0.95, 0.72, 0.06, 0.21, 0.01], 268350, "16 Oct 26 at 11:00am", 18),
  b("b4", "Dhanteras gift sets", "festive_gift_sets", "SCHEDULED", "All opted-in contacts", 41250, [0, 0, 0, 0, null, 0], 0, "29 Oct 26 at 9:00am", 30),
  b("b5", "COD confirmation reminder", "cod_confirmation", "SCHEDULED_RETRY", "COD orders · not confirmed", 640, [0.71, 0.66, 0.52, 0.31, null, 0.05], 0, "Today at 2:00pm", 21),
  b("b6", "New arrivals · rose range", "new_arrivals_launch", "COMPLETED", "Engaged · 30 days", 12960, [0.98, 0.93, 0.64, 0.03, 0.12, 0.02], 186900, "12 Oct 26 at 6:30pm", 17),
  b("b7", "Abandoned cart · last call", "abandoned_cart_reminder", "COMPLETED", "Cart abandoners · 7 days", 3120, [0.99, 0.96, 0.77, 0.09, 0.28, 0.01], 154200, "10 Oct 26 at 8:00pm", 16),
  b("b8", "Navratri combo offer", "navratri_combo", "CANCELLED", "Gujarat + Maharashtra", 9800, [0, 0, 0, 0, null, 0], 0, "3 Oct 26 at 10:00am", 15),
  b("b9", "Review request · September orders", "review_request_v4", "COMPLETED", "Delivered in September", 7430, [0.99, 0.94, 0.69, 0.11, 0.18, 0.01], 0, "1 Oct 26 at 5:00pm", 14),
  b("b10", "Price drop alert", "price_drop_alert", "FAILED", "Wishlist · any", 1980, [0.12, 0.09, 0.05, 0, 0.01, 0.88], 0, "28 Sep 26 at 4:15pm", 13),
  b("b11", "Black Friday early access", "black_friday_early_access", "CREATED", "Not chosen yet", 0, [0, 0, 0, 0, null, 0], 0, "Not scheduled", 40),
  b("b12", "Monsoon skin care tips", "content_tips_monsoon", "COMPLETED", "Engaged · 60 days", 15210, [0.98, 0.92, 0.58, 0.02, 0.07, 0.02], 48300, "20 Sep 26 at 7:30pm", 12),
]

export type FlowTrigger = {
  group: "Messages" | "Shopify" | "Instagram" | "AI calls"
  label: string
}

export type Workflow = {
  id: string
  name: string
  description: string
  trigger: FlowTrigger
  execution: "Customer facing" | "Background"
  enabled: boolean
  enrolled: number
  enrolled7d: number
  trend: number[]
  revenue: number
  updated: string
  updatedSort: number
}

export const workflows: Workflow[] = [
  { id: "w1", name: "Welcome and menu", description: "Greets first-time contacts and shows the main menu", trigger: { group: "Messages", label: "First message" }, execution: "Customer facing", enabled: true, enrolled: 48210, enrolled7d: 1840, trend: [210, 240, 260, 230, 280, 310, 310], revenue: 96400, updated: "2 days ago", updatedSort: 2 },
  { id: "w2", name: "After hours reply", description: "Tells contacts when the team is back, hands over to AI agent", trigger: { group: "Messages", label: "After hours" }, execution: "Customer facing", enabled: true, enrolled: 12890, enrolled7d: 402, trend: [60, 52, 71, 58, 49, 62, 50], revenue: 0, updated: "3 weeks ago", updatedSort: 21 },
  { id: "w3", name: "Order confirmation + COD check", description: "Sends confirmation and asks COD buyers to confirm", trigger: { group: "Shopify", label: "Order created" }, execution: "Customer facing", enabled: true, enrolled: 31540, enrolled7d: 1215, trend: [150, 162, 170, 181, 176, 190, 186], revenue: 0, updated: "5 days ago", updatedSort: 5 },
  { id: "w4", name: "Abandoned cart · 3 steps", description: "1 h reminder, 24 h with 10% code, 72 h last call", trigger: { group: "Shopify", label: "Abandon cart" }, execution: "Customer facing", enabled: true, enrolled: 22760, enrolled7d: 980, trend: [120, 135, 128, 150, 142, 160, 145], revenue: 742300, updated: "Yesterday", updatedSort: 1 },
  { id: "w5", name: "Shipped and out for delivery", description: "Tracking link on fulfilment, nudge on out for delivery", trigger: { group: "Shopify", label: "Fulfillment updated" }, execution: "Background", enabled: true, enrolled: 28400, enrolled7d: 1102, trend: [140, 150, 158, 160, 149, 170, 175], revenue: 0, updated: "2 weeks ago", updatedSort: 14 },
  { id: "w6", name: "Price please", description: "DMs the price and link when someone comments \"price\"", trigger: { group: "Instagram", label: "Post comment" }, execution: "Customer facing", enabled: true, enrolled: 9310, enrolled7d: 655, trend: [70, 81, 95, 88, 102, 110, 109], revenue: 81200, updated: "4 days ago", updatedSort: 4 },
  { id: "w7", name: "Story reply leads", description: "Collects phone number from story replies", trigger: { group: "Instagram", label: "Story reply" }, execution: "Customer facing", enabled: false, enrolled: 1240, enrolled7d: 0, trend: [12, 8, 4, 0, 0, 0, 0], revenue: 0, updated: "1 month ago", updatedSort: 30 },
  { id: "w8", name: "COD order confirmation call", description: "AI call for COD orders above ₹1,500", trigger: { group: "AI calls", label: "Order created" }, execution: "Background", enabled: true, enrolled: 3870, enrolled7d: 214, trend: [25, 28, 31, 30, 33, 35, 32], revenue: 0, updated: "6 days ago", updatedSort: 6 },
  { id: "w9", name: "NDR verification call", description: "Calls the buyer when the courier marks a failed delivery", trigger: { group: "AI calls", label: "Fulfillment updated" }, execution: "Background", enabled: false, enrolled: 610, enrolled7d: 0, trend: [9, 6, 3, 0, 0, 0, 0], revenue: 0, updated: "3 weeks ago", updatedSort: 21 },
  { id: "w11", name: "Track my order", description: "Replies with live tracking when someone types track, order or where", trigger: { group: "Messages", label: "Keyword" }, execution: "Customer facing", enabled: true, enrolled: 15320, enrolled7d: 702, trend: [90, 96, 101, 99, 104, 108, 104], revenue: 0, updated: "1 week ago", updatedSort: 7 },
  { id: "w12", name: "Price list", description: "Sends the PDF price list for the keyword price", trigger: { group: "Messages", label: "Keyword" }, execution: "Customer facing", enabled: true, enrolled: 4120, enrolled7d: 188, trend: [22, 25, 28, 26, 30, 29, 28], revenue: 38900, updated: "3 weeks ago", updatedSort: 21 },
  { id: "w13", name: "Festive hours notice", description: "Diwali week timings, replaces the normal after hours reply", trigger: { group: "Messages", label: "After hours" }, execution: "Customer facing", enabled: false, enrolled: 0, enrolled7d: 0, trend: [0, 0, 0, 0, 0, 0, 0], revenue: 0, updated: "Yesterday", updatedSort: 1 },
  { id: "w14", name: "Abandoned cart · above ₹2,000", description: "Faster reminder and free shipping for big carts", trigger: { group: "Shopify", label: "Abandon cart" }, execution: "Customer facing", enabled: true, enrolled: 2980, enrolled7d: 133, trend: [16, 18, 19, 21, 18, 22, 19], revenue: 211400, updated: "4 days ago", updatedSort: 4 },
  { id: "w15", name: "Diwali giveaway comments", description: "DMs the giveaway form to everyone who comments", trigger: { group: "Instagram", label: "Post comment" }, execution: "Customer facing", enabled: true, enrolled: 6740, enrolled7d: 1490, trend: [40, 120, 210, 260, 280, 300, 280], revenue: 0, updated: "3 days ago", updatedSort: 3 },
  { id: "w10", name: "Draft - 18 Oct 2026", description: "", trigger: { group: "Messages", label: "Keyword" }, execution: "Customer facing", enabled: false, enrolled: 0, enrolled7d: 0, trend: [0, 0, 0, 0, 0, 0, 0], revenue: 0, updated: "2 days ago", updatedSort: 2 },
]
