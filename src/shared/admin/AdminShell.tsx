import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Store, Users, CreditCard, Repeat, LifeBuoy, ShieldAlert, Search, LogOut, ChevronDown, Bell, CalendarRange,
} from 'lucide-react'

export type AdminNav = 'overview' | 'sellers' | 'buyers' | 'transactions' | 'subscriptions' | 'support' | 'risk'

const NAV: { key: AdminNav; label: string; icon: typeof Store; badge?: string; tone?: 'danger' | 'neutral' }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'sellers', label: 'Sellers', icon: Store },
  { key: 'buyers', label: 'Buyers & orders', icon: Users },
  { key: 'transactions', label: 'Transactions', icon: CreditCard },
  { key: 'subscriptions', label: 'Subscriptions', icon: Repeat },
  { key: 'support', label: 'Support', icon: LifeBuoy, badge: '14', tone: 'neutral' },
  { key: 'risk', label: 'Risk & moderation', icon: ShieldAlert, badge: '3', tone: 'danger' },
]

export function AdminShell({
  active,
  title,
  subtitle,
  actions,
  onNavigate,
  children,
}: {
  active: AdminNav
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onNavigate?: (key: AdminNav) => void
  children: React.ReactNode
}) {
  const [menu, setMenu] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Rail */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col bg-rail text-white lg:flex">
        <div className="flex h-14 items-center gap-2 border-b border-rail-line px-4">
          <span className="grid size-7 place-items-center rounded-md bg-white text-xs font-bold text-ink">R</span>
          <span className="text-sm font-semibold">Riftori Admin</span>
          <span className="ml-auto rounded bg-danger px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Live</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map(({ key, label, icon: Icon, badge, tone }) => (
            <button
              key={key}
              onClick={() => onNavigate?.(key)}
              className={`flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-[13px] transition-colors duration-150 ease-out ${
                active === key ? 'bg-white/10 font-semibold text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className={`rounded px-1.5 text-[11px] font-semibold ${tone === 'danger' ? 'bg-danger text-white' : 'bg-white/15 text-white'}`}>{badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="border-t border-rail-line p-3 text-[11px] leading-relaxed text-white/40">
          Every action is logged with your name.<br />Riftori Technologies Pvt Ltd
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-line bg-surface">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <span className="grid size-7 place-items-center rounded-md bg-ink text-xs font-bold text-white lg:hidden">R</span>
            <label className="flex h-9 min-w-0 max-w-xl flex-1 items-center gap-2 rounded-md bg-canvas px-3 ring-1 ring-transparent focus-within:bg-surface focus-within:ring-accent">
              <Search className="size-4 shrink-0 text-faint" />
              <input
                placeholder="Search seller, buyer email or phone, order SF-…, payment pay_…"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-faint"
              />
              <kbd className="hidden rounded border border-line px-1.5 font-mono text-[10px] text-faint sm:block">/</kbd>
            </label>
            <button className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-[13px] text-muted ring-1 ring-line hover:bg-canvas md:flex">
              <CalendarRange className="size-4" /> Last 30 days
            </button>
            <button aria-label="Alerts" className="relative grid size-9 place-items-center rounded-md text-muted hover:bg-canvas">
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
            </button>
            <div className="relative">
              <button onClick={() => setMenu((m) => !m)} className="flex h-9 items-center gap-2 rounded-md pl-1 pr-2 hover:bg-canvas">
                <span className="grid size-7 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">AK</span>
                <span className="hidden text-[13px] font-medium sm:block">Arjun</span>
                <ChevronDown className="size-3.5 text-muted" />
              </button>
              <AnimatePresence>
                {menu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 top-11 z-50 w-56 rounded-lg bg-surface p-1.5 shadow-lg ring-1 ring-line"
                    >
                      <div className="px-3 py-2">
                        <p className="text-[13px] font-semibold">Arjun Kumar</p>
                        <p className="text-xs text-muted">Ops lead · Full access</p>
                      </div>
                      <div className="my-1 border-t border-line" />
                      <button className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-[13px] hover:bg-canvas">
                        <LogOut className="size-4 text-muted" /> Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Section tabs on small screens */}
          <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 [scrollbar-width:none] lg:hidden">
            {NAV.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onNavigate?.(key)}
                className={`h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-[13px] ${active === key ? 'bg-ink font-semibold text-white' : 'text-muted'}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        <main className="w-full flex-1 px-4 py-6 sm:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

/** Shared admin building blocks */
export function Panel({ title, action, children, className = '' }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-lg bg-surface ring-1 ring-line ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="text-[13px] font-semibold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'ok' | 'warn' | 'danger' | 'info' | 'neutral' }) {
  const cls = {
    ok: 'bg-accent-soft text-accent-ink',
    warn: 'bg-warn-soft text-warn',
    danger: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
    neutral: 'bg-canvas text-muted',
  }[tone]
  return <span className={`inline-flex h-5 items-center whitespace-nowrap rounded px-1.5 text-[11px] font-semibold ${cls}`}>{children}</span>
}

export function Delta({ value, invert }: { value: number; invert?: boolean }) {
  const good = invert ? value < 0 : value > 0
  if (value === 0) return <span className="text-xs text-faint">—</span>
  return (
    <span className={`text-xs font-semibold tabular-nums ${good ? 'text-accent' : 'text-danger'}`}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  )
}

export function Button({ children, onClick, primary, danger }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-colors duration-150 ease-out ${
        primary ? 'bg-ink text-white hover:bg-ink/85' : danger ? 'bg-danger-soft text-danger hover:bg-danger/15' : 'bg-surface ring-1 ring-line hover:bg-canvas'
      }`}
    >
      {children}
    </button>
  )
}

/** Seller health 0–100: activity, refunds, disputes, payment setup */
export function HealthBadge({ value }: { value: number }) {
  const tone = value >= 80 ? 'text-accent' : value >= 55 ? 'text-warn' : 'text-danger'
  return <span className={`text-[13px] font-semibold tabular-nums ${tone}`}>{value}</span>
}

/** Simple bar sparkline */
export function Bars({ values, height = 120, highlightLast = true }: { values: number[]; height?: number; highlightLast?: boolean }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          title={String(v)}
          className={`flex-1 rounded-t-sm ${highlightLast && i === values.length - 1 ? 'bg-accent' : 'bg-accent/30 hover:bg-accent/60'}`}
          style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

export function statusTone(s: string): 'ok' | 'warn' | 'danger' | 'info' | 'neutral' {
  if (['Active', 'Captured', 'Paid', 'Fulfilled', 'Delivered', 'Connected', 'Resolved', 'OK', 'Actioned', 'Settled'].includes(s)) return 'ok'
  if (['Trial', 'Pending', 'Packed', 'Dispatched', 'KYC pending', 'Waiting on user', 'Due soon', 'In review', 'Under review', 'High', 'Medium'].includes(s)) return s === 'Trial' || s === 'Dispatched' || s === 'Packed' ? 'info' : 'warn'
  if (['Past due', 'Suspended', 'Failed', 'Disputed', 'Breached', 'Urgent', 'Critical', 'Not connected', 'New'].includes(s)) return 'danger'
  return 'neutral'
}
