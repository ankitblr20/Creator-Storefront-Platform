import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Globe, ExternalLink, Instagram, Store, Sparkles, ChevronRight } from 'lucide-react'

import { Checkout } from './Checkout'
import { respond, suggestionsFor, type Turn } from './engine'
import { productBy, shopBy, instagramUrl, statusTone, formatINR, type Order } from './data'

/**
 * The agent conversation. Same component in the Buyer Agent app and inside every
 * storefront: it knows the shop and product it was opened from, and can buy, book,
 * search the web, open shops and track orders.
 */
export function Chat({
  shop,
  productId,
  firstAsk,
  balance,
  orders,
  onTopUp,
  onPaid,
  onViewOrder,
  onOpenShop,
}: {
  shop?: string
  productId?: string
  /** Sent as soon as the chat opens, e.g. from a "Buy with agent" button */
  firstAsk?: string
  balance: number
  orders: Order[]
  onTopUp?: (amount: number) => void
  onPaid?: (order: Order) => void
  onViewOrder?: (id?: string) => void
  onOpenShop?: (handle: string) => void
}) {
  const [turns, setTurns] = useState<Turn[]>([])
  const [text, setText] = useState('')
  const [thinking, setThinking] = useState(false)
  const [orderNo, setOrderNo] = useState(2489)
  const end = useRef<HTMLDivElement>(null)
  const ctx = { shop, productId, orders }

  const ask = (q: string) => {
    if (!q.trim() || thinking) return
    setText('')
    setTurns((t) => [...t, { from: 'you', text: q }])
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setTurns((t) => [...t, respond(q, ctx)])
    }, 600)
  }
  const startCheckout = (id: string) => {
    const p = productBy(id)
    setTurns((t) => [...t, { from: 'you', text: `${p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'} ${p.title}` }, respond(`buy ${p.title}`, { ...ctx, productId: id })])
  }

  const asked = useRef(false)
  useEffect(() => {
    if (firstAsk && !asked.current) {
      asked.current = true
      ask(firstAsk)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (turns.length) end.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [turns.length, thinking])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {turns.length === 0 && !thinking && <Empty shop={shop} productId={productId} onAsk={ask} />}

        <div className="space-y-4">
          {turns.map((t, i) =>
            t.from === 'you' ? (
              <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">{t.text}</p>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="space-y-3">
                <p className="text-[15px] leading-relaxed">{t.text}</p>

                {t.card?.type === 'checkout' && (
                  <Checkout
                    productId={t.card.productId}
                    topic={t.card.topic}
                    balance={balance}
                    orderNo={orderNo}
                    onTopUp={onTopUp}
                    onPaid={(o) => {
                      setOrderNo((n) => n + 1)
                      onPaid?.(o)
                    }}
                    onViewOrder={onViewOrder}
                    onOpenShop={onOpenShop}
                  />
                )}

                {t.card?.type === 'picks' && (
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {t.card.productIds.map((id) => {
                      const p = productBy(id)
                      return (
                        <li key={id}>
                          <button onClick={() => startCheckout(id)} className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-card text-left ring-1 ring-line transition-shadow duration-150 ease-out hover:shadow-md">
                            <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover" />
                            <span className="flex flex-1 flex-col p-2.5">
                              <span className="text-[11px] text-muted">@{p.shop}</span>
                              <span className="line-clamp-2 text-sm font-medium leading-snug">{p.title}</span>
                              <span className="mt-auto flex items-center justify-between pt-2">
                                <span className="text-sm font-semibold tabular-nums">{p.price === 0 ? 'Free' : formatINR(p.price)}</span>
                                <span className="text-xs font-semibold text-brand">{p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'}</span>
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {t.card?.type === 'web' && (
                  <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                    <p className="flex items-center gap-1.5 border-b border-line px-3 py-2 text-xs text-muted"><Globe className="size-3.5" /> Searched the web · {t.card.results.length} sources</p>
                    <ul className="divide-y divide-line">
                      {t.card.results.map((w) => (
                        <li key={w.source}>
                          <a href={`https://${w.source}`} target="_blank" rel="noreferrer" className="block px-3 py-2.5 transition-colors duration-150 ease-out hover:bg-paper">
                            <span className="flex items-center gap-1 text-xs text-muted">{w.source} <ExternalLink className="size-3" /></span>
                            <span className="mt-0.5 block text-sm">{w.finding}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.card?.type === 'shop' && <ShopCard handle={t.card.handle} onOpenShop={onOpenShop} />}

                {t.card?.type === 'orders' && (
                  <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                    {t.card.ids.map((id) => {
                      const o = orders.find((x) => x.id === id)
                      if (!o) return null
                      return (
                        <li key={id}>
                          <button onClick={() => onViewOrder?.(id)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-paper">
                            <img src={o.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{o.title}</span>
                              <span className="block truncate text-xs text-muted">{o.tracking ?? o.slot ?? o.when ?? `@${o.shop}`}</span>
                            </span>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(o.status)}`}>{o.status}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </motion.div>
            ),
          )}

          {thinking && (
            <span className="flex gap-1 py-1" aria-label="Agent is typing">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="size-1.5 rounded-full bg-faint" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15, ease: 'linear' }} />
              ))}
            </span>
          )}
          <div ref={end} />
        </div>
      </div>

      {/* Suggestions stay one tap away after the first answer */}
      {turns.length > 0 && !thinking && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {suggestionsFor({ shop, productId }).map((s) => (
            <button key={s} onClick={() => ask(s)} className="h-8 shrink-0 whitespace-nowrap rounded-full bg-card px-3 text-xs font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-paper">{s}</button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(text)
        }}
        className="border-t border-line bg-card px-3 pb-3 pt-3"
      >
        <div className="flex h-12 items-center gap-2 rounded-full bg-paper pl-4 pr-1.5 ring-1 ring-line focus-within:ring-ink/30">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={shop ? `Ask about @${shop}, or say “buy it”` : 'Ask, search, or say what to buy'}
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
          />
          <button type="submit" aria-label="Send" disabled={!text.trim()} className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-opacity duration-150 ease-out disabled:opacity-30">
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

function Empty({ shop, productId, onAsk }: { shop?: string; productId?: string; onAsk: (q: string) => void }) {
  const title = productId ? `Ask about the ${productBy(productId).title.toLowerCase()}` : shop ? `Ask anything about ${shopBy(shop).name}` : 'What can I get you?'
  return (
    <div className="pb-4 pt-2">
      <span className="grid size-10 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-5" /></span>
      <h2 className="mt-4 font-display text-[26px] font-semibold leading-tight tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm text-muted">I buy and book at any Riftori shop with your wallet, fill in your saved details, check prices on the web, and keep every order in one place.</p>
      <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
        {suggestionsFor({ shop, productId }).map((s) => (
          <li key={s}>
            <button onClick={() => onAsk(s)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors duration-150 ease-out hover:bg-paper">
              {s} <ChevronRight className="size-4 shrink-0 text-faint" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** A shop, with both ways in: its Riftori shop, and its Instagram */
export function ShopCard({ handle, onOpenShop }: { handle: string; onOpenShop?: (handle: string) => void }) {
  const s = shopBy(handle)
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-line">
      <img src={s.avatar} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{s.name}</p>
        <p className="truncate text-xs text-muted">@{s.handle} · {s.category}</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button aria-label={`Open ${s.name} shop`} onClick={() => onOpenShop?.(handle)} className="grid size-9 place-items-center rounded-full bg-ink text-white"><Store className="size-4" /></button>
        <a aria-label={`Open @${s.handle} on Instagram`} href={instagramUrl(handle)} target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-full ring-1 ring-line hover:bg-paper"><Instagram className="size-4" /></a>
      </div>
    </div>
  )
}
