import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"

/**
 * Two-column settings form block: what it is on the left (title and one sentence),
 * the fields on the right. Stacks to one column under 768 px.
 */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </CardContent>
    </Card>
  )
}

/** Label, control, then an optional hint. The label points at the control by id. */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  /** Replaces the hint. Say what is wrong and how to fix it. */
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

/** A stack of FormSections with the page's save row under them. */
export function FormStack({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">{children}</div>
}
