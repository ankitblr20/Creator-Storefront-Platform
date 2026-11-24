import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Home, Receipt, CalendarDays, Package, Users, Megaphone, Wallet, ExternalLink, Plus, Menu, X, Copy, Check, Search, Bell,
  Ticket, Video, FileDown, BarChart3, Settings, LogOut, CreditCard, ChevronDown, Gift, Sparkles,
} from 'lucide-react'

import { STORE } from '../storefront/data'

export type NavKey =
  | 'agent'
  | 'overview' | 'orders' | 'customers'
  | 'events' | 'meetings' | 'digital' | 'physical'
  | 'analytics' | 'promote' | 'referrals'
  | 'payments' | 'settings'
  /** Not a page: signs the seller out and returns to the landing page */
  | 'logout'

const GROUPS: { label?: string; items: { key: NavKey; label: string; icon: typeof Home; badge?: string }[] }[] = [
  {
    items: [
      { key: 'agent', label: 'Agent', icon: Sparkles },
      { key: 'overview', label: 'Overview', icon: Home },
      { key: 'orders', label: 'Orders', icon: Receipt, badge: '2' },
      { key: 'customers', label: 'Customers', icon: Users },
    ],
  },
  {
    label: 'Sell',
    items: [
      { key: 'events', label: 'Events', icon: Ticket },
      { key: 'meetings', label: 'Meetings', icon: Video },
      { key: 'digital', label: 'Digital products', icon: FileDown },
      { key: 'physical', label: 'Physical products', icon: Package },
    ],
  },
  {
    label: 'Grow',
    items: [
      { key: 'analytics', label: 'Analytics', icon: BarChart3 },
      { key: 'promote', label: 'Promote', icon: Megaphone },
      { key: 'referrals', label: 'Refer & earn', icon: Gift, badge: '2 mo' },
    ],
  },
  {
    label: 'Business',
    items: [
      { key: 'payments', label: 'Payments', icon: Wallet },
      { key: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function Shell({
  active,
  title,
  subtitle,
  actions,
  published,
  onNavigate,
  onNewItem,
  children,
}: {
  active: NavKey
  title: string
  subtitle?: string
  actions?: React.ReactNode
  published: boolean
  onNavigate?: (key: NavKey) => void
  onNewItem?: () => void
  children: React.ReactNode
}) {
  const [drawer, setDrawer] = useState(false)
  const [copied, setCopied] = useState(false)
  const [account, setAccount] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 px-3 py-4">
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.label && <p className="mb-1 px-3 text-xs font-medium text-faint">{g.label}</p>}
          <ul className="space-y-0.5">
            {g.items.map(({ key, label, icon: Icon, badge }) => (
              <li key={key}>
                <button
                  onClick={() => {
                    setDrawer(false)
                    onNavigate?.(key)
                  }}
                  className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150 ease-out ${
                    active === key ? 'bg-accent-soft font-semibold text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white">{badge}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )

  const storeCard = (
    <div className="m-3 rounded-xl bg-canvas p-3">
      <div className="flex items-center gap-2.5">
        <img src={STORE.avatar} alt="" className="size-8 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{STORE.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`size-1.5 rounded-full ${published ? 'bg-accent' : 'bg-warn'}`} />
            {published ? 'Live' : 'Not live yet'}
          </p>
        </div>
      </div>
      <a href="#" className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-surface text-xs font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-line/40">
        <ExternalLink className="size-3.5" /> {published ? 'View store' : 'Preview store'}
      </a>
      <button
        onClick={() => onNavigate?.('settings')}
        className="mt-2 w-full text-left text-xs text-muted transition-colors duration-150 ease-out hover:text-ink"
      >
        Free trial · 12 days left · <span className="font-medium text-accent">Choose plan</span>
      </button>
      <button
        onClick={() => { setDrawer(false); setConfirmLogout(true) }}
        className="mt-3 flex h-8 w-full items-center gap-2 rounded-lg px-2 text-xs font-medium text-muted transition-colors duration-150 ease-out hover:bg-surface hover:text-ink"
      >
        <LogOut className="size-3.5" /> Log out
      </button>
    </div>
  )

  return (
    <div className="flex min-h-full bg-canvas">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">R</span>
          <span className="text-sm font-semibold tracking-tight">Riftori</span>
        </div>
        {nav}
        {storeCard}
      </aside>

      {/* Drawer — phone and tablet */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-ink/30 lg:hidden" />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto bg-surface lg:hidden"
            >
              <div className="flex h-14 items-center justify-between px-5">
                <span className="text-sm font-semibold">Riftori</span>
                <button aria-label="Close menu" onClick={() => setDrawer(false)} className="grid size-9 place-items-center rounded-lg hover:bg-canvas"><X className="size-5" /></button>
              </div>
              {nav}
              {storeCard}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-surface/95 px-3 backdrop-blur sm:px-6 lg:h-16">
          <button aria-label="Open menu" onClick={() => setDrawer(true)} className="grid size-9 place-items-center rounded-lg hover:bg-canvas lg:hidden">
            <Menu className="size-5" />
          </button>
          <div className="hidden h-9 max-w-xs flex-1 items-center gap-2 rounded-lg bg-canvas px-3 text-sm text-faint md:flex">
            <Search className="size-4" /> Search orders, products, customers
          </div>
          <div className="ml-auto flex items-center gap-2">
            {published && (
              <button
                onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }}
                className="hidden h-9 items-center gap-2 rounded-lg px-3 text-sm ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas sm:flex"
              >
                {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4 text-muted" />}
                <span className="font-medium">{copied ? 'Link copied' : STORE.link}</span>
              </button>
            )}
            {active !== 'agent' && (
              <button
                onClick={() => onNavigate?.('agent')}
                className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas"
              >
                <Sparkles className="size-4" /> <span className="hidden md:inline">Ask agent</span>
              </button>
            )}
            <button aria-label="Notifications" className="relative grid size-9 place-items-center rounded-lg text-muted transition-colors duration-150 ease-out hover:bg-canvas">
              <Bell className="size-[18px]" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
            </button>
            <button
              onClick={onNewItem}
              className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent px-3.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink"
            >
              <Plus className="size-4" /> New item
            </button>

            {/* Account menu */}
            <div className="relative">
              <button
                aria-label="Account"
                aria-expanded={account}
                onClick={() => setAccount((a) => !a)}
                className="flex h-9 items-center gap-1 rounded-full pl-0.5 pr-1.5 transition-colors duration-150 ease-out hover:bg-canvas"
              >
                <img src={STORE.avatar} alt="" className="size-8 rounded-full object-cover" />
                <ChevronDown className="hidden size-3.5 text-muted sm:block" />
              </button>
              <AnimatePresence>
                {account && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccount(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 top-11 z-50 w-60 origin-top-right rounded-xl bg-surface p-1.5 shadow-lg ring-1 ring-line"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold">{STORE.name}</p>
                        <p className="truncate text-xs text-muted">{STORE.email}</p>
                      </div>
                      <div className="my-1 border-t border-line" />
                      <MenuItem icon={Settings} label="Account settings" onClick={() => { setAccount(false); onNavigate?.('settings') }} />
                      <MenuItem icon={CreditCard} label="Plan & billing" onClick={() => { setAccount(false); onNavigate?.('settings') }} />
                      <MenuItem icon={ExternalLink} label="View my store" />
                      <div className="my-1 border-t border-line" />
                      <MenuItem icon={LogOut} label="Log out" onClick={() => { setAccount(false); setConfirmLogout(true) }} />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Log out confirmation */}
        <AnimatePresence>
          {confirmLogout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[60] grid place-items-center bg-ink/30 p-4"
              onClick={() => setConfirmLogout(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
              >
                <h2 className="text-lg font-semibold">Log out of Riftori?</h2>
                <p className="mt-1 text-sm text-muted">Your store stays live at {STORE.link} and keeps taking orders while you’re away.</p>
                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setConfirmLogout(false)} className="h-10 rounded-lg px-4 text-sm font-medium ring-1 ring-line hover:bg-canvas">Cancel</button>
                  <button
                    onClick={() => { setConfirmLogout(false); onNavigate?.('logout') }}
                    className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white"
                  >
                    Log out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

function MenuItem({ icon: Icon, label, onClick }: { icon: typeof Home; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors duration-150 ease-out hover:bg-canvas">
      <Icon className="size-4 text-muted" strokeWidth={1.75} />
      {label}
    </button>
  )
}

/** Segmented filter used across seller pages */
export function Tabs<T extends string>({ value, options, onChange }: { value: T; options: { key: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`-mb-px flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-sm transition-colors duration-150 ease-out ${
            value === o.key ? 'border-ink font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className="text-xs text-faint">{o.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'New' || status === 'Packed' ? 'bg-warn-soft text-warn'
    : status === 'Upcoming' || status === 'On store' || status === 'Dispatched' || status === 'Captured' || status === 'Live' ? 'bg-accent-soft text-accent-ink'
    : 'bg-canvas text-muted'
  return <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-medium ${tone}`}>{status}</span>
}
