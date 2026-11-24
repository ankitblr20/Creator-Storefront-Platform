import React, { useState } from 'react'
import { Copy, Check, MessageCircle, Instagram, Linkedin, Twitter, Mail, Gift, Bell } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { STORE } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function ReferAndEarn(props: Props) {
  const { state, published, onNavigate, onNewItem } = { ...args, ...props }
  const empty = state === 'no-referrals'
  const [copied, setCopied] = useState<string | null>(null)
  const [nudged, setNudged] = useState<Record<string, boolean>>({})
  const link = `riftori.com/r/${STORE.slug}`
  const code = 'PRIYA2M'
  const message = `I sell my workshops, kits and patterns on Riftori — one link in my bio, ₹0 commission, money straight to my bank. Use my code ${code} and we both get 2 months free: https://${link}`
  const rows = empty ? [] : REFERRALS
  const earned = rows.filter((r) => r.status === 'Paid').length * 2

  const copy = (key: string) => {
    setCopied(key)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <Shell
      active="referrals"
      title="Refer & earn"
      subtitle="Give 2 months free, get 2 months free — for every seller who picks a plan."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Share — the one job on this page */}
        <section className="rounded-xl bg-surface p-6 ring-1 ring-line sm:p-8">
          <Gift className="size-6 text-accent" strokeWidth={1.75} />
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Give 2 months, get 2 months</h2>
          <p className="mt-2 max-w-lg text-[15px] text-muted">
            Know someone selling over Instagram DMs? Send them your link. When they pick a paid plan after their trial, you both get 2 months free.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 items-center gap-2 rounded-lg bg-canvas p-1.5 pl-4">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{link}</span>
              <CopyBtn active={copied === 'link'} onClick={() => copy('link')} label="Copy link" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-canvas p-1.5 pl-4">
              <span className="font-mono text-sm font-semibold tracking-wider">{code}</span>
              <CopyBtn active={copied === 'code'} onClick={() => copy('code')} label="Copy code" />
            </div>
          </div>

          <p className="mt-6 text-sm font-medium">Share on</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SHARE.map(({ label, icon: Icon }) => (
              <a key={label} href="#" className="flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas">
                <Icon className="size-4" /> {label}
              </a>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Ready-to-send message</p>
              <button onClick={() => copy('msg')} className="flex items-center gap-1 text-sm font-medium text-accent">
                {copied === 'msg' ? <Check className="size-4" /> : <Copy className="size-4" />} {copied === 'msg' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 rounded-lg bg-canvas p-4 text-sm leading-relaxed">{message}</p>
          </div>
        </section>

        {/* What you've earned */}
        <aside className="space-y-4 self-start">
          <section className="rounded-xl bg-surface p-5 ring-1 ring-line">
            <p className="text-sm text-muted">Free months earned</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight">{earned}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas">
              <div className="h-full rounded-full bg-accent" style={{ width: `${(earned / 12) * 100}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-muted">{earned} of 12 this year</p>
            <p className="mt-4 border-t border-line pt-4 text-sm">
              {earned ? <>Your Pro plan is free until <span className="font-semibold">4 Oct 2025</span>.</> : 'Your first referral who picks a plan makes your next 2 months free.'}
            </p>
          </section>
          <dl className="grid grid-cols-3 rounded-xl bg-surface text-center ring-1 ring-line">
            <Stat label="Link visits" value={empty ? '0' : '38'} />
            <Stat label="Signed up" value={String(rows.length)} />
            <Stat label="Paid" value={String(rows.filter((r) => r.status === 'Paid').length)} />
          </dl>
        </aside>
      </div>

      {/* Referrals */}
      <section className="mt-6 rounded-xl bg-surface ring-1 ring-line">
        <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold">Your referrals</h2>
        {rows.length ? (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.store} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">{r.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{r.store}</p>
                  <p className="text-xs text-muted">{r.owner} · joined {r.joined}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${r.status === 'Paid' ? 'text-accent' : r.status === 'Expired' ? 'text-faint' : ''}`}>{r.label}</p>
                  <p className="text-xs text-muted">{r.reward}</p>
                </div>
                {r.status === 'Trial' && (
                  <button
                    onClick={() => setNudged((n) => ({ ...n, [r.store]: true }))}
                    disabled={nudged[r.store]}
                    className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium ring-1 ring-line hover:bg-canvas disabled:text-muted"
                  >
                    {nudged[r.store] ? <><Check className="size-3.5" /> Reminder sent</> : <><Bell className="size-3.5" /> Send a reminder</>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">No one yet. Your link is above — a WhatsApp message to two seller friends is a good start.</p>
        )}
      </section>

      {/* How it works */}
      <section className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="text-sm font-semibold">How it works</h2>
          <ol className="mt-3 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-sm font-semibold">The fine print</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
            {TERMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>
    </Shell>
  )
}

function CopyBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-semibold transition-colors duration-150 ease-out ${active ? 'bg-ink text-white' : 'bg-accent text-white hover:bg-accent-ink'}`}
    >
      {active ? <Check className="size-4" /> : <Copy className="size-4" />} {active ? 'Copied' : label}
    </button>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line py-4 [&:not(:last-child)]:border-r">
      <dd className="text-xl font-semibold tabular-nums">{value}</dd>
      <dt className="text-xs text-muted">{label}</dt>
    </div>
  )
}

const SHARE = [
  { label: 'WhatsApp', icon: MessageCircle },
  { label: 'Instagram', icon: Instagram },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'X', icon: Twitter },
  { label: 'Email', icon: Mail },
]

const REFERRALS = [
  { store: 'Knotty by Shreya', owner: 'Shreya Das', initials: 'SD', joined: '2 May', status: 'Paid', label: 'Paid · Starter', reward: '+2 months for you · credited 2 Jun' },
  { store: 'The Sourdough Club', owner: 'Ira Banerjee', initials: 'IB', joined: '14 May', status: 'Paid', label: 'Paid · Pro', reward: '+2 months for you · credited 28 May' },
  { store: 'Doodle Diaries', owner: 'Tanvi Shah', initials: 'TS', joined: '3 Jun', status: 'Trial', label: 'On trial · 8 days left', reward: '2 months pending' },
  { store: 'Mehendi by Ruhi', owner: 'Ruhi Khan', initials: 'RK', joined: '6 Jun', status: 'Trial', label: 'On trial · 11 days left', reward: '2 months pending' },
  { store: 'Lens & Light', owner: 'Varun Nair', initials: 'VN', joined: '20 Apr', status: 'Expired', label: 'Trial ended, no plan', reward: 'No reward' },
]

const STEPS = [
  'Share your link or code with someone who sells online.',
  'They sign up and get a 14-day free trial, like you did.',
  'When they pick any paid plan, 2 free months land on both accounts.',
]

const TERMS = [
  'Months are credited after your friend’s first successful payment.',
  'You can earn up to 12 free months a year.',
  'Free months apply to whichever plan you’re on when they’re used.',
  'Referring your own second store, or fake accounts, cancels the reward.',
]

export const args = {
  state: 'with-referrals',
  published: true,
}

export const argTypes = {
  state: { control: 'radio', options: ['with-referrals', 'no-referrals'] },
  published: { control: 'boolean' },
}
