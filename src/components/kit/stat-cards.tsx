import * as React from "react"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type StatCardItem = {
  label: string
  value: string
  /** A small badge or delta in the top-right corner. */
  trend?: React.ReactNode
  /** One line of context under the number. */
  hint?: React.ReactNode
}

/** shadcn "section cards": one Card per number, trend in the corner, context in the footer. */
export function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => (
        <Card key={s.label} size="sm" data-stat-card="">
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums group-data-[size=sm]/card:text-2xl">{s.value}</CardTitle>
            {s.trend && <CardAction>{s.trend}</CardAction>}
          </CardHeader>
          {s.hint && <CardFooter className="text-xs text-muted-foreground">{s.hint}</CardFooter>}
        </Card>
      ))}
    </div>
  )
}
