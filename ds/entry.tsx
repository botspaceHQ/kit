// Entry of the design-system bundle (components/bundle.js). Exposes the kit on window.BotSpaceKit
// and mount(el, id), which the preview cards call. React and ReactDOM come from the page.
import * as React from "react"
import { createRoot } from "react-dom/client"

import "./ds.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { demos } from "@/docs/demos"

export * from "@/components/kit/app-rail"
export * from "@/components/kit/charts"
export * from "@/components/kit/data-table"
export * from "@/components/kit/form-section"
export * from "@/components/kit/frame"
export * from "@/components/kit/inbox-panes"
export * from "@/components/kit/segmented"
export * from "@/components/kit/settings-tiles"
export * from "@/components/kit/stat-cards"
export * from "@/components/kit/status-badge"
export * from "@/components/ui/avatar"
export * from "@/components/ui/badge"
export * from "@/components/ui/button"
export * from "@/components/ui/card"
export * from "@/components/ui/checkbox"
export * from "@/components/ui/dropdown-menu"
export * from "@/components/ui/input"
export * from "@/components/ui/select"
export * from "@/components/ui/switch"
export * from "@/components/ui/tabs"
export * from "@/components/ui/textarea"
export * from "@/components/ui/tooltip"

export { demos }

// The page switches themes with data-theme on <html>. Switch colour transitions off for that change,
// so no part keeps the old theme's colours while a transition waits for a frame.
let watching = false
function watchTheme() {
  if (watching) return
  watching = true
  new MutationObserver(() => {
    const off = document.createElement("style")
    off.textContent = "*,*::before,*::after{transition:none!important}"
    document.head.appendChild(off)
    void window.getComputedStyle(document.body).color
    setTimeout(() => off.remove(), 0)
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
}

/** Render the demo with this id into el. Every preview card calls this. */
export function mount(el: HTMLElement, id: string) {
  watchTheme()
  const Demo = demos[id]
  createRoot(el).render(
    <TooltipProvider>
      {Demo ? <Demo /> : <p style={{ font: "13px sans-serif" }}>No demo named {id}.</p>}
    </TooltipProvider>
  )
}
