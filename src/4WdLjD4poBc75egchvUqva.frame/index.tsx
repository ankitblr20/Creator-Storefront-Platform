import React, { useState } from 'react'
import { ArrowLeft, Search, Sparkles, ShoppingBag, Instagram } from 'lucide-react'

import { TabBar, type Tab } from '../shared/agent/Chrome'
import { VISITS, productBy, shopBy, instagramUrl, formatINR } from '../shared/agent/data'

type Props = Partial<typeof args> & {
  onBack?: () => void
  onShop?: (handle: string) => void
  onAgent?: (ask?: string) => void
  onTab?: (t: Tab) => void
}

export default function History(props: Props) {
  const { remembering: initialRemember, onBack, onShop, onAgent, onTab } = { ...args, ...props }
  const [query, setQuery] = useState('')
  const [remember, setRemember] = useState(initialRemember)
  const q = query.trim().toLowerCase()
  const visits = VISITS.filter((v) => !q || v.handle.includes(q) || v.viewed.some((id) => productBy(id).title.toLowerCase().includes(q)))
  const days = ['Today', 'Yesterday', 'This week'] as const

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-card/95 px-3 backdrop-blur">
        <button aria-label="Back" onClick={onBack} className="grid size-10 place-items-center rounded-full hover:bg-paper"><ArrowLeft className="size-5" /></button>
        <h1 className="text-base font-semibold">History</h1>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-4">
        <p className="text-sm text-muted">Every shop you open — from a story, a reel, a bio link or by @username. Your agent uses this, so “that mug from this morning” just works.</p>

        <label className="mt-4 flex h-11 items-center gap-2 rounded-full bg-card px-4 ring-1 ring-line">
          <Search className="size-4 text-faint" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shops and things you saw" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
        </label>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-line">
          <p className="flex items-center gap-2 text-sm"><Sparkles className="size-4 shrink-0" /> Agent remembers my browsing</p>
          <button
            role="switch"
            aria-checked={remember}
            aria-label="Agent remembers my browsing"
            onClick={() => setRemember((r) => !r)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out ${remember ? 'bg-brand' : 'bg-line'}`}
          >
            <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform duration-150 ease-out ${remember ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {days.map((d) => {
          const list = visits.filter((v) => v.day === d)
          if (!list.length) return null
          return (
            <section key={d} className="mt-7">
              <h2 className="text-sm font-semibold text-muted">{d}</h2>
              <ul className="mt-2 space-y-3">
                {list.map((v) => {
                  const s = shopBy(v.handle)
                  return (
                    <li key={v.id} className="rounded-2xl bg-card p-3 ring-1 ring-line">
                      <div className="flex items-center gap-3">
                        <button onClick={() => onShop?.(v.handle)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <img src={s.avatar} alt="" className="size-10 shrink-0 rounded-xl object-cover" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">@{s.handle}</span>
                            <span className="block truncate text-xs text-muted">{v.via} · {v.when}</span>
                          </span>
                        </button>
                        <a href={instagramUrl(s.handle)} target="_blank" rel="noreferrer" aria-label={`@${s.handle} on Instagram`} className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-line hover:bg-paper"><Instagram className="size-4" /></a>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {v.viewed.map((id) => {
                          const p = productBy(id)
                          return (
                            <li key={id} className="flex items-center gap-3">
                              <img src={p.image} alt="" className="size-9 shrink-0 rounded-lg object-cover" />
                              <span className="min-w-0 flex-1 truncate text-sm">{p.title}</span>
                              <span className="shrink-0 text-sm tabular-nums text-muted">{p.price === 0 ? 'Free' : formatINR(p.price)}</span>
                              <button onClick={() => onAgent?.(`${p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'} the ${p.title}`)} className="h-8 shrink-0 whitespace-nowrap rounded-full bg-ink px-3 text-xs font-semibold text-white">
                                {p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      {v.inBag && <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-ink"><ShoppingBag className="size-3.5" /> Still in your bag: {v.inBag}</p>}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
        {!visits.length && <p className="mt-10 text-center text-sm text-muted">Nothing you’ve opened matches “{query}”.</p>}
      </main>

      <TabBar active="home" onTab={onTab} />
    </div>
  )
}

export const args = {
  remembering: true,
}

export const argTypes = {
  remembering: { control: 'boolean' },
}
