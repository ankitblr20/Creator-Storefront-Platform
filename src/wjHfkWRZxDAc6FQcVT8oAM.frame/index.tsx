import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Search, X, Lock, Video, Receipt, History, Info } from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ContactButtons, channelsFor } from '../shared/buyer/Contact'
import { ProductCard } from '../shared/buyer/ProductCard'
import { AgentScope } from '../shared/buyer/ShopAgent'
import { STORE, ITEMS, PAST, CATEGORIES, formatINR, moduleOf, type ModuleKey } from '../shared/storefront/data'

type CategoryKey = 'all' | ModuleKey

type Props = Partial<typeof args> & {
  onOpen?: (itemId: string) => void
  onBag?: () => void
  onCategoryChange?: (key: CategoryKey) => void
  onFindOrder?: () => void
  onBookings?: () => void
  onAbout?: (focus: 'top' | 'past') => void
}

export default function StorePage(props: Props) {
  const { state, category: categoryProp, bagCount, menuOpen: menuInitially, sells, contact, agentOpen, wallet, onOpen, onBag, onCategoryChange, onFindOrder, onBookings, onAbout } = { ...args, ...props }
  const channels = channelsFor(contact)
  const go = (fn?: () => void) => () => {
    setMenuOpen(false)
    fn?.()
  }
  const [localCategory, setLocalCategory] = useState<CategoryKey>(categoryProp as CategoryKey)
  const category = (props.onCategoryChange ? categoryProp : localCategory) as CategoryKey
  const setCategory = (k: CategoryKey) => {
    setLocalCategory(k)
    onCategoryChange?.(k)
  }
  const [menuOpen, setMenuOpen] = useState(menuInitially)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')

  if (state === 'not-published') {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-3 bg-paper px-8 py-24 text-center">
        <Lock className="size-6 text-faint" strokeWidth={1.75} />
        <h1 className="font-display text-2xl font-semibold">Nothing here yet</h1>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{STORE.name} hasn't published anything yet. Check back soon, or follow @{STORE.handle} on Instagram.</p>
      </main>
    )
  }

  const sold = SELLS[sells as keyof typeof SELLS] ?? SELLS.everything
  const visible = ITEMS.filter((i) => i.published && sold.includes(moduleOf(i.type)))
  const results = query.trim()
    ? visible.filter((i) => (i.title + ' ' + i.description).toLowerCase().includes(query.toLowerCase()))
    : []
  const featured = visible.find((i) => i.type === 'event' && i.earlyBirdUntil)

  return (
    <AgentScope signedIn={wallet === 'signed in'} startOpen={agentOpen}>
    <main className="relative min-h-full bg-paper pb-10">
      <TopBar bagCount={bagCount} onMenu={() => setMenuOpen(true)} onSearch={() => setSearching(true)} onBag={onBag} agent={state !== 'not-published'} />

      {/* Search */}
      {searching && (
        <div className="sticky top-14 z-20 border-b border-line bg-paper px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center gap-2 rounded-full bg-card px-4 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand">
            <Search className="size-4 text-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patterns, kits, workshops…"
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
            />
            <button aria-label="Close search" onClick={() => { setSearching(false); setQuery('') }} className="text-muted">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {searching && query.trim() ? (
        <section className="mx-auto max-w-5xl px-4 pt-5">
          <p className="text-sm text-muted">{results.length} result{results.length === 1 ? '' : 's'} for "{query}"</p>
          <Grid items={results} onOpen={onOpen} />
        </section>
      ) : (
        <>
          {/* Identity — only on the All tab, so categories get straight to products */}
          {category === 'all' && (
            <section className="mx-auto max-w-5xl px-4 pt-5">
              {/* Compact profile: identity in one row, so the products start above the fold */}
              <div className="flex items-center gap-4">
                <img src={STORE.avatar} alt={STORE.name} className="size-16 shrink-0 rounded-full object-cover ring-2 ring-brand/30 ring-offset-2 ring-offset-paper sm:size-20" />
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{STORE.name}</h1>
                  <p className="mt-0.5 truncate text-sm text-faint">@{STORE.handle} · {STORE.city}</p>
                </div>
              </div>
              <div>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink/85">{STORE.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ContactButtons channels={channels} />
                  <button
                    onClick={() => onAbout?.('top')}
                    className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-medium text-brand-ink transition-colors duration-150 ease-out hover:bg-line/50"
                  >
                    About {STORE.name.split(' ')[0]} <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Category tabs */}
          <nav className={`sticky ${searching ? 'top-[7.75rem]' : 'top-14'} z-10 mt-6 border-b border-line bg-paper/95 backdrop-blur`}>
            <div className="mx-auto flex max-w-5xl gap-1.5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none]">
              {CATEGORIES.map((c) => {
                const count = c.key === 'all' ? visible.length : visible.filter((i) => moduleOf(i.type) === c.key).length
                if (!count) return null
                const active = category === c.key
                return (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-sm transition-colors duration-150 ease-out ${
                      active ? 'bg-ink font-semibold text-white' : 'bg-card text-ink ring-1 ring-line hover:bg-line/50'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </nav>

          {category === 'all' ? (
            <div className="mx-auto max-w-5xl">
              {/* Featured: the time-sensitive offer */}
              {featured && (
              <section className="px-4 pt-6">
                <button
                  onClick={() => onOpen?.(featured.id)}
                  className="group grid w-full overflow-hidden rounded-2xl bg-card text-left ring-1 ring-line sm:grid-cols-2"
                >
                  <div className="aspect-[16/10] overflow-hidden sm:aspect-auto">
                    <img src={featured.image} alt="" className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]" />
                  </div>
                  <div className="flex flex-col p-4 sm:p-6">
                    <p className="text-xs font-semibold text-brand">Next workshop · {featured.seatsLeft} of {featured.seats} seats left</p>
                    <h2 className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">{featured.title}</h2>
                    <p className="mt-1 text-sm text-muted">{featured.when} · {featured.location}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 sm:mt-auto sm:pt-6">
                      <p className="text-base font-semibold">
                        {formatINR(featured.price)}
                        <span className="ml-1.5 text-xs font-normal text-faint line-through">{formatINR(featured.compareAt ?? 0)}</span>
                        <span className="block text-xs font-normal text-muted">Early-bird till {featured.earlyBirdUntil}</span>
                      </p>
                      <span className="flex h-11 shrink-0 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors duration-150 ease-out group-hover:bg-brand-ink">
                        Book seat
                      </span>
                    </div>
                  </div>
                </button>
              </section>
              )}

              {/* One shelf per category */}
              {CATEGORIES.filter((c) => c.key !== 'all').map((c) => {
                const items = visible.filter((i) => moduleOf(i.type) === c.key && i.id !== featured?.id)
                if (!items.length) return null
                return (
                  <section key={c.key} className="pt-9">
                    <div className="flex items-baseline justify-between px-4">
                      <h2 className="text-lg font-semibold tracking-tight">{c.shelf}</h2>
                      <button onClick={() => setCategory(c.key)} className="flex items-center text-sm font-medium text-brand-ink">
                        See all <ChevronRight className="size-4" />
                      </button>
                    </div>
                    {c.key === 'meetings' ? (
                      <CallList items={items} onOpen={onOpen} />
                    ) : (
                      <div className="mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:overflow-visible">
                        {items.map((i) => (
                          <ProductCard key={i.id} item={i} onOpen={onOpen} className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-auto" />
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}

              {/* Track record */}
              <section className="pt-10" id="past">
                <h2 className="px-4 text-lg font-semibold tracking-tight">Past events & experiences</h2>
                <p className="px-4 text-sm text-muted">What you missed — follow along for the next one.</p>
                <div className="mt-3 flex gap-3 overflow-x-auto px-4 [scrollbar-width:none]">
                  {PAST.map((p) => (
                    <div key={p.id} className="w-[64%] shrink-0 sm:w-[38%] lg:w-[30%]">
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                        <img src={p.image} alt="" className="size-full object-cover grayscale-[35%]" />
                      </div>
                      <p className="mt-2 text-xs text-faint">{p.when}</p>
                      <h3 className="text-sm font-semibold">{p.title}</h3>
                      <p className="text-xs text-muted">{p.outcome}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <section className="mx-auto max-w-5xl px-4 pt-5">
              <h1 className="text-xl font-semibold tracking-tight">{CATEGORIES.find((c) => c.key === category)?.shelf}</h1>
              {category === 'meetings' ? (
                <div className="-mx-4"><CallList items={visible.filter((i) => i.type === 'call')} onOpen={onOpen} /></div>
              ) : (
                <Grid items={visible.filter((i) => moduleOf(i.type) === category)} onOpen={onOpen} />
              )}
            </section>
          )}
        </>
      )}

      <footer className="mx-auto mt-14 max-w-5xl px-4 text-center">
        <p className="text-xs text-faint">Powered by Riftori · <a href="#" className="underline underline-offset-2">Create your own store</a></p>
      </footer>

      {/* Menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-xs flex-col overflow-y-auto bg-paper"
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-5">
                <div className="flex items-center gap-2.5">
                  <img src={STORE.avatar} alt="" className="size-9 rounded-full object-cover" />
                  <span className="font-semibold">{STORE.name}</span>
                </div>
                <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-line/70">
                  <X className="size-5" />
                </button>
              </div>
              <p className="px-5 pt-4 text-xs font-semibold text-faint">Shop</p>
              <ul className="px-2 pt-1">
                {CATEGORIES.map((c) => {
                  const count = c.key === 'all' ? visible.length : visible.filter((i) => moduleOf(i.type) === c.key).length
                  if (!count) return null
                  return (
                    <li key={c.key}>
                      <button
                        onClick={() => { setCategory(c.key); setMenuOpen(false) }}
                        className={`flex h-11 w-full items-center justify-between rounded-xl px-3 text-[15px] transition-colors duration-150 ease-out hover:bg-line/60 ${category === c.key ? 'font-semibold' : ''}`}
                      >
                        {c.key === 'all' ? 'Everything' : c.shelf}
                        <span className="text-sm text-faint">{count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className="mx-5 my-3 border-t border-line" />
              <ul className="px-2 text-[15px]">
                <MenuLink icon={Receipt} label="Find my order" onClick={go(onFindOrder)} />
                <MenuLink icon={Video} label="My bookings & tickets" onClick={go(onBookings)} />
                <MenuLink icon={History} label="Past events" onClick={go(() => onAbout?.('past'))} />
                <MenuLink icon={Info} label={`About ${STORE.name.split(' ')[0]}`} onClick={go(() => onAbout?.('top'))} />
              </ul>
              <p className="px-5 pt-4 text-xs font-semibold text-faint">Contact</p>
              <ul className="px-2 pt-1 text-[15px]">
                <ContactButtons channels={channels} variant="row" />
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </main>
    </AgentScope>
  )
}

function Grid({ items, onOpen }: { items: typeof ITEMS; onOpen?: (id: string) => void }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((i) => (
        <ProductCard key={i.id} item={i} onOpen={onOpen} />
      ))}
    </div>
  )
}

function CallList({ items, onOpen }: { items: typeof ITEMS; onOpen?: (id: string) => void }) {
  return (
    <ul className="mx-4 mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
      {items.map((i) => (
        <li key={i.id}>
          <button onClick={() => onOpen?.(i.id)} className="flex w-full items-center gap-3 p-4 text-left transition-colors duration-150 ease-out hover:bg-paper">
            <img src={STORE.avatar} alt="" className="size-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold leading-snug">{i.title}</h3>
              <p className="text-sm text-muted">{i.when}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-semibold">{i.price === 0 ? 'Free' : formatINR(i.price)}</p>
              <p className="text-xs font-medium text-brand-ink">Book</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

function MenuLink({ icon: Icon, label, onClick }: { icon: typeof Info; label: string; onClick?: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="flex h-11 w-full items-center gap-3 rounded-xl px-3 transition-colors duration-150 ease-out hover:bg-line/60">
        <Icon className="size-[18px] text-muted" strokeWidth={1.75} />
        {label}
      </button>
    </li>
  )
}

/** Which modules this seller has published items in — empty modules never show */
const SELLS: Record<string, ModuleKey[]> = {
  everything: ['events', 'meetings', 'digital', 'physical'],
  'events + digital': ['events', 'digital'],
  'physical only': ['physical'],
}

export const args = {
  state: 'default',
  category: 'all',
  sells: 'everything',
  contact: 'instagram only',
  bagCount: 0,
  menuOpen: false,
  agentOpen: false,
  wallet: 'guest',
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'not-published'] },
  category: { control: 'select', options: ['all', 'events', 'meetings', 'digital', 'physical'] },
  sells: { control: 'radio', options: ['everything', 'events + digital', 'physical only'] },
  contact: { control: 'radio', options: ['instagram only', 'instagram + email', 'whatsapp + instagram'] },
  bagCount: { control: 'number' },
  menuOpen: { control: 'boolean' },
  agentOpen: { control: 'boolean' },
  wallet: { control: 'radio', options: ['signed in', 'guest'] },
}
