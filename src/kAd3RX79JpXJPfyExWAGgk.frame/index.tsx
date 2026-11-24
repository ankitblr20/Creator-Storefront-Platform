import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUp, CalendarDays, MapPin, Users, Clock, Package, Check, Pencil, ExternalLink, Video, TrendingUp } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { ITEMS, ORDERS, STORE, MODULE_REVENUE, formatINR, type ItemType } from '../shared/storefront/data'

type Props = Partial<typeof args> & {
  onNavigate?: (key: NavKey) => void
  onNewItem?: () => void
  /** Opens the full Add item form with this kind, for edits the chat can't make */
  onEditDraft?: (type: ItemType) => void
}

export default function SellerAgent(props: Props) {
  const { conversation, published, onNavigate, onNewItem, onEditDraft } = { ...args, ...props }
  const [messages, setMessages] = useState<Message[]>(() => STARTERS[conversation as Conversation] ?? [])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const end = useRef<HTMLDivElement>(null)

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    end.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, thinking])

  const send = (text: string) => {
    if (!text.trim()) return
    setDraft('')
    setMessages((m) => [...m, { from: 'seller', text }])
    setThinking(true)
    setTimeout(() => {
      setThinking(false)
      setMessages((m) => [...m, reply(text)])
    }, 650)
  }
  const publish = (i: number) =>
    setMessages((m) => m.map((x, j) => (j === i && x.from === 'agent' ? { ...x, published: true } : x)))

  return (
    <Shell
      active="agent"
      title="Agent"
      subtitle="Tell it what to set up or ask about your business. It drafts, you publish."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Conversation */}
        <section className="flex min-h-[560px] min-w-0 flex-col rounded-xl bg-surface ring-1 ring-line">
          <div className="flex-1 space-y-5 px-4 py-5 sm:px-6">
            {messages.length === 0 && !thinking && (
              <div className="py-10 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-5" /></span>
                <p className="mt-4 font-display text-2xl font-semibold">What should we set up, Priya?</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted">I know your {ITEMS.length} items, {ORDERS.length} recent orders and every customer. Try one of these, or just say it your way.</p>
              </div>
            )}

            {messages.map((m, i) =>
              m.from === 'seller' ? (
                <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-canvas px-4 py-2.5 text-sm">{m.text}</p>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex max-w-full gap-3"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-3.5" /></span>
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    {m.card === 'business' && <BusinessCard />}
                    {m.card && m.card !== 'business' && (
                      <DraftCard
                        kind={m.card}
                        published={!!m.published}
                        onPublish={() => publish(i)}
                        onEdit={() => onEditDraft?.(m.card === 'meeting' ? 'call' : m.card === 'product' ? 'physical' : 'event')}
                      />
                    )}
                  </div>
                </motion.div>
              ),
            )}

            {thinking && (
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-3.5" /></span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="size-1.5 rounded-full bg-faint" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15, ease: 'linear' }} />
                  ))}
                </span>
              </div>
            )}
            <div ref={end} />
          </div>

          {/* Composer */}
          <div className="sticky bottom-0 border-t border-line bg-surface p-3 sm:p-4">
            <div className="mb-2 flex gap-2 overflow-x-auto [scrollbar-width:none] lg:hidden">
              {PROMPTS.map((p) => (
                <button key={p.text} onClick={() => send(p.text)} className="h-8 shrink-0 whitespace-nowrap rounded-full px-3 text-xs font-medium ring-1 ring-line hover:bg-canvas">{p.label}</button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="flex h-12 items-center gap-2 rounded-xl bg-canvas pl-4 pr-1.5 ring-1 ring-line focus-within:ring-ink/30"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. Add a Diwali coaster workshop on 25 Oct, 15 seats, ₹1,500"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
              />
              <button type="submit" aria-label="Send" className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink text-white transition-opacity duration-150 ease-out disabled:opacity-40" disabled={!draft.trim()}>
                <ArrowUp className="size-4" />
              </button>
            </form>
          </div>
        </section>

        {/* What it can do */}
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <h2 className="text-sm font-semibold">Ask it to</h2>
          <ul className="mt-3 space-y-1">
            {PROMPTS.map(({ label, text, icon: Icon }) => (
              <li key={label}>
                <button onClick={() => send(text)} className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-surface">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs leading-snug text-muted">“{text}”</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-line px-3 pt-4 text-xs leading-relaxed text-muted">
            Nothing goes live until you press Publish. Prices, refunds and payouts are never changed from chat.
          </p>
        </aside>
      </div>
    </Shell>
  )
}

/** What the agent drafted, shown the way it'll appear on the store */
function DraftCard({ kind, published, onPublish, onEdit }: { kind: 'event' | 'meeting' | 'product'; published: boolean; onPublish: () => void; onEdit: () => void }) {
  const d = DRAFTS[kind]
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-line">
      <div className="flex items-start gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent"><d.icon className="size-5" strokeWidth={1.75} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">{d.kind} · {published ? 'Live' : 'Draft'}</p>
          <p className="font-semibold">{d.title}</p>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {d.fields.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="truncate font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-canvas/60 px-4 py-3">
        {published ? (
          <>
            <span className="flex items-center gap-1.5 text-sm font-medium text-accent"><Check className="size-4" /> Live on your store</span>
            <a href="#" className="ml-auto flex items-center gap-1 text-sm text-muted hover:text-ink">{STORE.link}/{d.slug} <ExternalLink className="size-3.5" /></a>
          </>
        ) : (
          <>
            <button onClick={onPublish} className="h-9 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink">Publish</button>
            <button onClick={onEdit} className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium ring-1 ring-line hover:bg-surface"><Pencil className="size-3.5" /> Edit in form</button>
          </>
        )}
      </div>
    </div>
  )
}

/** The business, as of today, in one answer */
function BusinessCard() {
  const total = MODULE_REVENUE.reduce((s, m) => s + m.revenue, 0)
  const top = [...ITEMS].sort((a, b) => b.revenue - a.revenue).slice(0, 3)
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-line">
      <div className="flex flex-wrap items-end justify-between gap-2 p-4">
        <div>
          <p className="text-xs text-muted">Last 30 days</p>
          <p className="text-2xl font-semibold tabular-nums">{formatINR(total)}</p>
        </div>
        <p className="flex items-center gap-1 text-sm font-medium text-accent"><TrendingUp className="size-4" /> 18% on May</p>
      </div>
      <table className="w-full border-t border-line text-left text-sm">
        <thead className="text-xs text-muted"><tr><th className="px-4 py-2 font-medium">Best sellers</th><th className="px-4 py-2 text-right font-medium">Sold</th><th className="px-4 py-2 text-right font-medium">Revenue</th></tr></thead>
        <tbody className="divide-y divide-line">
          {top.map((i) => (
            <tr key={i.id}><td className="truncate px-4 py-2">{i.title}</td><td className="px-4 py-2 text-right tabular-nums">{i.sold}</td><td className="px-4 py-2 text-right tabular-nums">{formatINR(i.revenue)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type Conversation = 'empty' | 'create event' | 'business'
type Message = { from: 'seller'; text: string } | { from: 'agent'; text: string; card?: 'event' | 'meeting' | 'product' | 'business'; published?: boolean }

function reply(text: string): Message {
  const t = text.toLowerCase()
  if (/meet|call|1:1|session/.test(t)) return { from: 'agent', text: 'Here’s the meeting. I used your Tuesday and Friday hours and Google Meet, like your other calls.', card: 'meeting' }
  if (/event|workshop|class|meetup|retreat/.test(t)) return { from: 'agent', text: 'Drafted. I copied the venue and what’s included from your Saturday workshop — change anything before you publish.', card: 'event' }
  if (/product|kit|tote|plush|stock|sell|add/.test(t)) return { from: 'agent', text: 'Drafted it next to your other kits. Stock and colours come from what you said; I’ve set dispatch to 2–3 days like the beginner kit.', card: 'product' }
  return { from: 'agent', text: 'June is your best month yet. The beginner kit still earns the most, the Coorg retreat is the biggest single ticket, and 2 orders are waiting to be packed.', card: 'business' }
}

const PROMPTS = [
  { label: 'Create an event', text: 'Add a Diwali coaster workshop on 25 Oct at The Yarn Social, 15 seats, ₹1,500', icon: CalendarDays },
  { label: 'Add a 1:1 meeting', text: 'Create a 45-min yarn shopping video call for ₹800', icon: Video },
  { label: 'Put up a product', text: 'Add a festive coaster kit, ₹950, 20 in stock, red and gold', icon: Package },
  { label: 'Ask about the business', text: 'How is the business doing this month?', icon: TrendingUp },
]

const DRAFTS = {
  event: {
    kind: 'Event', icon: CalendarDays, slug: 'diwali-coaster-workshop',
    title: 'Diwali Coaster Workshop',
    fields: [['When', 'Sat, 25 Oct · 4–7 pm'], ['Where', 'The Yarn Social, Bandra'], ['Seats', '15 · ₹1,500 each'], ['Early bird', '₹1,250 till 15 Oct']],
  },
  meeting: {
    kind: '1:1 meeting', icon: Video, slug: 'yarn-shopping-call',
    title: 'Yarn shopping video call',
    fields: [['Length', '45 min · Google Meet'], ['Price', '₹800'], ['Slots', 'Tue & Fri evenings'], ['Book at least', '12 h ahead']],
  },
  product: {
    kind: 'Physical product', icon: Package, slug: 'festive-coaster-kit',
    title: 'Festive coaster kit',
    fields: [['Price', '₹950'], ['Stock', '20'], ['Colours', 'Red, Gold'], ['Dispatch', '2–3 days · SKU PC-KIT-03']],
  },
} as const

const STARTERS: Record<Conversation, Message[]> = {
  empty: [],
  'create event': [
    { from: 'seller', text: 'Add a Diwali coaster workshop on 25 Oct at The Yarn Social, 15 seats, ₹1,500' },
    { from: 'agent', text: 'Drafted. I copied the venue and what’s included from your Saturday workshop — change anything before you publish.', card: 'event' },
  ],
  business: [
    { from: 'seller', text: 'How is the business doing this month?' },
    { from: 'agent', text: 'June is your best month yet. The beginner kit still earns the most, the Coorg retreat is the biggest single ticket, and 2 orders are waiting to be packed.', card: 'business' },
  ],
}

export const args = {
  conversation: 'empty',
  published: true,
}

export const argTypes = {
  conversation: { control: 'radio', options: ['empty', 'create event', 'business'] },
  published: { control: 'boolean' },
}
