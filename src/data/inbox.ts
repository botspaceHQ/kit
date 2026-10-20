// Demo data only. Fictional brand "Nila Naturals" (Shopify skincare store) and fictional people.

export type Channel = "whatsapp" | "instagram" | "web"
export type ConvStatus = "open" | "pending" | "closed"

export type Message =
  | { kind: "day"; id: string; label: string }
  | { kind: "event"; id: string; text: string }
  | {
      kind: "in" | "out" | "bot" | "note"
      id: string
      text: string
      time: string
      author?: string
      status?: "sent" | "delivered" | "read"
      image?: string
    }
  | {
      kind: "template"
      id: string
      name: string
      header: string
      body: string
      buttons: string[]
      time: string
      status?: "sent" | "delivered" | "read"
    }
  | {
      kind: "order"
      id: string
      orderNo: string
      items: string
      total: string
      state: string
      time: string
    }

export type Conversation = {
  id: string
  name: string
  initials: string
  hue: number
  phone: string
  channel: Channel
  status: ConvStatus
  preview: string
  time: string
  unread: number
  assignee: string | null
  labels: { text: string; tone: "info" | "warning" | "success" | "violet" | "danger" | "default" }[]
  sla?: { text: string; tone: "warning" | "danger" }
  botHandled?: boolean
  windowLeft?: string
  messages: Message[]
  contact: {
    email?: string
    city: string
    tags: string[]
    orders: number
    spent: string
    lastOrder?: { no: string; date: string; total: string; state: string }
    summary: string
    attributes: { label: string; value: string }[]
  }
}

export const teammates = ["Riya Sharma", "Arjun Mehta", "Kabir Rao", "AI agent"]

export const conversations: Conversation[] = [
  {
    id: "c1",
    name: "Ananya Iyer",
    initials: "AI",
    hue: 205,
    phone: "+91 98201 4•••7",
    channel: "whatsapp",
    status: "open",
    preview: "Can I change the address? I moved last week",
    time: "2m",
    unread: 2,
    assignee: "Riya Sharma",
    labels: [
      { text: "Order #NN-20481", tone: "info" },
      { text: "Address change", tone: "warning" },
    ],
    sla: { text: "Reply in 6m", tone: "warning" },
    windowLeft: "23 h 41 m",
    messages: [
      { kind: "day", id: "d1", label: "Yesterday" },
      {
        kind: "template",
        id: "m0",
        name: "order_confirmation_v3",
        header: "Your order is confirmed",
        body: "Hi Ananya, thanks for shopping with Nila Naturals. Order #NN-20481 (2 items, ₹1,213) is confirmed and will ship in 24 hours.",
        buttons: ["Track order", "Talk to us"],
        time: "6:12 pm",
        status: "read",
      },
      { kind: "day", id: "d2", label: "Today" },
      {
        kind: "in",
        id: "m1",
        text: "Hi! I placed an order yesterday for the saffron face oil",
        time: "10:02 am",
      },
      {
        kind: "bot",
        id: "m2",
        text: "Hi Ananya, I can see order #NN-20481. It is packed and will ship today. How can I help?",
        time: "10:02 am",
        author: "AI agent",
        status: "read",
      },
      {
        kind: "in",
        id: "m3",
        text: "Can I change the address? I moved last week",
        time: "10:04 am",
      },
      {
        kind: "event",
        id: "e1",
        text: "AI agent handed over to Riya Sharma · reason: address change needs a person",
      },
      {
        kind: "order",
        id: "o1",
        orderNo: "#NN-20481",
        items: "Kumkumadi saffron face oil 30 ml, Neem clay mask",
        total: "₹1,213",
        state: "Packed · ships today",
        time: "10:04 am",
      },
      {
        kind: "note",
        id: "n1",
        text: "Courier pickup is at 2 pm. We can still edit the address in Shiprocket before that.",
        time: "10:05 am",
        author: "Riya Sharma",
      },
    ],
    contact: {
      email: "ananya.iyer@example.com",
      city: "Bengaluru",
      tags: ["Repeat buyer", "COD"],
      orders: 4,
      spent: "₹5,912",
      lastOrder: { no: "#NN-20481", date: "19 Oct", total: "₹1,213", state: "Packed" },
      summary:
        "Fourth order. Wants to move delivery to a new Bengaluru address before pickup at 2 pm. Usually pays cash on delivery.",
      attributes: [
        { label: "Source", value: "Instagram ad · Diwali glow" },
        { label: "Language", value: "English" },
        { label: "Opted in", value: "12 Mar 2026" },
      ],
    },
  },
  {
    id: "c2",
    name: "Rahul Verma",
    initials: "RV",
    hue: 150,
    phone: "+91 99870 3•••2",
    channel: "whatsapp",
    status: "open",
    preview: "Payment done but order not showing",
    time: "8m",
    unread: 1,
    assignee: null,
    labels: [{ text: "Payment", tone: "danger" }],
    sla: { text: "Overdue 3m", tone: "danger" },
    windowLeft: "23 h 52 m",
    messages: [
      { kind: "day", id: "d1", label: "Today" },
      { kind: "in", id: "m1", text: "Payment done but order not showing", time: "9:56 am" },
    ],
    contact: {
      city: "Pune",
      tags: ["New customer"],
      orders: 0,
      spent: "₹0",
      summary: "Says UPI payment went through but no order was created.",
      attributes: [{ label: "Source", value: "Website widget" }],
    },
  },
  {
    id: "c3",
    name: "Meera Kapoor",
    initials: "MK",
    hue: 320,
    phone: "@meera.glows",
    channel: "instagram",
    status: "open",
    preview: "Is the rose toner good for oily skin?",
    time: "21m",
    unread: 0,
    assignee: "AI agent",
    botHandled: true,
    labels: [{ text: "Product question", tone: "violet" }],
    messages: [],
    contact: {
      city: "Delhi",
      tags: ["Lead"],
      orders: 0,
      spent: "₹0",
      summary: "Asking about the rose toner for oily skin. AI agent is answering.",
      attributes: [],
    },
  },
  {
    id: "c4",
    name: "Siddharth Nair",
    initials: "SN",
    hue: 30,
    phone: "+91 90040 1•••9",
    channel: "whatsapp",
    status: "pending",
    preview: "You: Sharing the return pickup slot now",
    time: "1h",
    unread: 0,
    assignee: "Arjun Mehta",
    labels: [{ text: "Return", tone: "warning" }],
    messages: [],
    contact: { city: "Kochi", tags: ["Repeat buyer"], orders: 3, spent: "₹3,210", summary: "Return for a damaged jar.", attributes: [] },
  },
  {
    id: "c5",
    name: "Priyanka Das",
    initials: "PD",
    hue: 265,
    phone: "+91 98300 6•••4",
    channel: "whatsapp",
    status: "open",
    preview: "Abandoned cart · AI agent sent a 10% code",
    time: "2h",
    unread: 0,
    assignee: "AI agent",
    botHandled: true,
    labels: [{ text: "Cart recovery", tone: "success" }],
    messages: [],
    contact: { city: "Kolkata", tags: ["Cart abandoner"], orders: 1, spent: "₹699", summary: "Cart recovery in progress.", attributes: [] },
  },
  {
    id: "c6",
    name: "Farhan Qureshi",
    initials: "FQ",
    hue: 185,
    phone: "Web visitor",
    channel: "web",
    status: "open",
    preview: "Do you ship to Dubai?",
    time: "3h",
    unread: 0,
    assignee: "Kabir Rao",
    labels: [{ text: "Shipping", tone: "info" }],
    messages: [],
    contact: { city: "Dubai", tags: ["International"], orders: 0, spent: "₹0", summary: "Asks about international shipping.", attributes: [] },
  },
  {
    id: "c7",
    name: "Lakshmi Reddy",
    initials: "LR",
    hue: 95,
    phone: "+91 97000 2•••1",
    channel: "whatsapp",
    status: "closed",
    preview: "Thank you so much! 🙏",
    time: "Yesterday",
    unread: 0,
    assignee: "Riya Sharma",
    labels: [],
    messages: [],
    contact: { city: "Hyderabad", tags: ["VIP"], orders: 9, spent: "₹14,820", summary: "Resolved delivery delay.", attributes: [] },
  },
]

export const quickReplies = [
  "Sure, please share the new address with pincode",
  "I have updated it. You will get a new tracking link",
  "Sorry for the trouble. Let me check this for you",
]
