import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import {
  AppFrame,
  AppRail,
  Button,
  DataTable,
  Page,
  StatusBadge,
  ThemeProvider,
  TooltipProvider,
  selectColumn,
  type DataTableProps,
} from "@botspace/kit"

import "./index.css"

function MegaphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z" />
    </svg>
  )
}

type Row = { id: string; name: string; status: "Live" | "Draft"; sent: number }

const rows: Row[] = [
  { id: "1", name: "Diwali sale", status: "Live", sent: 12840 },
  { id: "2", name: "Cart reminder", status: "Draft", sent: 0 },
  { id: "3", name: "Back in stock", status: "Live", sent: 3120 },
]

const columns: DataTableProps<Row>["columns"] = [
  selectColumn<Row>(),
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge tone={row.original.status === "Live" ? "success" : "neutral"}>{row.original.status}</StatusBadge>
    ),
  },
  { accessorKey: "sent", header: "Sent" },
]

function App() {
  return (
    <AppFrame rail={(
        <AppRail
          logo={<span className="text-sm font-semibold">B</span>}
          groups={[{ items: [{ id: "broadcasts", label: "Broadcasts", icon: MegaphoneIcon }] }]}
          active="broadcasts"
        />
      )}>
      <Page title="Broadcasts" actions={<Button>New broadcast</Button>}>
        <DataTable columns={columns} data={rows} getRowId={(r) => r.id} />
      </Page>
    </AppFrame>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
