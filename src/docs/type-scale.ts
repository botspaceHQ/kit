/* The type scale. Plain data: the reference site and the design-system export read it.
   Sizes are what the kit components use today (Tailwind classes in brackets). */

export type TypeStyle = {
  name: string
  fontSize: string
  lineHeight: string
  fontWeight: number
  family: "sans" | "mono"
  sample: string
  usage: string
  className: string
}

export const typeFamilies = {
  sans: "'Inter', 'Inter Variable', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
}

export const typeScale: TypeStyle[] = [
  { name: "stat", fontSize: "24px", lineHeight: "32px", fontWeight: 600, family: "sans", sample: "₹6,71,400", usage: "The number in a stat card. Tabular figures. (text-2xl font-semibold)", className: "text-2xl font-semibold tabular-nums" },
  { name: "page-title", fontSize: "16px", lineHeight: "24px", fontWeight: 600, family: "sans", sample: "Broadcasts", usage: "Page and pane titles in the 56 px header. (text-base font-semibold)", className: "text-base font-semibold" },
  { name: "card-title", fontSize: "16px", lineHeight: "24px", fontWeight: 500, family: "sans", sample: "Top reasons customers write", usage: "Card, panel and settings group titles. (text-base font-medium)", className: "text-base font-medium" },
  { name: "body", fontSize: "14px", lineHeight: "20px", fontWeight: 400, family: "sans", sample: "Your order is out for delivery and reaches you today.", usage: "Default text: messages, table cells, inputs. (text-sm)", className: "text-sm" },
  { name: "label", fontSize: "14px", lineHeight: "20px", fontWeight: 500, family: "sans", sample: "Workspace name", usage: "Form labels, buttons, the active navigation item. (text-sm font-medium)", className: "text-sm font-medium" },
  { name: "small", fontSize: "13px", lineHeight: "18px", fontWeight: 400, family: "sans", sample: "Is the Kumkumadi oil back in stock?", usage: "List previews, tile bodies, key and value rows, table heads (500). (text-[13px])", className: "text-[13px]" },
  { name: "caption", fontSize: "12px", lineHeight: "16px", fontWeight: 400, family: "sans", sample: "Last 30 days · 2m ago · 12", usage: "Hints, times, counts and badge text (500). Muted. (text-xs)", className: "text-xs text-muted-foreground" },
  { name: "micro", fontSize: "11px", lineHeight: "14px", fontWeight: 400, family: "sans", sample: "21 Sep   28 Sep   5 Oct", usage: "Chart axes and message times only. (text-[11px])", className: "text-[11px] text-muted-foreground" },
  { name: "code", fontSize: "13px", lineHeight: "20px", fontWeight: 400, family: "mono", sample: "ws_7f3k9q2m", usage: "IDs, keys and code. (font-mono text-[13px])", className: "font-mono text-[13px]" },
]
