import React, { useEffect, useState } from 'react'
import { ArrowLeft, Mail, MapPin, Clock, Check, Loader2, Instagram } from 'lucide-react'

import { SiteFooter, LEGAL_TITLES, type LegalPage } from '../shared/seller/SiteFooter'

type Props = Partial<typeof args> & { onHome?: () => void; onStart?: () => void }

export default function LegalAndContact(props: Props) {
  const { page: initialPage, onHome, onStart } = { ...args, ...props }
  const [page, setPage] = useState<LegalPage>(initialPage as LegalPage)
  useEffect(() => setPage(initialPage as LegalPage), [initialPage])

  return (
    <div className="min-h-full bg-surface text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:px-8">
          <button onClick={onHome} className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">R</span>
            <span className="text-[15px] font-semibold tracking-tight">Riftori</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onHome} className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium hover:bg-canvas sm:flex">
              <ArrowLeft className="size-4" /> Home
            </button>
            <button onClick={onStart} className="h-9 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-ink">Start free trial</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-16">
        {/* Page switcher */}
        <nav aria-label="Legal pages" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col">
            {(Object.keys(LEGAL_TITLES) as LegalPage[]).map((p) => (
              <li key={p} className="shrink-0">
                <button
                  onClick={() => setPage(p)}
                  className={`h-9 w-full whitespace-nowrap rounded-lg px-3 text-left text-sm transition-colors duration-150 ease-out ${
                    page === p ? 'bg-accent-soft font-semibold text-accent-ink' : 'text-muted hover:bg-canvas hover:text-ink'
                  }`}
                >
                  {LEGAL_TITLES[p]}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight">{LEGAL_TITLES[page]}</h1>
          {page === 'contact' ? (
            <Contact />
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">Last updated 1 June 2025</p>
              <p className="mt-6 text-[15px] leading-relaxed text-ink/85">{DOCS[page].intro}</p>
              <div className="mt-8 space-y-8">
                {DOCS[page].sections.map(([heading, body]) => (
                  <section key={heading}>
                    <h2 className="text-lg font-semibold">{heading}</h2>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
                  </section>
                ))}
              </div>
              <p className="mt-10 rounded-xl bg-canvas p-4 text-sm text-muted">
                Questions about this page? Write to <a href="mailto:legal@riftori.com" className="font-medium text-ink underline underline-offset-2">legal@riftori.com</a> or{' '}
                <button onClick={() => setPage('contact')} className="font-medium text-ink underline underline-offset-2">contact us</button>.
              </p>
            </>
          )}
        </main>
      </div>

      <SiteFooter onLegal={(p) => { setPage(p) }} onStart={onStart} />
    </div>
  )
}

function Contact() {
  const [who, setWho] = useState<'seller' | 'buyer'>('seller')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  return (
    <div className="mt-6">
      <p className="text-[15px] leading-relaxed text-muted">We reply within one working day, Monday to Saturday.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
        {state === 'sent' ? (
          <div className="rounded-2xl bg-accent-soft p-6">
            <Check className="size-6 text-accent" />
            <p className="mt-3 font-semibold">Message sent</p>
            <p className="mt-1 text-sm text-muted">Ticket #RF-20418. We’ll reply to your email within one working day.</p>
            <button onClick={() => setState('idle')} className="mt-4 text-sm font-medium text-accent">Send another</button>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              setState('sending')
              setTimeout(() => setState('sent'), 700)
            }}
          >
            <fieldset>
              <legend className="mb-2 text-sm font-medium">I am a</legend>
              <div className="grid grid-cols-2 rounded-lg bg-canvas p-1">
                {(['seller', 'buyer'] as const).map((w) => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => setWho(w)}
                    className={`h-9 rounded-md text-sm transition-colors duration-150 ease-out ${who === w ? 'bg-surface font-semibold shadow-sm' : 'text-muted'}`}
                  >
                    {w === 'seller' ? 'Seller on Riftori' : 'Buyer from a store'}
                  </button>
                ))}
              </div>
            </fieldset>
            {who === 'buyer' && (
              <p className="rounded-lg bg-warn-soft px-4 py-3 text-sm">
                For anything about an order — delivery, tickets, refunds — message the seller first from their store. If they don’t reply within 48 hours, write to us here with your order number.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" defaultValue="" placeholder="Your name" />
              <Input label="Email" defaultValue="" placeholder="you@example.com" type="email" />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Topic</span>
              <select className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-accent">
                {(who === 'seller' ? ['Setting up my store', 'Payments & Razorpay', 'Billing & plans', 'Report a problem', 'Partnerships'] : ['Order issue', 'Refund request', 'Report a store', 'Other']).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            {who === 'buyer' && <Input label="Order number (optional)" defaultValue="" placeholder="SF-2487" />}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Message</span>
              <textarea required rows={5} placeholder="How can we help?" className="w-full resize-y rounded-lg bg-surface px-3 py-2.5 text-sm ring-1 ring-line outline-none placeholder:text-faint focus:ring-2 focus:ring-accent" />
            </label>
            <button
              type="submit"
              disabled={state === 'sending'}
              className="flex h-11 items-center gap-2 rounded-lg bg-accent px-6 text-sm font-semibold text-white hover:bg-accent-ink disabled:opacity-60"
            >
              {state === 'sending' && <Loader2 className="size-4 animate-spin" />}
              {state === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}

        <aside className="space-y-5 text-sm">
          <Info icon={Mail} title="Email">
            <a href="mailto:support@riftori.com" className="font-medium">support@riftori.com</a>
          </Info>
          <Info icon={Instagram} title="Instagram">
            <a href="https://instagram.com/riftori" className="font-medium">@riftori</a>
          </Info>
          <Info icon={Clock} title="Support hours">Mon–Sat, 10 am – 7 pm IST</Info>
          <Info icon={MapPin} title="Registered office">
            Riftori Technologies Pvt Ltd<br />3rd Floor, 91Springboard, 7th Block, Koramangala, Bengaluru 560095
          </Info>
        </aside>
      </div>
    </div>
  )
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input {...rest} className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none placeholder:text-faint focus:ring-2 focus:ring-accent" />
    </label>
  )
}

function Info({ icon: Icon, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-faint" />
      <div>
        <p className="text-xs text-muted">{title}</p>
        <div className="mt-0.5 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

const DOCS: Record<Exclude<LegalPage, 'contact'>, { intro: string; sections: [string, string][] }> = {
  privacy: {
    intro: 'Riftori Technologies Pvt Ltd (“Riftori”, “we”) runs riftori.com. This policy explains what we collect from sellers and their buyers, why, and the choices you have. We follow the Digital Personal Data Protection Act, 2023.',
    sections: [
      ['What we collect', 'From sellers: name, email, phone, store details, Razorpay account ID and billing information. From buyers: name, email, phone and — for physical orders — delivery address, entered at checkout. We also collect basic device and usage data to keep the service secure.'],
      ['Payments', 'Card and UPI details are handled entirely by Razorpay. Riftori never sees or stores full card numbers or UPI PINs.'],
      ['How we use it', 'To run stores, process orders, send receipts and tickets, prevent fraud and improve Riftori. We don’t sell personal data or use buyers’ data to advertise to them.'],
      ['Who we share it with', 'The seller you buy from receives the details needed to fulfil your order. We use Razorpay for payments and trusted providers for hosting and email, all under contract.'],
      ['Your rights', 'You can ask to access, correct or delete your data at any time by writing to privacy@riftori.com. Buyers can also ask the seller directly.'],
      ['Data retention', 'We keep order records for 8 years as required by Indian tax law, and delete other data within 90 days of an account being closed.'],
    ],
  },
  terms: {
    intro: 'These terms apply to everyone who creates a store on Riftori or buys from one. By using Riftori you agree to them.',
    sections: [
      ['Your account', 'You must be 18 or older and give accurate information. You’re responsible for what happens in your account and for keeping your password safe.'],
      ['Plans and billing', 'Every plan starts with a 14-day free trial. After that, Starter (₹199), Pro (₹499) and Business (₹1,499) are billed monthly in advance, plus GST. Riftori takes no commission on your sales.'],
      ['What you can sell', 'You may sell lawful events, services, digital and physical goods that you have the right to sell. Prohibited items include weapons, drugs, counterfeit goods, adult content and anything restricted under Indian law.'],
      ['Seller responsibilities', 'Sellers are the merchant of record. You’re responsible for delivering what you sell, your own refund policy, taxes and customer support.'],
      ['Suspension', 'We may suspend a store that breaks these terms, receives repeated buyer complaints, or is flagged by Razorpay, and will tell you why.'],
      ['Liability', 'Riftori provides the platform “as is”. To the extent the law allows, our liability is limited to the fees you paid us in the last 3 months.'],
      ['Governing law', 'These terms are governed by the laws of India, with courts in Bengaluru having jurisdiction.'],
    ],
  },
  refund: {
    intro: 'This page covers two things: refunds of your Riftori subscription, and refunds for purchases made from a seller’s store.',
    sections: [
      ['Riftori subscription', 'Cancel anytime from Settings → Plan & billing; your plan runs until the end of the period you paid for. If you’re charged by mistake or cancel within 48 hours of a renewal without making a sale, we refund in full.'],
      ['Purchases from a store', 'Each seller sets their own refund and cancellation policy, shown on the product page before you pay. Refunds are issued by the seller from their Riftori dashboard.'],
      ['How refunds reach you', 'Approved refunds go back to the original payment method through Razorpay, usually within 5–7 working days.'],
      ['If a seller doesn’t respond', 'Contact the seller first. If they haven’t replied in 48 hours, write to support@riftori.com with your order number and we’ll step in.'],
    ],
  },
  disclaimer: {
    intro: 'Riftori is a software platform. We are not the seller of any product, event, meeting or download listed on a store.',
    sections: [
      ['Seller content', 'Descriptions, photos, prices and claims on a store are the seller’s own. Riftori doesn’t verify them and isn’t responsible for their accuracy.'],
      ['Events and meetings', 'Events and meetings are organised by sellers. Riftori isn’t responsible for venues, cancellations, safety or the quality of any session.'],
      ['Earnings', 'Figures on our website are illustrative. Your results depend on your audience, offer and effort.'],
      ['Third-party services', 'Payments are processed by Razorpay; calendar and meeting links rely on Google. Their terms apply to those services.'],
    ],
  },
}

export const args = {
  page: 'privacy',
}

export const argTypes = {
  page: { control: 'radio', options: ['privacy', 'terms', 'refund', 'disclaimer', 'contact'] },
}
