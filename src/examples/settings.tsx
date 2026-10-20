import * as React from "react"
import {
  BadgeIndianRupeeIcon,
  BarChart3Icon,
  BotIcon,
  BuildingIcon,
  ClockIcon,
  CopyIcon,
  GlobeIcon,
  HomeIcon,
  InboxIcon,
  KeyRoundIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  PlugIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagsIcon,
  UsersRoundIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react"

import { InstagramIcon } from "@/components/kit/brand-icons"
import { Page, SubNav, SubNavGroup, SubNavItem } from "@/components/kit/frame"
import { StatusBadge } from "@/components/kit/status-badge"
import { SettingsTiles, type TileTone } from "@/components/kit/settings-tiles"
import { FormField, FormSection, FormStack } from "@/components/kit/form-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type Tile = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  badge?: React.ReactNode
  to?: string
}

const tone = {
  workspace: "violet",
  channels: "success",
  inbox: "secondary",
  billing: "warning",
  apps: "info",
} as const

const sections: { title: string; tone: TileTone; tiles: Tile[] }[] = [
  {
    title: "Workspace",
    tone: tone.workspace,
    tiles: [
      { icon: BuildingIcon, title: "General", body: "Workspace name, time zone, currency and language.", to: "general" },
      { icon: UsersRoundIcon, title: "Members and roles", body: "Invite teammates and choose what each role can do." },
      { icon: ClockIcon, title: "Office hours", body: "When the team replies. After hours workflows use this." },
      { icon: ShieldCheckIcon, title: "Security", body: "Two-step sign-in and allowed email domains.", badge: <StatusBadge tone="warning">Review</StatusBadge> },
      { icon: KeyRoundIcon, title: "API keys", body: "Public API keys and webhooks for your developers." },
    ],
  },
  {
    title: "Channels",
    tone: tone.channels,
    tiles: [
      { icon: MessageCircleIcon, title: "WhatsApp", body: "Numbers, display name, templates and quality rating." },
      { icon: InstagramIcon, title: "Instagram", body: "Connected account, comment replies and story replies." },
      { icon: GlobeIcon, title: "Website chat", body: "Widget look, launcher and where it shows on your store." },
      { icon: MailIcon, title: "Email", body: "Forwarding address and the sender for replies." },
      { icon: PhoneIcon, title: "Voice", body: "Numbers, call routing and AI calling." },
    ],
  },
  {
    title: "Inbox and AI",
    tone: tone.inbox,
    tiles: [
      { icon: TagsIcon, title: "Labels", body: "Labels the team and the AI agent use to sort chats." },
      { icon: ZapIcon, title: "Saved replies", body: "Replies the team sends with the / key." },
      { icon: InboxIcon, title: "Assignment and SLA", body: "Who gets new chats and how fast they must reply." },
      { icon: BotIcon, title: "AI agent", body: "Tone, knowledge sources and when it hands over." },
    ],
  },
  {
    title: "Billing",
    tone: tone.billing,
    tiles: [
      { icon: WalletIcon, title: "Wallet", body: "Balance for message charges, top-ups and auto-recharge.", badge: <StatusBadge tone="warning">₹18,420</StatusBadge> },
      { icon: BadgeIndianRupeeIcon, title: "Plan", body: "Growth plan, renews on 1 Nov 2026." },
      { icon: BarChart3Icon, title: "Usage", body: "Conversations, AI replies and message charges by day." },
    ],
  },
  {
    title: "Integrations",
    tone: tone.apps,
    tiles: [
      { icon: ShoppingBagIcon, title: "Shopify", body: "Orders, carts and customers from nila-naturals.myshopify.com.", badge: <StatusBadge tone="success">Connected</StatusBadge> },
      { icon: PlugIcon, title: "All integrations", body: "Razorpay, Shiprocket, HubSpot, Zoho, Google Sheets and more." },
    ],
  },
]

function SettingsHome({ open }: { open: (to: string) => void }) {
  return (
    <SettingsTiles
      groups={sections.map((g) => ({
        ...g,
        tiles: g.tiles.map((t) => ({ ...t, onClick: t.to ? () => open(t.to!) : undefined })),
      }))}
    />
  )
}

function General() {
  const [testMode, setTestMode] = React.useState(false)
  const [optIn, setOptIn] = React.useState(true)
  return (
    <FormStack>
      <FormSection title="Workspace name and time zone" description="The time zone sets office hours, report days and when scheduled broadcasts go out.">
        <FormField id="ws-name" label="Workspace name">
          <Input id="ws-name" defaultValue="Nila Naturals" />
        </FormField>
        <FormField id="ws-public" label="Name customers see" hint="Shown in WhatsApp templates and the website chat. Leave empty to use the workspace name.">
          <Input id="ws-public" placeholder="Same as workspace name" />
        </FormField>
        <FormField id="ws-id" label="Workspace ID">
          <div className="flex gap-2">
            <Input id="ws-id" readOnly value="ws_7f3k9q2m" className="font-mono text-muted-foreground" />
            <Button variant="outline" size="default">
              <CopyIcon data-icon="inline-start" />
              Copy
            </Button>
          </div>
        </FormField>
        <FormField id="ws-tz" label="Time zone">
          <Input id="ws-tz" defaultValue="Asia/Kolkata (GMT+5:30)" />
        </FormField>
      </FormSection>

      <FormSection title="Marketing consent" description="Broadcasts only go to contacts who opted in. Turn this off only if you collect consent elsewhere.">
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={optIn} onCheckedChange={(v) => setOptIn(!!v)} />
          Ask for opt-in in the first WhatsApp reply
        </label>
        <p className="text-xs text-muted-foreground">Meta can block numbers that message people who did not opt in.</p>
      </FormSection>

      <FormSection title="Test workspace" description="Try workflows and templates on a copy of this workspace. Nothing is sent to real customers.">
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={testMode} onCheckedChange={(v) => setTestMode(!!v)} />
          Turn on test workspace
        </label>
      </FormSection>
    </FormStack>
  )
}

export function SettingsPage() {
  const [page, setPage] = React.useState("home")
  return (
    <Page
      title={page === "home" ? "Settings" : "General"}
      actions={page === "general" ? <Button size="sm">Save</Button> : undefined}
      bodyClassName="md:py-8"
      nav={
        <SubNav title="Settings">
          <div className="border-b p-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="settings-search" placeholder="Search settings" className="h-8 pl-8" />
            </div>
          </div>
          <SubNavGroup>
            <SubNavItem icon={HomeIcon} label="Home" active={page === "home"} onClick={() => setPage("home")} />
          </SubNavGroup>
          <SubNavGroup label="Workspace" collapsible>
            <SubNavItem label="General" indent active={page === "general"} onClick={() => setPage("general")} />
            <SubNavItem label="Members and roles" indent />
            <SubNavItem label="Office hours" indent />
            <SubNavItem label="Security" indent badge={<span className="size-1.5 rounded-full bg-warning-foreground" />} />
            <SubNavItem label="API keys" indent />
          </SubNavGroup>
          <SubNavGroup label="Channels" collapsible>
            <SubNavItem label="WhatsApp" indent />
            <SubNavItem label="Instagram" indent />
            <SubNavItem label="Website chat" indent />
            <SubNavItem label="Email" indent />
            <SubNavItem label="Voice" indent />
          </SubNavGroup>
          <SubNavGroup label="Inbox and AI" collapsible>
            <SubNavItem label="Labels" indent />
            <SubNavItem label="Saved replies" indent />
            <SubNavItem label="Assignment and SLA" indent />
            <SubNavItem label="AI agent" indent />
          </SubNavGroup>
          <SubNavGroup label="Billing" collapsible>
            <SubNavItem label="Wallet" indent />
            <SubNavItem label="Plan" indent />
            <SubNavItem label="Usage" indent />
          </SubNavGroup>
        </SubNav>
      }
    >
      {page === "home" ? <SettingsHome open={setPage} /> : <General />}
    </Page>
  )
}
