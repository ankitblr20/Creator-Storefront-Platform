import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Sparkles, X, Instagram, MessageCircle } from 'lucide-react'

import { AddressBar, TabBar, type Tab } from '../shared/agent/Chrome'
import { Chat } from '../shared/agent/Chat'
import { ORDERS, PRODUCTS, shopBy, instagramUrl, formatINR, type Order } from '../shared/agent/data'

type Props = Partial<typeof args> & {
  orders?: Order[]
  onBack?: () => void
  onTab?: (t: Tab) => void
  onTopUp?: (amount: number) => void
  onPaid?: (order: Order) => void
  onViewOrder?: (id?: string) => void
  onOpenShop?: (handle: string) => void
}

export default function Shop(props: Props) {
  const { handle, balance, agent: agentInitially, orders = ORDERS, onBack, onTab, onTopUp, onPaid, onViewOrder, onOpenShop } = { ...args, ...props }
  const shop = shopBy(handle)
  const items = PRODUCTS.filter((p) => p.shop === shop.handle)
  const [agent, setAgent] = useState<{ productId?: string; ask?: string } | null>(agentInitially === 'open' ? {} : null)

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <AddressBar handle={shop.handle} balance={balance} onBack={onBack} onWallet={() => onTab?.('wallet')} />

      <main className="mx-auto w-full max-w-3xl flex-1 pb-8">
        {/* The shop, in its own colour */}
        <section className="px-4 pb-5 pt-5" style={{ backgroundColor: shop.brand + '12' }}>
          <div className="flex items-center gap-3">
            <img src={shop.avatar} alt="" className="size-16 shrink-0 rounded-2xl object-cover ring-2 ring-white" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-semibold leading-tight" style={{ color: shop.brand }}>{shop.name}</h1>
              <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted">
                @{shop.handle} <BadgeCheck className="size-3.5 shrink-0" style={{ color: shop.brand }} /> · {shop.followers}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">{shop.category} · {shop.city} · <span className="font-mono text-xs">{shop.code}</span></p>
          <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
            <button onClick={() => setAgent({})} className="flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ink text-sm font-semibold text-white">
              <Sparkles className="size-4" /> Ask agent
            </button>
            <a href={instagramUrl(shop.handle)} target="_blank" rel="noreferrer" aria-label={`@${shop.handle} on Instagram`} className="grid size-11 place-items-center rounded-full bg-card ring-1 ring-line hover:bg-paper">
              <Instagram className="size-5" />
            </a>
            <a href={`https://ig.me/m/${shop.handle}`} target="_blank" rel="noreferrer" aria-label={`Message @${shop.handle}`} className="grid size-11 place-items-center rounded-full bg-card ring-1 ring-line hover:bg-paper">
              <MessageCircle className="size-5" />
            </a>
          </div>
        </section>

        <ul className="grid grid-cols-2 gap-3 px-4 pt-5 sm:grid-cols-3">
          {items.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line">
              <button onClick={() => setAgent({ productId: p.id })} className="text-left">
                <img src={p.image} alt="" className="aspect-square w-full object-cover" />
              </button>
              <div className="flex flex-1 flex-col p-3">
                <p className="text-xs text-muted">{p.kind === 'event' ? p.when : p.kind === 'call' ? p.length : p.kind === 'digital' ? 'Instant download' : p.dispatch}</p>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug">{p.title}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <p className="text-sm font-semibold tabular-nums">{p.price === 0 ? 'Free' : formatINR(p.price)}</p>
                  <button
                    onClick={() => setAgent({ productId: p.id, ask: `${p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'} the ${p.title}` })}
                    className="h-8 whitespace-nowrap rounded-full px-3 text-xs font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90"
                    style={{ backgroundColor: shop.brand }}
                  >
                    {p.kind === 'event' || p.kind === 'call' ? 'Book' : 'Buy'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <TabBar onTab={onTab} />

      {/* The agent, inside this shop */}
      <AnimatePresence>
        {agent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setAgent(null)} className="fixed inset-0 z-40 bg-ink/30" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              role="dialog"
              aria-label="Your agent"
              className="fixed inset-x-0 bottom-0 top-8 z-50 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-paper"
            >
              <div className="flex items-center gap-3 border-b border-line bg-card px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Your agent</p>
                  <p className="truncate text-xs text-muted">In @{shop.handle} · pays from your wallet</p>
                </div>
                <button aria-label="Close agent" onClick={() => setAgent(null)} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-paper"><X className="size-5" /></button>
              </div>
              <Chat
                key={(agent.productId ?? '') + (agent.ask ?? '')}
                shop={shop.handle}
                productId={agent.productId}
                firstAsk={agent.ask}
                balance={balance}
                orders={orders}
                onTopUp={onTopUp}
                onPaid={onPaid}
                onViewOrder={(id) => {
                  setAgent(null)
                  onViewOrder?.(id)
                }}
                onOpenShop={(h) => {
                  setAgent(null)
                  if (h !== shop.handle) onOpenShop?.(h)
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export const args = {
  handle: 'priya.crochet',
  balance: 4250,
  agent: 'closed',
}

export const argTypes = {
  handle: { control: 'select', options: ['priya.crochet', 'mitti.ceramics', 'kaafi.roasters', 'bandra.thrift', 'inkpot.studio'] },
  balance: { control: 'number' },
  agent: { control: 'radio', options: ['closed', 'open'] },
}
