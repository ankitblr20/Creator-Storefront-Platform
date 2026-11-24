import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Sparkles, X, Check, Loader2, ArrowDownLeft, RotateCcw, User } from 'lucide-react'

import { TabBar, type Tab } from '../shared/agent/Chrome'
import { TXNS, WALLET, formatINR, type Txn } from '../shared/agent/data'

type Props = Partial<typeof args> & {
  onTab?: (t: Tab) => void
  onAddMoney?: (amount: number) => void
  /** Payments and top-ups made in this session, newest first */
  recent?: Txn[]
}

export default function Wallet(props: Props) {
  const { state, balance, pocket, onTab, onAddMoney, recent = [] } = { ...args, ...props }
  const [sheet, setSheet] = useState(state === 'add money')
  const [amount, setAmount] = useState(2000)
  const [adding, setAdding] = useState<'idle' | 'paying' | 'done'>('idle')
  const [askAbove, setAskAbove] = useState(true)
  const spent = WALLET.agent.spentThisWeek
  const limit = WALLET.agent.weeklyLimit

  const add = () => {
    setAdding('paying')
    setTimeout(() => {
      setAdding('done')
      onAddMoney?.(amount)
      setTimeout(() => {
        setSheet(false)
        setAdding('idle')
      }, 700)
    }, 900)
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-5">
        <h1 className="mb-5 text-2xl font-semibold tracking-tight">Wallet</h1>
        {/* The balance is the point of this screen */}
        <section>
          <p className="text-sm text-muted">Riftori wallet · {WALLET.id}</p>
          <p className="mt-1 font-display text-5xl font-semibold tabular-nums tracking-tight">{formatINR(balance)}</p>
          <p className="mt-1 text-sm text-muted">Pays any shop on Riftori — one tap, no card each time.</p>
          <button
            onClick={() => setSheet(true)}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink sm:w-auto sm:px-8"
          >
            <Plus className="size-4" /> Add money
          </button>
        </section>

        {/* Agent's own pocket */}
        <section className="mt-8 rounded-2xl bg-agent p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm text-white/70"><Sparkles className="size-4" /> Agent’s pocket</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{formatINR(pocket)}</p>
            </div>
            <button className="h-9 whitespace-nowrap rounded-full px-3.5 text-sm font-medium ring-1 ring-white/25 transition-colors duration-150 ease-out hover:bg-white/10">Top up</button>
          </div>
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white" style={{ width: `${(spent / limit) * 100}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-white/70">{formatINR(spent)} of {formatINR(limit)} weekly limit spent</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
            <p className="text-sm leading-snug">Ask me before any purchase over {formatINR(WALLET.agent.perPurchase)}</p>
            <button
              role="switch"
              aria-checked={askAbove}
              aria-label="Ask before large purchases"
              onClick={() => setAskAbove((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out ${askAbove ? 'bg-white' : 'bg-white/25'}`}
            >
              <span className={`absolute top-0.5 size-5 rounded-full transition-transform duration-150 ease-out ${askAbove ? 'translate-x-[22px] bg-agent' : 'translate-x-0.5 bg-white'}`} />
            </button>
          </div>
        </section>

        {/* Activity */}
        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">Activity</h2>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
            {[...recent, ...TXNS].map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full ${t.by === 'agent' ? 'bg-agent text-white' : t.amount > 0 ? 'bg-accent-soft text-accent' : 'bg-canvas text-muted'}`}>
                  {t.by === 'agent' ? <Sparkles className="size-4" /> : t.by === 'topup' ? <ArrowDownLeft className="size-4" /> : t.by === 'refund' ? <RotateCcw className="size-4" /> : <User className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="truncate text-xs text-muted">{t.by === 'agent' ? 'Paid by agent · ' : ''}{t.sub}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? 'text-accent' : ''}`}>{t.amount > 0 ? '+' : '−'}{formatINR(Math.abs(t.amount))}</p>
                  <p className="text-[11px] text-faint">{t.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <TabBar active="wallet" onTab={onTab} />

      {/* Add money */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setSheet(false)} className="fixed inset-0 z-40 bg-ink/30" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl rounded-t-3xl bg-surface px-5 pb-6 pt-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add money</h2>
                <button aria-label="Close" onClick={() => setSheet(false)} className="grid size-9 place-items-center rounded-full hover:bg-canvas"><X className="size-5" /></button>
              </div>
              <p className="mt-4 text-center font-display text-5xl font-semibold tabular-nums">{formatINR(amount)}</p>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`h-10 rounded-full text-sm font-medium tabular-nums transition-colors duration-150 ease-out ${amount === a ? 'bg-ink text-white' : 'ring-1 ring-line hover:bg-canvas'}`}
                  >
                    {formatINR(a)}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-canvas px-4 py-3 text-sm">
                <span className="text-muted">Pay with UPI</span>
                <span className="font-medium">ananya.rao@okicici</span>
              </div>
              <p className="mt-3 text-xs text-muted">New balance {formatINR(balance + amount)}. Unspent money can go back to your bank any time.</p>
              <button
                onClick={add}
                disabled={adding !== 'idle'}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink disabled:opacity-90"
              >
                {adding === 'paying' ? <><Loader2 className="size-4 animate-spin" /> Waiting for UPI…</> : adding === 'done' ? <><Check className="size-4" /> Added</> : `Add ${formatINR(amount)}`}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export const args = {
  state: 'default',
  balance: 4250,
  pocket: 1500,
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'add money'] },
  balance: { control: 'number' },
  pocket: { control: 'number' },
}
