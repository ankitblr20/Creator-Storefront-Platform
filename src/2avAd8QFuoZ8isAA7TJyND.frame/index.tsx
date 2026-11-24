import React from 'react'
import { ArrowRight, Ticket, Video, FileDown, Package, Check, X, Minus } from 'lucide-react'

import { LiveSales } from './components/LiveSales'
import { SiteFooter, type LegalPage } from '../shared/seller/SiteFooter'

type Props = Partial<typeof args> & { onStart?: () => void; onSignIn?: () => void; onLegal?: (page: LegalPage) => void }

export default function Landing(props: Props) {
  const { headline, onStart, onSignIn, onLegal } = { ...args, ...props }

  return (
    <div className="min-h-full bg-surface text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">R</span>
            <span className="text-[15px] font-semibold tracking-tight">Riftori</span>
          </span>
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            <a href="#sell" className="hover:text-ink">What you can sell</a>
            <a href="#compare" className="hover:text-ink">Compare</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onSignIn} className="hidden h-9 rounded-lg px-3 text-sm font-medium hover:bg-canvas sm:block">Sign in</button>
            <button onClick={onStart} className="h-9 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink">
              Start free trial
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:py-24">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">{headline}</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Sell events, 1:1 calls, digital downloads and physical products from one link — for a flat ₹199 a month. Buyers pay you directly by UPI. We take 0%.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={onStart} className="flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink">
              Create your store <ArrowRight className="size-4" />
            </button>
            <p className="text-sm text-muted">14-day free trial · no card needed · live in 5 minutes</p>
          </div>
          {/* The link they'll walk away with */}
          <div className="mt-10 flex max-w-md items-center gap-3 rounded-xl bg-canvas p-3 pl-4">
            <span className="min-w-0 flex-1 truncate text-sm"><span className="text-muted">riftori.com/</span><span className="font-semibold">yourname</span></span>
            <span className="shrink-0 text-xs text-muted">Instagram · LinkedIn · WhatsApp</span>
          </div>
        </div>

        <LiveSales />
      </section>

      {/* Problem */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Instagram has your audience. Getting paid shouldn’t be this hard.</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {TRAPS.map(([title, body]) => (
              <div key={title}>
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four modules */}
      <section id="sell" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Whatever you do, sell it here</h2>
        <p className="mt-2 max-w-2xl text-muted">Four tools in one dashboard. Buyers only see what you publish, and only answer what that item needs.</p>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {MODULES.map(({ icon: Icon, name, who, asks, gets }) => (
            <div key={name} className="grid gap-4 py-6 md:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)] md:gap-8">
              <div className="flex items-center gap-3">
                <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted">{who}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-faint">Buyer gives</p>
                <p className="mt-0.5 text-sm">{asks}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-faint">Buyer gets</p>
                <p className="mt-0.5 text-sm">{gets}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Instagram + your Riftori link = a complete business</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map(([title, body], i) => (
              <li key={title}>
                <p className="text-sm font-semibold tabular-nums text-white/50">{i + 1}</p>
                <p className="mt-2 text-lg font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The maths is simple</h2>
        <p className="mt-2 max-w-2xl text-muted">Sell ₹50,000 a month and a 10% platform keeps ₹5,000. On Riftori you pay ₹199.</p>
        <div className="mt-8 overflow-x-auto rounded-xl ring-1 ring-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-5 py-4 font-medium text-muted" />
                <th className="bg-accent-soft px-5 py-4 font-semibold text-accent-ink">Riftori</th>
                <th className="px-5 py-4 font-semibold">Topmate</th>
                <th className="px-5 py-4 font-semibold">Cosmofeed</th>
                <th className="px-5 py-4 font-semibold">Shopify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {COMPARE.map(([row, ...cells]) => (
                <tr key={row}>
                  <td className="px-5 py-3.5 font-medium">{row}</td>
                  {cells.map((c, i) => (
                    <td key={i} className={`px-5 py-3.5 ${i === 0 ? 'bg-accent-soft/60 font-semibold' : 'text-muted'}`}>
                      <Cell value={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">One flat price. You keep every sale.</h2>
          <p className="mt-2 text-muted">Every plan starts with a 14-day free trial — make your first sale before you pay anything.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-2xl bg-surface p-6 ${p.popular ? 'ring-2 ring-accent' : 'ring-1 ring-line'}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-lg font-semibold">{p.name}</p>
                  {p.popular && <span className="text-xs font-semibold text-accent">Most chosen</span>}
                </div>
                <p className="mt-1 min-h-10 text-sm text-muted">{p.who}</p>
                <p className="mt-5 text-4xl font-semibold tracking-tight">{p.price}<span className="text-base font-normal text-muted">/month</span></p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-accent" />{f}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <button
                    onClick={onStart}
                    className={`h-11 w-full rounded-lg text-sm font-semibold transition-colors duration-150 ease-out ${p.popular ? 'bg-accent text-white hover:bg-accent-ink' : 'ring-1 ring-line hover:bg-canvas'}`}
                  >
                    Start 14-day trial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">Just your Instagram and our link. That’s your entire business.</h2>
        <button onClick={onStart} className="mx-auto mt-8 flex h-12 items-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink">
          Claim your link <ArrowRight className="size-4" />
        </button>
      </section>

      <SiteFooter onLegal={onLegal} onStart={onStart} />
    </div>
  )
}

function Cell({ value }: { value: string }) {
  if (value === 'yes') return <Check className="size-4 text-accent" />
  if (value === 'no') return <X className="size-4 text-faint" />
  if (value === '—') return <Minus className="size-4 text-faint" />
  return <>{value}</>
}

const TRAPS = [
  ['The commission trap', 'Topmate and Cosmofeed take 5–10% of every sale. The more you sell, the more you pay.'],
  ['The complexity trap', 'Shopify costs ₹3,200+ a month and takes weeks to set up if you’re not technical.'],
  ['The fragmented mess', 'Linktree for links, Calendly for calls, Eventbrite for tickets, GPay screenshots for money. Buyers get lost.'],
]

const MODULES = [
  { icon: Ticket, name: 'Events & experiences', who: 'Meetups, Zoom webinars, workshops', asks: 'Ticket type, quantity, name and contact', gets: 'A QR ticket, checked in at the door' },
  { icon: Video, name: '1:1 appointments', who: 'Mentoring, consults, coaching', asks: 'A slot from your Google Calendar availability', gets: 'A confirmed booking and meeting link' },
  { icon: FileDown, name: 'Digital goods', who: 'PDFs, Notion templates, video courses', asks: 'Name and email', gets: 'An instant, secure download after payment' },
  { icon: Package, name: 'Physical goods', who: 'Custom art, thrift, bakery, D2C', asks: 'Variant, quantity, address and a note', gets: 'Order status from packed to delivered' },
]

const FLOW = [
  ['Attract', 'Post a Reel or Story about your new event or product.'],
  ['Click', 'Followers tap the one link in your bio.'],
  ['Transact', 'They check out in three taps with UPI.'],
  ['Earn', 'Money lands in your bank directly. We stay out of the way.'],
]

const COMPARE = [
  ['Price', '₹199 / month', 'Free to start', 'Free to start', '₹3,200+ / month'],
  ['Platform commission', '0% — keep 100%', '5–10%', '10%', '~2%'],
  ['Money flow', 'Direct UPI to you', 'Platform holds it', 'Delayed', 'Via gateway'],
  ['Events & tickets', 'yes', 'Webinars only', 'yes', 'Paid apps'],
  ['Physical goods', 'yes', 'no', 'no', 'yes'],
  ['1:1 appointments', 'yes', 'yes', 'no', 'Paid apps'],
]

const PLANS = [
  { name: 'Starter', price: '₹199', who: 'Students, small artists and micro-influencers', popular: false, features: ['All four selling modules', '2 GB storage', 'UPI / Razorpay payments', 'riftori.com/yourname link'] },
  { name: 'Pro', price: '₹499', who: 'Experts, event hosts and course creators', popular: true, features: ['Everything in Starter', 'Custom domain (yourname.com)', '15 GB storage', 'International payments'] },
  { name: 'Business', price: '₹1,499', who: 'Brands and agencies', popular: false, features: ['Everything in Pro', 'Shipping tracking for physical orders', '50 GB storage', 'Team logins'] },
]

export const args = {
  headline: 'Turn your Instagram into a store. Keep 100% of every sale.',
}

export const argTypes = {
  headline: { control: 'text' },
}
