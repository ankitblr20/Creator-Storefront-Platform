import React, { useState } from 'react'
import { Copy, Check, Download, Instagram, MessageCircle, Pin, Camera, Repeat2 } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { QR } from '../shared/QR'
import { STORE, ITEMS, formatINR, moduleOf, type ModuleKey } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Promote(props: Props) {
  const { itemId: initial, published, onNavigate, onNewItem } = { ...args, ...props }
  const [itemId, setItemId] = useState(initial)
  const [copied, setCopied] = useState<string | null>(null)
  const item = ITEMS.find((i) => i.id === itemId) ?? ITEMS[0]
  const deepLink = `${STORE.link}/${item.id}`
  const sticker = STICKER[item.type]
  const caption = `${item.title} — ${item.when}${item.location ? `, ${item.location}` : ''}. ${item.seatsLeft !== undefined ? `Only ${item.seatsLeft} seats left. ` : item.stock !== undefined && item.stock <= 5 ? `Only ${item.stock} left. ` : ''}${item.price ? formatINR(item.price) : 'Free'} · tap the link in my bio 🧶`

  const copy = (key: string) => {
    setCopied(key)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <Shell
      active="promote"
      title="Promote"
      subtitle="Ready-to-paste links and captions for Instagram and WhatsApp."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      {/* Store link + QR */}
      <section className="grid gap-6 rounded-xl bg-surface p-6 ring-1 ring-line md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-sm text-muted">Your one permanent link</p>
          <p className="mt-1 break-all font-display text-2xl font-semibold tracking-tight sm:text-3xl">{STORE.link}</p>
          <p className="mt-3 text-sm text-muted">Keep it in:</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {PLACES.map((p) => <li key={p} className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium">{p}</li>)}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton active={copied === 'store'} onClick={() => copy('store')} label="Copy link" />
            <a href="#" className="flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium ring-1 ring-line hover:bg-canvas"><Instagram className="size-4" /> Open Instagram</a>
            <a href="#" className="flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium ring-1 ring-line hover:bg-canvas"><MessageCircle className="size-4" /> Share on WhatsApp</a>
          </div>
        </div>
        <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-2">
          <QR className="size-28 ring-1 ring-line" label="QR code for your store" />
          <button className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-ink"><Download className="size-4" /> QR for posters</button>
        </div>
      </section>

      {/* Story kit */}
      <section className="mt-6 rounded-xl bg-surface ring-1 ring-line">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-base font-semibold">Campaign kit</h2>
          <p className="text-sm text-muted">Each item has its own direct link for Reels, Stories, broadcasts and partners. Pick one — we write the CTA and caption.</p>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {ITEMS.filter((i) => i.type !== 'activity').slice(0, 10).map((i) => (
              <li key={i.id} className="shrink-0">
                <button
                  onClick={() => setItemId(i.id)}
                  className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 ease-out lg:whitespace-normal ${
                    itemId === i.id ? 'bg-accent-soft font-semibold text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'
                  }`}
                >
                  {i.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="min-w-0 space-y-5">
            <Snippet label="Direct link — opens this item" value={deepLink} copied={copied === 'deep'} onCopy={() => copy('deep')} />
            <Snippet label="Link sticker text" value={sticker} copied={copied === 'sticker'} onCopy={() => copy('sticker')} />
            <Snippet label="Caption" value={caption} copied={copied === 'caption'} onCopy={() => copy('caption')} multiline />
          </div>
        </div>
      </section>

      {/* What works for this kind of item */}
      <section className="mt-6">
        <h2 className="text-base font-semibold">What works for {MODULE_NAME[moduleOf(item.type)]}</h2>
        <ul className="mt-3 grid gap-x-8 gap-y-4 md:grid-cols-3">
          {TIPS[moduleOf(item.type)].map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  )
}

function Snippet({ label, value, copied, onCopy, multiline }: { label: string; value: string; copied: boolean; onCopy: () => void; multiline?: boolean }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">{label}</p>
      <div className="flex items-start gap-2 rounded-lg bg-canvas p-3">
        <p className={`min-w-0 flex-1 text-sm ${multiline ? 'leading-relaxed' : 'truncate'}`}>{value}</p>
        <CopyButton active={copied} onClick={onCopy} label="Copy" small />
      </div>
    </div>
  )
}

function CopyButton({ active, onClick, label, small }: { active: boolean; onClick: () => void; label: string; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg font-medium transition-colors duration-150 ease-out ${small ? 'h-8 px-2.5 text-xs' : 'h-9 px-3.5 text-sm'} ${
        active ? 'bg-accent text-white' : 'bg-accent-soft text-accent-ink hover:bg-[#d5e7de]'
      }`}
    >
      {active ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {active ? 'Copied' : label}
    </button>
  )
}

const STICKER: Record<string, string> = {
  event: 'Join Saturday’s workshop',
  call: 'Book a 30-min fix-it call',
  digital: 'Get the pattern',
  physical: 'Order your crochet kit',
  activity: 'Save your seat',
  experience: 'Come to Coorg',
}

const TIPS: Record<ModuleKey, { icon: typeof Pin; title: string; body: string }[]> = {
  events: [
    { icon: Camera, title: 'Post the outcome and the place', body: 'Photos from the last workshop sell the next one better than a poster.' },
    { icon: Instagram, title: 'Countdown Stories', body: 'Add a countdown and link sticker 2–3 days before early-bird or seats run out.' },
    { icon: Repeat2, title: 'Past-event proof', body: 'Your past events show on your store — point people to them.' },
  ],
  meetings: [
    { icon: Camera, title: 'Show the problem you solve', body: 'A before-and-after from a client call, or the question you answer most.' },
    { icon: Pin, title: 'One clear CTA', body: '“Book a 30-minute fix-it call” beats “DM me”.' },
    { icon: Repeat2, title: 'Answer FAQs in Stories', body: 'Each answer ends with the booking link.' },
  ],
  digital: [
    { icon: Camera, title: 'Show a preview', body: 'Two pages of the pattern or a 10-second scroll through the PDF.' },
    { icon: Pin, title: 'Say who it helps', body: '“For beginners who can chain but get lost after round 2.”' },
    { icon: Instagram, title: 'Direct CTA', body: '“Get the pattern” with the item link, not just “link in bio”.' },
  ],
  physical: [
    { icon: Camera, title: 'Making-of and close-ups', body: 'Process Reels, stitch close-ups and the variants side by side.' },
    { icon: Repeat2, title: 'Unboxing and packaging', body: 'Repost customers’ unboxings — they’re trusted more than your own posts.' },
    { icon: Pin, title: 'Price, stock and dispatch upfront', body: '“₹1,850 · 3 left · ships in 5 days” in the first line of the caption.' },
  ],
}

const MODULE_NAME: Record<ModuleKey, string> = { events: 'events', meetings: '1:1 meetings', digital: 'digital products', physical: 'physical products' }

const PLACES = ['Instagram bio', 'LinkedIn profile', 'WhatsApp Business profile', 'YouTube description', 'WhatsApp broadcasts', 'Business cards & packaging']

export const args = {
  itemId: 'amigurumi-workshop',
  published: true,
}

export const argTypes = {
  itemId: { control: 'select', options: ['amigurumi-workshop', 'market-tote', 'beginner-kit', 'sunflower-pattern', 'troubleshoot-call'] },
  published: { control: 'boolean' },
}
