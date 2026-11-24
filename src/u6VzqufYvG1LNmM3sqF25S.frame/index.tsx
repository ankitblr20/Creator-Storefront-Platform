import React, { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ContactButtons, channelsFor } from '../shared/buyer/Contact'
import { STORE, ABOUT, PAST, typeLabel } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onBack?: () => void; onBag?: () => void; onShop?: () => void }

export default function AboutSeller(props: Props) {
  const { contact, focus, bagCount, onBack, onBag, onShop } = { ...args, ...props }
  const pastRef = useRef<HTMLElement>(null)
  const channels = channelsFor(contact)

  useEffect(() => {
    if (focus === 'past') pastRef.current?.scrollIntoView({ block: 'start' })
  }, [focus])

  return (
    <div className="flex h-screen flex-col bg-paper">
      <TopBar bagCount={bagCount} onBack={onBack} onBag={onBag} title={focus === 'past' ? 'Past events' : `About ${STORE.name.split(' ')[0]}`} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl pb-12">
          <div className="relative">
            <img src={STORE.cover} alt="" className="h-36 w-full object-cover sm:mt-4 sm:h-52 sm:rounded-2xl" />
            <img src={STORE.avatar} alt={STORE.name} className="absolute -bottom-10 left-5 size-20 rounded-full border-4 border-paper object-cover" />
          </div>

          <section className="px-5 pt-12">
            <p className="text-sm text-faint">@{STORE.handle} · {STORE.city}</p>
            <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight">{ABOUT.headline}</h1>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/85">
              {ABOUT.story.map((p) => <p key={p}>{p}</p>)}
            </div>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl bg-card py-4 ring-1 ring-line">
              {ABOUT.highlights.map((h) => (
                <div key={h.label} className="px-3 text-center">
                  <dt className="sr-only">{h.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{h.value}</dd>
                  <dd className="text-xs text-muted">{h.label}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Contact — only the channels the seller chose */}
          <section className="mt-8 px-5">
            <h2 className="text-base font-semibold">Get in touch</h2>
            <p className="mt-1 text-sm text-muted">Questions about sizes, colours or a custom order? {STORE.name.split(' ')[0]} usually replies within a few hours.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ContactButtons channels={channels} />
            </div>
          </section>

          {/* Track record */}
          <section ref={pastRef} className="mt-10 scroll-mt-4 px-5">
            <h2 className="text-base font-semibold">Past events & experiences</h2>
            <p className="mt-1 text-sm text-muted">What’s already happened — follow along for the next one.</p>
            <ul className="mt-4 space-y-5">
              {PAST.map((p) => (
                <li key={p.id} className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                  {p.image && <img src={p.image} alt="" className="aspect-[16/9] w-full object-cover" />}
                  <div className="p-4">
                    <p className="text-xs text-faint">{typeLabel(p.type)} · {p.when}</p>
                    <h3 className="mt-0.5 font-semibold">{p.title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{p.outcome}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 px-5">
            <button
              onClick={onShop}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-ink"
            >
              See what’s on now <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export const args = {
  contact: 'instagram only',
  focus: 'top',
  bagCount: 0,
}

export const argTypes = {
  contact: { control: 'radio', options: ['instagram only', 'instagram + email', 'whatsapp + instagram'] },
  focus: { control: 'radio', options: ['top', 'past'] },
  bagCount: { control: 'number' },
}
