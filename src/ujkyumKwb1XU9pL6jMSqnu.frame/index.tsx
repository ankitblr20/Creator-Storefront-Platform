import React from 'react'
import { Sparkles, ChevronRight, Instagram, Ticket, Truck, Video, Download, Search } from 'lucide-react'

import { TabBar, WalletChip, type Tab } from '../shared/agent/Chrome'
import { suggestionsFor } from '../shared/agent/engine'
import { ORDERS, SHOPS, VISITS, PROFILE, productBy, shopBy, instagramUrl, statusTone, type Order } from '../shared/agent/data'

type Props = Partial<typeof args> & {
  orders?: Order[]
  onAgent?: (ask?: string) => void
  onShop?: (handle: string) => void
  onOrder?: (id: string) => void
  onHistory?: () => void
  onTab?: (t: Tab) => void
}

export default function Browser(props: Props) {
  const { balance, orders = ORDERS, onAgent, onShop, onOrder, onHistory, onTab } = { ...args, ...props }
  const active = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Completed')

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 pb-2 pt-5">
          <div className="min-w-0">
            <p className="text-sm text-muted">Good evening</p>
            <p className="truncate text-lg font-semibold">{PROFILE.name.split(' ')[0]}</p>
          </div>
          <WalletChip balance={balance} onClick={() => onTab?.('wallet')} />
        </header>

        {/* The one thing this app is for: ask the agent */}
        <section className="mt-4">
          <button
            onClick={() => onAgent?.()}
            className="flex h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 text-left shadow-sm ring-1 ring-line transition-shadow duration-150 ease-out hover:shadow-md"
          >
            <Sparkles className="size-5 shrink-0 text-ink" />
            <span className="min-w-0 flex-1 truncate text-[15px] text-faint">Ask your agent, or type a @shop</span>
            <Search className="size-4 shrink-0 text-faint" />
          </button>
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
            {suggestionsFor({}).map((s) => (
              <button key={s} onClick={() => onAgent?.(s)} className="h-9 shrink-0 whitespace-nowrap rounded-full bg-card px-3.5 text-sm ring-1 ring-line transition-colors duration-150 ease-out hover:bg-line/40">
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Coming up */}
        {active.length > 0 && (
          <section className="mt-8">
            <SectionHead title="Coming up" action="All orders" onAction={() => onTab?.('orders')} />
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
              {active.slice(0, 3).map((o) => {
                const Icon = o.kind === 'event' ? Ticket : o.kind === 'call' ? Video : o.kind === 'digital' ? Download : Truck
                return (
                  <li key={o.id}>
                    <button onClick={() => onOrder?.(o.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-paper">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ink"><Icon className="size-5" strokeWidth={1.75} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{o.title}</span>
                        <span className="block truncate text-xs text-muted">{o.when ?? o.slot ?? o.tracking ?? `@${o.shop}`}</span>
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(o.status)}`}>{o.status}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Shops */}
        <section className="mt-8">
          <SectionHead title="Your shops" />
          <p className="mt-0.5 text-xs text-muted">Shops you follow on Instagram that sell on Riftori.</p>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
            {SHOPS.map((s) => (
              <li key={s.handle} className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => onShop?.(s.handle)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <img src={s.avatar} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{s.name}</span>
                    <span className="block truncate text-xs text-muted">@{s.handle} · {s.category}</span>
                  </span>
                </button>
                <a
                  href={instagramUrl(s.handle)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`@${s.handle} on Instagram`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted ring-1 ring-line transition-colors duration-150 ease-out hover:bg-paper hover:text-ink"
                >
                  <Instagram className="size-4" />
                </a>
                <button onClick={() => onShop?.(s.handle)} className="h-9 shrink-0 whitespace-nowrap rounded-full bg-ink px-3.5 text-xs font-semibold text-white">Open</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Recently opened */}
        <section className="mt-8">
          <SectionHead title="Recently opened" action="History" onAction={onHistory} />
          <ul className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {VISITS.slice(0, 5).map((v) => {
              const p = productBy(v.viewed[0])
              return (
                <li key={v.id} className="w-36 shrink-0">
                  <button onClick={() => onShop?.(v.handle)} className="w-full text-left">
                    <img src={p.image} alt="" className="aspect-square w-full rounded-2xl object-cover" />
                    <p className="mt-2 truncate text-sm font-medium">{p.title}</p>
                    <p className="truncate text-xs text-muted">@{shopBy(v.handle).handle} · {v.when}</p>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <TabBar active="home" badge={active.length} onTab={onTab} />
    </div>
  )
}

function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-base font-semibold">{title}</h2>
      {action && (
        <button onClick={onAction} className="flex items-center text-sm font-medium text-brand">{action}<ChevronRight className="size-4" /></button>
      )}
    </div>
  )
}

export const args = {
  balance: 4250,
}

export const argTypes = {
  balance: { control: 'number' },
}
