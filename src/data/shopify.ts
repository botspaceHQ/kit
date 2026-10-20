// Demo Shopify data for the inbox side panel. Shape follows ShopifyOrderDTO (financial_status, fulfillments...).

export type FinancialStatus = "paid" | "pending" | "partially_paid" | "refunded" | "partially_refunded" | "voided" | "authorized"
export type FulfilmentLabel =
  | "Unfulfilled"
  | "Label printed"
  | "In transit"
  | "Out for delivery"
  | "Delivered"
  | "Attempted delivery"
  | "Canceled"

export type ShopifyOrder = {
  id: string
  name: string
  createdAgo: string
  createdAt: string
  financial: FinancialStatus
  gateway: "COD" | "UPI" | "Card"
  fulfilment: FulfilmentLabel
  items: { title: string; variant: string; qty: number; price: number; hue: number }[]
  shipping: number
  tax: number
  discount?: { code: string; amount: number }
  tracking?: { courier: string; number: string; eta: string }
  address: string
}

export const shopifyCustomer = {
  name: "Ananya Iyer",
  since: "12 Mar 2026",
  orders: 4,
  spent: 5912,
  aov: 1478,
  tags: ["repeat", "cod", "diwali-26"],
  marketing: "Subscribed to WhatsApp",
}

export const shopifyOrders: ShopifyOrder[] = [
  {
    id: "o1",
    name: "#NN-20481",
    createdAgo: "17 h ago",
    createdAt: "19 Oct 2026, 6:11 pm",
    financial: "pending",
    gateway: "COD",
    fulfilment: "Unfulfilled",
    items: [
      { title: "Kumkumadi saffron face oil", variant: "30 ml", qty: 1, price: 899, hue: 40 },
      { title: "Neem clay mask", variant: "100 g", qty: 1, price: 449, hue: 140 },
    ],
    shipping: 0,
    tax: 0,
    discount: { code: "GLOW10", amount: 135 },
    address: "Flat 4B, Prestige Lakeside, Varthur Road, Bengaluru, KA 560087",
  },
  {
    id: "o2",
    name: "#NN-19022",
    createdAgo: "26 days ago",
    createdAt: "24 Sep 2026, 9:40 pm",
    financial: "paid",
    gateway: "UPI",
    fulfilment: "Delivered",
    items: [{ title: "Rose water toner", variant: "200 ml", qty: 2, price: 399, hue: 350 }],
    shipping: 49,
    tax: 0,
    tracking: { courier: "Delhivery", number: "1428 3390 1182", eta: "Delivered 27 Sep" },
    address: "12, 3rd Cross, Indiranagar, Bengaluru, KA 560038",
  },
  {
    id: "o3",
    name: "#NN-17310",
    createdAgo: "2 months ago",
    createdAt: "18 Aug 2026, 1:05 pm",
    financial: "partially_refunded",
    gateway: "Card",
    fulfilment: "Delivered",
    items: [
      { title: "Ubtan face wash", variant: "150 ml", qty: 1, price: 349, hue: 25 },
      { title: "Lip balm trio", variant: "3 x 4 g", qty: 1, price: 499, hue: 0 },
    ],
    shipping: 49,
    tax: 0,
    tracking: { courier: "Bluedart", number: "7790 1123 556", eta: "Delivered 21 Aug" },
    address: "12, 3rd Cross, Indiranagar, Bengaluru, KA 560038",
  },
]

export const abandonedCheckout = {
  ago: "3 days ago",
  items: [{ title: "Vitamin C serum", variant: "30 ml", qty: 1, price: 799, hue: 55 }],
  total: 799,
  recovered: false,
}

export const workflowRuns = [
  { name: "Order confirmation + COD check", state: "Waiting for reply", tone: "info" as const, time: "17 h ago" },
  { name: "Abandoned cart · 3 steps", state: "Completed", tone: "success" as const, time: "3 days ago" },
]

export const notes = [
  { author: "Riya Sharma", time: "10:05 am", text: "Courier pickup is at 2 pm. We can still edit the address in Shiprocket before that." },
]
