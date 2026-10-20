import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  Columns3Icon,
  XIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * BotSpace DataTable: one grid for every list page (replaces StyledDataGrid / x-data-grid).
 * Headless TanStack Table, so sorting, selection, visibility and paging are plain state
 * and the markup is ours.
 */
export type DataTableProps<T> = {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  globalFilter?: string
  getRowId?: (row: T) => string
  onRowClick?: (row: T) => void
  bulkActions?: (rows: T[], clear: () => void) => React.ReactNode
  toolbar?: React.ReactNode
  pageSize?: number
  emptyState?: React.ReactNode
  columnLabels?: Record<string, string>
  initialSorting?: SortingState
}

export function selectColumn<T>(): ColumnDef<T, unknown> {
  return {
    id: "select",
    size: 36,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
  }
}

export function DataTable<T>({
  columns,
  data,
  globalFilter,
  getRowId,
  onRowClick,
  bulkActions,
  toolbar,
  pageSize = 8,
  emptyState,
  columnLabels = {},
  initialSorting = [],
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, rowSelection, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const selected = table.getSelectedRowModel().rows.map((r) => r.original)
  const { pageIndex } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-h-8 flex-wrap items-center gap-2">
        {selected.length > 0 && bulkActions ? (
          <div className="flex flex-1 flex-wrap items-center gap-2 rounded-full bg-secondary py-0.5 pr-0.5 pl-3 text-sm text-secondary-foreground">
            <span className="font-medium tabular-nums">
              {selected.length} selected
            </span>
            <div className="ml-auto flex items-center gap-1">
              {bulkActions(selected, () => table.resetRowSelection())}
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Clear selection"
                onClick={() => table.resetRowSelection()}
              >
                <XIcon />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {toolbar}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="sm">
                <Columns3Icon data-icon="inline-start" />
                Columns
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show columns</DropdownMenuLabel>
              {table
                .getAllLeafColumns()
                .filter((c) => c.getCanHide())
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={c.getIsVisible()}
                    onCheckedChange={(v) => c.toggleVisibility(!!v)}
                  >
                    {columnLabels[c.id] ?? c.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted">
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted()
                  const align = (h.column.columnDef.meta as { align?: string })
                    ?.align
                  return (
                    <th
                      key={h.id}
                      style={{ width: h.column.columnDef.size }}
                      className={cn(
                        "h-10 px-2 text-left text-[13px] font-medium whitespace-nowrap text-foreground first:pl-4 last:pr-4",
                        align === "right" && "text-right"
                      )}
                    >
                      {h.isPlaceholder ? null : h.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className={cn(
                            "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-accent hover:text-foreground",
                            sort && "text-foreground",
                            align === "right" && "flex-row-reverse"
                          )}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {sort === "asc" ? (
                            <ArrowUpIcon className="size-3" />
                          ) : sort === "desc" ? (
                            <ArrowDownIcon className="size-3" />
                          ) : (
                            <ChevronsUpDownIcon className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-40 text-center text-muted-foreground"
                >
                  {emptyState ?? "No rows match these filters."}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-selected={row.getIsSelected() || undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "border-b transition-colors last:border-0 hover:bg-muted/50 data-selected:bg-muted",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = (cell.column.columnDef.meta as {
                      align?: string
                    })?.align
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "h-[52px] px-2 align-middle first:pl-4 last:pr-4",
                          align === "right" && "text-right tabular-nums"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <span className="tabular-nums">
          {Object.keys(table.getState().rowSelection).length} of {total} row(s) selected · showing {from}–{to}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="px-1 tabular-nums">
            Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
