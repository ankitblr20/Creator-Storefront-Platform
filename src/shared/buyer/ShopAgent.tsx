import React, { createContext, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Sparkles, X, ShieldCheck, ArrowLeft, Loader2, Check, Plus, LogOut, ChevronDown, ArrowDownLeft, RotateCcw, User, Instagram, Package,
} from 'lucide-react'

import { Chat } from '../agent/Chat'
import { ORDERS, PROFILE, TXNS, WALLET, formatINR, instagramUrl, statusTone, type Order, type Txn } from '../agent/data'
import { STORE, findItem } from '../storefront/data'

export type AgentResult = { itemId: string; total: number; qty: number; option?: string; ticket?: string; slot?: string; email: string; orderId: string }

/* ───────────────────────── State shared by every screen of the store ───────────────────────── */

type AgentState = {
  open: boolean
  setOpen: (v: boolean) => void
  signedIn: boolean
  phone: string
  signIn: (phone: string) => void
  signOut: () => void
  balance: number
  addMoney: (amount: number) => void
  orders: Order[]
  txns: Txn[]
  recordOrder: (o: Order) => void
  viewOrder?: (r: AgentResult) => void
}

const Ctx = createContext<AgentState | null>(null)

function useAgentState(signedIn = false, startOpen = false, viewOrder?: (r: AgentResult) => void): AgentState {
  const [open, setOpen] = useState(startOpen)
  const [isIn, setIn] = useState(signedIn)
  const [phone, setPhone] = useState(PROFILE.phone)
  const [balance, setBalance] = useState(WALLET.balance)
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [txns, setTxns] = useState<Txn[]>(TXNS)
  return {
    open,
    setOpen,
    signedIn: isIn,
    phone,
    signIn: (p) => {
      setPhone(p)
      setIn(true)
    },
    signOut: () => setIn(false),
    balance,
    addMoney: (a) => {
      setBalance((b) => b + a)
      setTxns((t) => [{ id: `top-${t.length}`, title: 'Added from UPI', sub: 'ananya.rao@okicici', amount: a, by: 'topup', when: 'Just now' }, ...t])
    },
    orders,
    txns,
    recordOrder: (o) => {
      setOrders((list) => [o, ...list])
      setBalance((b) => b - o.amount)
      if (o.amount > 0) setTxns((t) => [{ id: o.id, title: `@${o.shop}`, sub: o.title, amount: -o.amount, by: 'agent', when: 'Just now' }, ...t])
    },
    viewOrder,
  }
}

/** Wrap the store once so sign-in, wallet and orders carry across every screen */
export function AgentProvider({ signedIn, onViewOrder, children }: { signedIn?: boolean; onViewOrder?: (r: AgentResult) => void; children: React.ReactNode }) {
  const state = useAgentState(signedIn, false, onViewOrder)
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}

/** For a screen opened on its own: provides agent state unless the store already does */
export function AgentScope({ signedIn, startOpen, children }: { signedIn?: boolean; startOpen?: boolean; children: React.ReactNode }) {
  const outer = useContext(Ctx)
  const local = useAgentState(signedIn, startOpen)
  return outer ? <>{children}</> : <Ctx.Provider value={local}>{children}</Ctx.Provider>
}

export function useAgent(): AgentState {
  const outer = useContext(Ctx)
  const local = useAgentState()
  return outer ?? local
}

/* ───────────────────────── Top-bar button ───────────────────────── */

/** Lives in the sticky top bar beside search, so it never covers the page */
export function AgentButton() {
  const a = useAgent()
  return (
    <button
      onClick={() => a.setOpen(true)}
      aria-label={a.signedIn ? 'Open your agent' : 'Sign in to your agent'}
      className="relative flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-3 text-[13px] font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]"
    >
      <Sparkles className="size-3.5" />
      Agent
      {a.signedIn && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-ok ring-2 ring-paper" />}
    </button>
  )
}

/* ───────────────────────── The sheet ───────────────────────── */

type Pane = 'agent' | 'wallet' | 'orders'

export function AgentSheet({ itemId }: { itemId?: string }) {
  const a = useAgent()
  const [pane, setPane] = useState<Pane>('agent')
  const [focusOrder, setFocusOrder] = useState<string | null>(null)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!a.open) setMenu(false)
  }, [a.open])

  return (
    <AnimatePresence>
      {a.open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => a.setOpen(false)} className="fixed inset-0 z-40 bg-ink/30" />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Your agent"
            className="fixed inset-x-0 bottom-0 top-8 z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-line bg-card">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Your agent</p>
                  <p className="truncate text-xs text-muted">In @{STORE.handle}{itemId ? ` · ${findItem(itemId).title}` : ''}</p>
                </div>
                {a.signedIn && (
                  <div className="relative">
                    <button onClick={() => setMenu((m) => !m)} aria-expanded={menu} className="flex h-9 items-center gap-1 rounded-full bg-paper pl-1 pr-2 ring-1 ring-line">
                      <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">{PROFILE.name[0]}</span>
                      <ChevronDown className="size-3.5 text-muted" />
                    </button>
                    <AnimatePresence>
                      {menu && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute right-0 top-11 z-10 w-56 origin-top-right rounded-xl bg-card p-1.5 shadow-lg ring-1 ring-line"
                        >
                          <div className="px-3 py-2">
                            <p className="text-sm font-semibold">{PROFILE.name}</p>
                            <p className="text-xs text-muted">{a.phone}</p>
                          </div>
                          <button
                            onClick={() => {
                              setMenu(false)
                              setPane('agent')
                              a.signOut()
                            }}
                            className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm hover:bg-paper"
                          >
                            <LogOut className="size-4 text-muted" /> Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button aria-label="Close" onClick={() => a.setOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-paper"><X className="size-5" /></button>
              </div>

              {a.signedIn && (
                <div className="flex gap-1 px-3">
                  {(['agent', 'wallet', 'orders'] as Pane[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPane(p)}
                      className={`-mb-px flex h-10 items-center gap-1.5 border-b-2 px-3 text-sm transition-colors duration-150 ease-out ${pane === p ? 'border-ink font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'}`}
                    >
                      {p === 'agent' ? 'Ask' : p === 'wallet' ? <>Wallet <span className="tabular-nums text-muted">{formatINR(a.balance)}</span></> : <>Orders <span className="text-muted">{a.orders.length}</span></>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!a.signedIn ? (
              <SignIn onDone={a.signIn} />
            ) : pane === 'agent' ? (
              <Chat
                shop={STORE.handle}
                productId={itemId}
                balance={a.balance}
                orders={a.orders}
                onTopUp={a.addMoney}
                onPaid={a.recordOrder}
                onViewOrder={(id) => {
                  const o = a.orders.find((x) => x.id === id)
                  if (o && o.shop === STORE.handle && o.placed === 'Just now' && a.viewOrder) {
                    a.setOpen(false)
                    a.viewOrder({ itemId: o.productId, total: o.amount, qty: o.qty, option: o.variant, ticket: o.ticket, slot: o.slot, email: o.email, orderId: o.id })
                    return
                  }
                  setFocusOrder(id ?? null)
                  setPane('orders')
                }}
                onOpenShop={(h) => {
                  if (h === STORE.handle) a.setOpen(false)
                  else window.open(instagramUrl(h), '_blank')
                }}
              />
            ) : pane === 'wallet' ? (
              <WalletPane />
            ) : (
              <OrdersPane focus={focusOrder} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── Sign in: phone, then OTP ───────────────────────── */

function SignIn({ onDone }: { onDone: (phone: string) => void }) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [digits, setDigits] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [wait, setWait] = useState(0)

  useEffect(() => {
    if (!wait) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const pretty = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`.trim()

  const send = () => {
    if (digits.length !== 10 || !/^[6-9]/.test(digits)) return setError('Enter a valid 10-digit mobile number.')
    setError('')
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setStep('otp')
      setWait(30)
    }, 700)
  }
  const verify = () => {
    if (code.length !== 6) return setError('Enter the 6-digit code.')
    setError('')
    setBusy(true)
    setTimeout(() => onDone(pretty), 700)
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-7">
      {step === 'phone' ? (
        <>
          <h2 className="font-display text-[26px] font-semibold leading-tight">Sign in to your agent</h2>
          <p className="mt-1.5 text-sm text-muted">One account for every Riftori shop. Your agent pays from your wallet and fills in your address and details for you.</p>

          <label htmlFor="agent-phone" className="mt-7 block text-xs font-medium text-muted">Mobile number</label>
          <div className={`mt-1.5 flex h-12 items-center rounded-xl bg-card ring-1 focus-within:ring-2 focus-within:ring-ink/40 ${error ? 'ring-2 ring-brand' : 'ring-line'}`}>
            <span className="border-r border-line px-3.5 text-[15px] font-medium text-muted">+91</span>
            <input
              id="agent-phone"
              autoFocus
              value={digits}
              onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              className="min-w-0 flex-1 bg-transparent px-3.5 text-[15px] tabular-nums tracking-wide outline-none placeholder:text-faint"
            />
          </div>
          {error && <p className="mt-1.5 text-xs font-medium text-brand-ink">{error}</p>}

          <button onClick={send} disabled={busy} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-80">
            {busy && <Loader2 className="size-4 animate-spin" />} {busy ? 'Sending code…' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <button onClick={() => { setStep('phone'); setCode(''); setError('') }} className="-ml-1 flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft className="size-4" /> Change number
          </button>
          <h2 className="mt-4 font-display text-[26px] font-semibold leading-tight">Enter the code</h2>
          <p className="mt-1.5 text-sm text-muted">Sent by SMS to <span className="font-medium text-ink">{pretty}</span></p>

          <label htmlFor="agent-otp" className="sr-only">6-digit code</label>
          <div className="relative mt-7">
            <input
              id="agent-otp"
              autoFocus
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6)
                setCode(v)
                setError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && verify()}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
            />
            <div className="grid grid-cols-6 gap-2" aria-hidden>
              {Array.from({ length: 6 }, (_, i) => (
                <span
                  key={i}
                  className={`grid h-14 place-items-center rounded-xl bg-card text-xl font-semibold tabular-nums ring-1 ${
                    error ? 'ring-2 ring-brand' : i === code.length ? 'ring-2 ring-ink' : 'ring-line'
                  }`}
                >
                  {code[i] ?? ''}
                </span>
              ))}
            </div>
          </div>
          {error && <p className="mt-1.5 text-xs font-medium text-brand-ink">{error}</p>}

          <button onClick={verify} disabled={busy} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-80">
            {busy && <Loader2 className="size-4 animate-spin" />} {busy ? 'Verifying…' : 'Verify and continue'}
          </button>
          <p className="mt-4 text-center text-sm text-muted">
            {wait ? <>Resend code in 0:{String(wait).padStart(2, '0')}</> : <button onClick={() => setWait(30)} className="font-medium text-ink underline underline-offset-2">Resend code</button>}
          </p>
        </>
      )}

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <ShieldCheck className="mt-px size-4 shrink-0" /> Your agent never pays without your tap. Money in your wallet can go back to your bank any time.
      </p>
    </div>
  )
}

/* ───────────────────────── Wallet ───────────────────────── */

function WalletPane() {
  const a = useAgent()
  const [amount, setAmount] = useState(1000)
  const [state, setState] = useState<'idle' | 'paying' | 'done'>('idle')

  const add = () => {
    setState('paying')
    setTimeout(() => {
      a.addMoney(amount)
      setState('done')
      setTimeout(() => setState('idle'), 1200)
    }, 900)
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5">
      <p className="text-sm text-muted">Riftori wallet · {WALLET.id}</p>
      <p className="mt-1 font-display text-[44px] font-semibold leading-none tabular-nums tracking-tight">{formatINR(a.balance)}</p>
      <p className="mt-2 text-sm text-muted">Pays at every Riftori shop, in one tap.</p>

      <section className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-line">
        <h3 className="text-sm font-semibold">Add money</h3>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[500, 1000, 2000, 5000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`h-10 rounded-full text-sm font-medium tabular-nums transition-colors duration-150 ease-out ${amount === v ? 'bg-ink text-white' : 'ring-1 ring-line hover:bg-paper'}`}
            >
              {formatINR(v)}
            </button>
          ))}
        </div>
        <p className="mt-3 flex justify-between text-xs text-muted"><span>From UPI · ananya.rao@okicici</span><span className="tabular-nums">New balance {formatINR(a.balance + amount)}</span></p>
        <button onClick={add} disabled={state !== 'idle'} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-ink disabled:opacity-90">
          {state === 'paying' ? <><Loader2 className="size-4 animate-spin" /> Waiting for UPI…</> : state === 'done' ? <><Check className="size-4" /> Added</> : <><Plus className="size-4" /> Add {formatINR(amount)}</>}
        </button>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold">Activity</h3>
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
          {a.txns.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full ${t.by === 'agent' ? 'bg-ink text-white' : t.amount > 0 ? 'bg-ok-soft text-ok' : 'bg-paper text-muted'}`}>
                {t.by === 'agent' ? <Sparkles className="size-4" /> : t.by === 'topup' ? <ArrowDownLeft className="size-4" /> : t.by === 'refund' ? <RotateCcw className="size-4" /> : <User className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                <p className="truncate text-xs text-muted">{t.by === 'agent' ? 'By agent · ' : ''}{t.sub}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? 'text-ok' : ''}`}>{t.amount > 0 ? '+' : '−'}{formatINR(Math.abs(t.amount))}</p>
                <p className="text-[11px] text-faint">{t.when}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/* ───────────────────────── Orders ───────────────────────── */

function OrdersPane({ focus }: { focus: string | null }) {
  const a = useAgent()
  const [open, setOpen] = useState<string | null>(focus ?? a.orders[0]?.id ?? null)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5">
      <p className="text-sm text-muted">Everything you’ve bought or booked, at every Riftori shop.</p>
      <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
        {a.orders.map((o) => {
          const expanded = open === o.id
          return (
            <li key={o.id}>
              <button onClick={() => setOpen(expanded ? null : o.id)} aria-expanded={expanded} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-paper">
                <img src={o.image} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{o.title}</span>
                  <span className="block truncate text-xs text-muted">@{o.shop} · {o.amount === 0 ? 'Free' : formatINR(o.amount)} · {o.placed}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(o.status)}`}>{o.status}</span>
              </button>
              {expanded && (
                <div className="space-y-1.5 bg-paper/60 px-4 pb-4 pt-1 text-sm">
                  <Detail label="Order" value={o.id} />
                  {o.when && <Detail label="When" value={o.when} />}
                  {o.location && <Detail label="Where" value={o.location} />}
                  {o.ticket && <Detail label="Tickets" value={`${o.qty} × ${o.ticket}`} />}
                  {o.attendees && <Detail label="Names" value={o.attendees.join(', ')} />}
                  {o.slot && <Detail label="Call" value={o.slot} />}
                  {o.topic && <Detail label="About" value={o.topic} />}
                  {o.meet && <Detail label="Link" value={o.meet} />}
                  {o.variant && <Detail label="Item" value={`${o.qty} × ${o.variant}`} />}
                  {o.address && <Detail label="Deliver to" value={`${o.name}, ${o.address}`} />}
                  {o.tracking && <Detail label="Tracking" value={o.tracking} />}
                  {o.file && <Detail label="File" value={o.file} />}
                  <Detail label="Paid" value={`${o.paidBy === 'agent' ? 'By your agent' : 'By you'} · wallet`} />
                  <div className="flex gap-2 pt-2">
                    <a href={instagramUrl(o.shop)} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-3 text-xs font-semibold ring-1 ring-line"><Instagram className="size-3.5" /> @{o.shop}</a>
                    <a href={`https://ig.me/m/${o.shop}`} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-3 text-xs font-semibold ring-1 ring-line"><Package className="size-3.5" /> Message seller</a>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-3">
      <span className="w-20 shrink-0 text-muted">{label}</span>
      <span className="min-w-0 flex-1 font-medium">{value}</span>
    </p>
  )
}
