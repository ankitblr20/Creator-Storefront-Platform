import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Copy, Instagram, Linkedin, MessageCircle, Youtube, Download, ArrowRight, ExternalLink } from 'lucide-react'

import { QR } from '../shared/QR'
import { STORE, findItem, formatINR, kindLabel } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onDashboard?: () => void; onPromote?: () => void }

export default function StoreLive(props: Props) {
  const { itemId, onDashboard, onPromote } = { ...args, ...props }
  const item = findItem(itemId)
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const [channel, setChannel] = useState<keyof typeof STEPS>('instagram')

  return (
    <main className="min-h-full bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-16">
        <div className="min-w-0">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="grid size-12 place-items-center rounded-full bg-accent text-white"
          >
            <Check className="size-6" strokeWidth={2.5} />
          </motion.div>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight">Your store is live</h1>
          <p className="mt-2 text-muted">“{item.title}” is published. Put this link everywhere your audience already is.</p>

          {/* The link */}
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line sm:p-5">
            <p className="min-w-0 flex-1 break-all font-display text-2xl font-semibold tracking-tight sm:text-3xl">{STORE.link}</p>
            <button
              onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500) }}
              className={`flex h-11 shrink-0 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors duration-150 ease-out ${copied ? 'bg-ink text-white' : 'bg-accent text-white hover:bg-accent-ink'}`}
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>

          {/* Where to put it */}
          <section className="mt-8">
            <h2 className="text-sm font-semibold">Add it to</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHANNELS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setChannel(key)}
                  className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150 ease-out ${
                    channel === key ? 'bg-ink text-white' : 'bg-surface ring-1 ring-line hover:bg-line/40'
                  }`}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>
            <ol className="mt-4 space-y-2.5 rounded-xl bg-surface p-5 text-sm ring-1 ring-line">
              {STEPS[channel].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-canvas text-xs font-semibold tabular-nums">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
              <li className="pt-1">
                <a href="#" className="inline-flex items-center gap-1.5 font-medium text-accent">Open {CHANNELS.find((c) => c.key === channel)?.label} <ExternalLink className="size-3.5" /></a>
              </li>
            </ol>
          </section>

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={onDashboard} className="flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white">
              Go to dashboard <ArrowRight className="size-4" />
            </button>
            <button onClick={onPromote} className="h-11 rounded-lg px-5 text-sm font-medium ring-1 ring-line hover:bg-surface">Get captions & Story text</button>
          </div>
        </div>

        {/* What buyers will see + QR */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
            <div className="flex items-center gap-3">
              <img src={STORE.avatar} alt="" className="size-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold leading-tight">{STORE.name}</p>
                <p className="truncate text-xs text-[#9a918a]">@{STORE.handle}</p>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-[#ebe3da]">
              {item.image && <img src={item.image} alt="" className="aspect-[16/10] w-full object-cover" />}
              <div className="p-3">
                <p className="text-[11px] font-medium text-brand">{kindLabel(item.type)}</p>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm font-semibold">{formatINR(item.price)}</p>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-[#9a918a]">Powered by Riftori</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line">
            <QR className="size-20" label="QR code for your store" />
            <div>
              <p className="text-sm font-semibold">QR for packaging & posters</p>
              <button className="mt-1 flex items-center gap-1.5 text-sm font-medium text-accent"><Download className="size-4" /> Download PNG</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

const CHANNELS = [
  { key: 'instagram' as const, label: 'Instagram', icon: Instagram },
  { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin },
  { key: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle },
  { key: 'youtube' as const, label: 'YouTube', icon: Youtube },
]

const STEPS = {
  instagram: ['Open your profile and tap Edit profile', 'Tap Links → Add external link and paste your Riftori link', 'Post a Story with a link sticker pointing to your newest item'],
  linkedin: ['Go to your profile → Contact info → Website, and paste the link', 'Add it to Featured so it shows above your experience', 'Mention it in your next post about what you’re offering'],
  whatsapp: ['In WhatsApp Business, go to Settings → Business tools → Profile', 'Paste the link under Website', 'Share it on your Status and in your next broadcast'],
  youtube: ['Open YouTube Studio → Customisation → Basic info', 'Add the link under Links', 'Pin it at the top of every video description'],
}

export const args = {
  itemId: 'amigurumi-workshop',
}

export const argTypes = {
  itemId: { control: 'select', options: ['amigurumi-workshop', 'beginner-kit', 'sunflower-pattern', 'troubleshoot-call'] },
}
