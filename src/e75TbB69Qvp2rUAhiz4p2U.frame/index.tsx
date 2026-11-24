import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Download, Video, MapPin, CalendarPlus, Truck, Mail, Bookmark, PlayCircle, Lock } from 'lucide-react'

import { ItemImage } from '../shared/buyer/ProductCard'
import { QR } from '../shared/QR'
import { STORE, FULFILMENT, findItem, formatINR, bagTotals, type BagLine } from '../shared/storefront/data'

type Props = Omit<Partial<typeof args>, 'lines'> & { lines?: BagLine[]; ticket?: string; onBackToStore?: () => void }

export default function OrderConfirmed(props: Props) {
  const { mode, itemId, quantity, slot, lines, email, orderId, emailSent, onBackToStore } = { ...args, ...props }
  const reduce = useReducedMotion()
  const booking = mode === 'booking'
  const item = findItem(itemId)
  const bag = bagTotals(lines)
  const ticket = item.tickets?.find((t) => t.name === props.ticket) ?? item.tickets?.find((t) => t.left > 0)
  const total = booking ? (ticket?.price ?? item.price) * quantity : bag.total
  const isEvent = booking && item.type !== 'call'

  const headline = booking
    ? item.type === 'call' ? 'Your meeting is booked' : quantity > 1 ? `Your ${quantity} tickets` : 'Your ticket'
    : 'Thank you — order placed'

  return (
    <main className="min-h-full bg-paper">
      <div className="mx-auto max-w-xl px-5 pb-12 pt-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="grid size-12 place-items-center rounded-full bg-ok text-white"
        >
          <Check className="size-6" strokeWidth={2.5} />
        </motion.div>
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-tight tracking-tight">{headline}</h1>
        <p className="mt-1.5 text-[15px] text-muted">Order {orderId} · {formatINR(total)} paid to {STORE.name}</p>

        {isEvent ? (
          /* QR ticket — shown at the door, scanned from the seller's Events page */
          <section className="mt-8 overflow-hidden rounded-2xl bg-card ring-1 ring-line">
            <div className="flex flex-col items-center border-b border-dashed border-line px-5 pb-5 pt-6 text-center">
              <QR seed={orderId.length * 97 + quantity} className="size-44" label="Ticket QR code" />
              <p className="mt-3 text-xs text-muted">Show this at the door · admits {quantity}</p>
            </div>
            <div className="space-y-0.5 p-5">
              <p className="text-sm font-semibold">{item.title}</p>
              {ticket && <p className="text-xs text-muted">{ticket.name} × {quantity}</p>}
              <Row icon={CalendarPlus} value={item.when} />
              <Row icon={MapPin} value={item.location ?? 'Online'} />
              <PrimaryLink icon={CalendarPlus} label="Add to calendar" />
            </div>
          </section>
        ) : booking ? (
          <section className="mt-8 rounded-2xl bg-card p-5 ring-1 ring-line">
            <p className="text-sm font-semibold">{item.title}</p>
            <Row icon={CalendarPlus} value={item.type === 'call' ? `${slot ?? 'Wed 11 Jun, 11:00 am'} · ${item.when.split(' · ')[0]}` : item.when} />
            <Row icon={item.type === 'call' ? Video : MapPin} value={item.type === 'call' ? 'meet.google.com/pcr-hkta-wqe' : item.location ?? 'Online'} />
            <PrimaryLink icon={CalendarPlus} label="Add to calendar" />
          </section>
        ) : (
          <ul className="mt-8 space-y-3">
            {lines.map((l) => {
              const i = findItem(l.id)
              return (
                <li key={l.id + (l.option ?? '')} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                  <div className="flex gap-3">
                    <div className="size-14 shrink-0 overflow-hidden rounded-xl"><ItemImage item={i} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug">{i.title}</p>
                      <p className="text-xs text-muted">{l.qty} × {formatINR(i.price)}{l.option && ` · ${l.option}`}</p>
                    </div>
                  </div>
                  {i.type === 'digital' ? (
                    <>
                      <PrimaryLink icon={i.id === 'zero-course' ? PlayCircle : Download} label={i.id === 'zero-course' ? 'Start lesson 1' : 'Secure download'} />
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-faint">
                        <Lock className="size-3" /> Private link for {email} · 5 downloads
                      </p>
                    </>
                  ) : (
                    <div className="mt-4">
                      <ol className="grid grid-cols-4 gap-1">
                        {FULFILMENT.map((s, idx) => (
                          <li key={s}>
                            <div className={`h-1 rounded-full ${idx === 0 ? 'bg-ok' : 'bg-line'}`} />
                            <p className={`mt-1.5 text-[11px] ${idx === 0 ? 'font-semibold text-ink' : 'text-faint'}`}>{s}</p>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <Truck className="size-3.5 shrink-0 text-faint" /> {i.dispatch ?? 'Dispatched soon'}. Tracking appears here once it ships.
                      </p>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-muted">
          {emailSent ? (
            <><Mail className="mt-0.5 size-4 shrink-0 text-faint" /> A copy is on its way to {email}.</>
          ) : (
            <><Bookmark className="mt-0.5 size-4 shrink-0 text-faint" /> Bookmark this page — it's your receipt{booking ? ' and joining details' : ' and download link'}.</>
          )}
        </p>

        <button
          onClick={onBackToStore}
          className="mt-8 h-11 w-full rounded-full bg-card text-sm font-semibold ring-1 ring-line transition-colors duration-150 ease-out hover:bg-line/50"
        >
          Continue shopping
        </button>
      </div>
    </main>
  )
}

function Row({ icon: Icon, value }: { icon: typeof Check; value: string }) {
  return (
    <p className="mt-2.5 flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 size-4 shrink-0 text-faint" />
      <span className="break-words">{value}</span>
    </p>
  )
}

function PrimaryLink({ icon: Icon, label }: { icon: typeof Check; label: string }) {
  return (
    <a href="#" className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-ink">
      <Icon className="size-4" /> {label}
    </a>
  )
}

export const args = {
  mode: 'bag',
  itemId: 'amigurumi-workshop',
  quantity: 2,
  slot: 'Wed 11 Jun, 11:00 am',
  lines: [
    { id: 'beginner-kit', qty: 1, option: 'Sage' },
    { id: 'sunflower-pattern', qty: 1 },
  ],
  email: 'ananya.rao@gmail.com',
  orderId: 'SF-2487',
  emailSent: false,
}

export const argTypes = {
  mode: { control: 'radio', options: ['bag', 'booking'] },
  itemId: { control: 'select', options: ['amigurumi-workshop', 'troubleshoot-call', 'crochet-circle', 'coorg-retreat-2'] },
  quantity: { control: 'number' },
  emailSent: { control: 'boolean' },
}
