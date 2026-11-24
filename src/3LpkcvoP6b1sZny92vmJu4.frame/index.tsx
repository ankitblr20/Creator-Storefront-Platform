import React, { useState } from 'react'
import { Check, ImageUp, ShieldCheck, ExternalLink, Loader2, Instagram, Mail, MessageCircle } from 'lucide-react'

import { Shell, Tabs, type NavKey } from '../shared/seller/Shell'
import { STORE, ITEMS, CATEGORIES, PLATFORM, ABOUT, formatINR, typeLabel } from '../shared/storefront/data'

type Tab = 'profile' | 'payments' | 'look' | 'plan'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void; onConnected?: () => void; onSaved?: () => void }

export default function Settings(props: Props) {
  const { tab: initialTab, razorpay: initialRzp, published, firstTime, onNavigate, onNewItem, onConnected, onSaved } = { ...args, ...props }
  const [tab, setTab] = useState<Tab>(initialTab as Tab)
  const [rzp, setRzp] = useState(initialRzp)
  const [name, setName] = useState(firstTime ? '' : STORE.name)
  const [handle, setHandle] = useState(firstTime ? '' : STORE.slug)
  const [handleEdited, setHandleEdited] = useState(!firstTime)
  const [instagram, setInstagram] = useState(firstTime ? '' : STORE.handle)
  const [ownerName, setOwnerName] = useState('Priya Nair')
  const [email, setEmail] = useState(STORE.email)
  const [phone, setPhone] = useState('98201 44312')
  const [phoneStep, setPhoneStep] = useState<'verified' | 'editing' | 'otp'>('verified')
  const [phoneOtp, setPhoneOtp] = useState('')
  const handleTaken = handle === 'priya'
  const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const [bio, setBio] = useState(STORE.bio)
  const [color, setColor] = useState(STORE.brand)
  const [labels, setLabels] = useState<Record<string, string>>({ events: 'Workshops & retreats', meetings: '1:1 help', digital: 'Patterns & courses', physical: 'Kits & handmade' })
  const [saved, setSaved] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [aboutHeadline, setAboutHeadline] = useState(ABOUT.headline)
  const [story, setStory] = useState(ABOUT.story.join('\n\n'))
  const [highlights, setHighlights] = useState(ABOUT.highlights)
  const [showPast, setShowPast] = useState(true)
  const [channels, setChannels] = useState({ instagram: true, email: false, whatsapp: false })

  const connect = () => {
    setRzp('connecting')
    setTimeout(() => {
      setRzp('connected')
      onConnected?.()
    }, 900)
  }

  return (
    <Shell
      active="settings"
      title="Settings"
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        (tab === 'profile' || tab === 'look') && (
          <div className="flex items-center gap-3">
            {saved && <span className="flex items-center gap-1.5 text-sm text-muted"><Check className="size-4 text-accent" /> Saved</span>}
            <button
              onClick={() => { setSaved(true); onSaved?.() }}
              disabled={tab === 'profile' && (!name.trim() || !handle || handleTaken)}
              className="h-9 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-ink disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        )
      }
    >
      <Tabs<Tab>
        value={tab}
        onChange={(t) => { setTab(t); setSaved(false) }}
        options={[
          { key: 'profile', label: 'Profile' },
          { key: 'payments', label: 'Payment connection' },
          { key: 'look', label: 'Store look' },
          { key: 'plan', label: 'Plan & billing' },
        ]}
      />

      <div className="mt-6">
        {tab === 'plan' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-accent-soft px-5 py-4">
              <div>
                <p className="font-semibold text-accent-ink">Free trial · 12 days left</p>
                <p className="text-sm text-muted">Ends 26 Jun. Your store stays live while you choose — no card on file yet.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {PLANS.map((p) => (
                <div key={p.name} className={`flex flex-col rounded-xl bg-surface p-5 ${plan === p.name ? 'ring-2 ring-accent' : 'ring-1 ring-line'}`}>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.who}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">{p.price}<span className="text-sm font-normal text-muted">/month</span></p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />{f}</li>)}
                  </ul>
                  <div className="mt-auto pt-5">
                    <button
                      onClick={() => setPlan(p.name)}
                      className={`h-10 w-full rounded-lg text-sm font-semibold transition-colors duration-150 ease-out ${plan === p.name ? 'bg-accent text-white' : 'ring-1 ring-line hover:bg-canvas'}`}
                    >
                      {plan === p.name ? 'Selected — starts after trial' : `Choose ${p.name}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Billed monthly by UPI autopay or card. 0% commission on every plan.</p>
          </div>
        )}

        {tab === 'profile' && (
          <div className="max-w-2xl space-y-5">
            {firstTime && (
              <div className="rounded-xl bg-accent-soft px-5 py-4">
                <p className="font-semibold text-accent-ink">Name your store</p>
                <p className="mt-0.5 text-sm text-muted">Buyers see this name, and it becomes your link. Use your Instagram name so followers recognise you.</p>
              </div>
            )}

            {/* Public: what buyers see */}
            <section className="space-y-5">
              <h2 className="text-base font-semibold">Your store <span className="text-sm font-normal text-muted">· public</span></h2>
              <div className="flex items-center gap-4">
                <img src={STORE.avatar} alt="" className="size-16 rounded-full object-cover" />
                <button className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-ink"><ImageUp className="size-4" /> Change photo</button>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Store name</span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!handleEdited) setHandle(slugify(e.target.value))
                  }}
                  placeholder="e.g. Priya Crochet — usually your Instagram name"
                  className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none placeholder:text-faint focus:ring-2 focus:ring-accent"
                />
                <span className="mt-1.5 block text-xs text-faint">Buyers see this on your store, receipts and tickets.</span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Store link</span>
                <div className={`flex h-11 items-center rounded-lg bg-surface ring-1 focus-within:ring-2 ${handleTaken ? 'ring-warn focus-within:ring-warn' : 'ring-line focus-within:ring-accent'}`}>
                  <span className="pl-3 text-sm text-faint">{PLATFORM.domain}/</span>
                  <input
                    value={handle}
                    onChange={(e) => { setHandle(slugify(e.target.value)); setHandleEdited(true) }}
                    className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm font-medium outline-none"
                  />
                  {handle && !handleTaken && <span className="mr-3 flex items-center gap-1 text-xs font-semibold text-accent"><Check className="size-3.5" /> Available</span>}
                </div>
                <span className={`mt-1.5 block text-xs ${handleTaken ? 'text-warn' : 'text-faint'}`}>
                  {handleTaken ? 'That link is taken. Try priya-crochet or priyacrochet.' : firstTime ? 'Filled in from your store name. This goes in your Instagram bio.' : 'Changing this breaks links already in your bio and posts.'}
                </span>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Instagram profile</span>
                <div className="flex h-11 items-center rounded-lg bg-surface ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
                  <span className="pl-3 text-sm text-faint">instagram.com/</span>
                  <input value={instagram} onChange={(e) => setInstagram(e.target.value.replace(/^@/, '').replace(/\s/g, ''))} placeholder="yourhandle" className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm font-medium outline-none placeholder:font-normal placeholder:text-faint" />
                </div>
                <span className="mt-1.5 block text-xs text-faint">Linked from your store so buyers can follow and DM you.</span>
              </label>
            </section>

            {/* Private: how Riftori reaches you */}
            <section className="space-y-5 border-t border-line pt-6">
              <div>
                <h2 className="text-base font-semibold">Your details <span className="text-sm font-normal text-muted">· private</span></h2>
                <p className="mt-0.5 text-sm text-muted">Only the Riftori team uses these to reach you about your account, payments and support. Never shown to buyers.</p>
              </div>
              <Field label="Your name" value={ownerName} onChange={setOwnerName} />
              <div>
                <span className="mb-1.5 block text-sm font-medium">Contact number</span>
                <div className="flex gap-2">
                  <div className={`flex h-11 min-w-0 flex-1 items-center rounded-lg bg-surface ring-1 focus-within:ring-2 focus-within:ring-accent ${phoneStep === 'verified' ? 'ring-line' : 'ring-accent'}`}>
                    <span className="pl-3 pr-2 text-sm text-muted">+91</span>
                    <input
                      inputMode="numeric"
                      value={phone}
                      disabled={phoneStep === 'verified'}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, '').slice(0, 11))}
                      className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm font-medium tabular-nums outline-none disabled:text-ink"
                    />
                    {phoneStep === 'verified' && <span className="mr-3 flex items-center gap-1 text-xs font-semibold text-accent"><Check className="size-3.5" /> Verified</span>}
                  </div>
                  {phoneStep === 'verified' ? (
                    <button onClick={() => { setPhoneStep('editing'); setPhoneOtp('') }} className="h-11 rounded-lg px-4 text-sm font-medium ring-1 ring-line hover:bg-canvas">Change</button>
                  ) : phoneStep === 'editing' ? (
                    <button disabled={phone.replace(/\D/g, '').length !== 10} onClick={() => setPhoneStep('otp')} className="h-11 whitespace-nowrap rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40">Send OTP</button>
                  ) : null}
                </div>
                {phoneStep === 'otp' && (
                  <div className="mt-3">
                    <span className="mb-1.5 block text-xs text-muted">Enter the 6-digit code sent to +91 {phone}</span>
                    <input
                      autoFocus
                      inputMode="numeric"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '')
                        setPhoneOtp(v)
                        if (v.length === 6) setPhoneStep('verified')
                      }}
                      placeholder="••••••"
                      className="h-11 w-48 rounded-lg bg-surface px-3 text-center text-lg font-semibold tracking-[0.5em] ring-1 ring-line outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                )}
                <span className="mt-1.5 block text-xs text-faint">We call or WhatsApp this number for urgent account and payout issues.</span>
              </div>
              <Field label="Email" value={email} onChange={setEmail} />
              <div>
                <span className="mb-1.5 block text-sm font-medium">Sign-in methods</span>
                <ul className="divide-y divide-line rounded-xl bg-surface ring-1 ring-line">
                  <li className="flex items-center gap-3 px-4 py-3 text-sm">
                    <span className="grid size-8 place-items-center rounded-full bg-canvas text-xs font-bold">G</span>
                    <span className="min-w-0 flex-1"><span className="font-medium">Google</span> <span className="text-muted">· {email}</span></span>
                    <span className="text-xs font-semibold text-accent">Connected</span>
                  </li>
                  <li className="flex items-center gap-3 px-4 py-3 text-sm">
                    <span className="grid size-8 place-items-center rounded-full bg-canvas text-xs font-bold">#</span>
                    <span className="min-w-0 flex-1"><span className="font-medium">Mobile OTP</span> <span className="text-muted">· +91 {phone}</span></span>
                    <span className="text-xs font-semibold text-accent">On</span>
                  </li>
                </ul>
              </div>
            </section>

            <label className="block border-t border-line pt-6">
              <span className="mb-1.5 block text-sm font-medium">Short bio</span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm leading-relaxed ring-1 ring-line outline-none focus:ring-2 focus:ring-accent" />
              <span className="mt-1.5 block text-xs text-faint">{bio.length}/160 · shown at the top of your store</span>
            </label>

            {/* About page */}
            <section className="border-t border-line pt-6">
              <h2 className="text-base font-semibold">About page</h2>
              <p className="mt-0.5 text-sm text-muted">Buyers open this from your store menu and from every product. Tell them who you are and why they can trust you.</p>
              <div className="mt-4 space-y-4">
                <Field label="Headline" value={aboutHeadline} onChange={setAboutHeadline} />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Your story</span>
                  <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={6} className="w-full resize-y rounded-lg bg-surface px-3 py-2.5 text-sm leading-relaxed ring-1 ring-line outline-none focus:ring-2 focus:ring-accent" />
                </label>
                <div>
                  <span className="mb-1.5 block text-sm font-medium">Highlights</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex gap-1.5 rounded-lg bg-surface p-1.5 ring-1 ring-line">
                        <input value={h.value} onChange={(e) => setHighlights((all) => all.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className="h-9 w-16 rounded-md bg-canvas px-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-accent" />
                        <input value={h.label} onChange={(e) => setHighlights((all) => all.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className="h-9 min-w-0 flex-1 rounded-md px-2 text-sm outline-none focus:ring-2 focus:ring-accent" />
                      </div>
                    ))}
                  </div>
                </div>
                <label className="flex items-center justify-between gap-4 rounded-lg bg-surface px-4 py-3 ring-1 ring-line">
                  <span className="text-sm"><span className="font-medium">Show past events</span> <span className="text-muted">— your track record on the About page</span></span>
                  <Toggle on={showPast} onChange={setShowPast} label="Show past events" />
                </label>
              </div>
            </section>

            {/* Contact */}
            <section className="border-t border-line pt-6">
              <h2 className="text-base font-semibold">How buyers can reach you</h2>
              <p className="mt-0.5 text-sm text-muted">Only what you turn on is shown. Your phone number is never visible unless you switch on WhatsApp.</p>
              <ul className="mt-4 divide-y divide-line rounded-xl bg-surface ring-1 ring-line">
                {CHANNELS.map((c) => (
                  <li key={c.key} className="flex items-center gap-4 px-4 py-3.5">
                    <c.icon className="size-5 shrink-0 text-muted" strokeWidth={1.75} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{c.label}</p>
                      <p className="truncate text-xs text-muted">{c.detail}</p>
                    </div>
                    <Toggle on={channels[c.key]} onChange={(v) => setChannels((s) => ({ ...s, [c.key]: v }))} label={c.label} />
                  </li>
                ))}
              </ul>
              {!channels.instagram && !channels.whatsapp && !channels.email && (
                <p className="mt-2 text-sm text-warn">Turn on at least one way to reach you — buyers often ask before they pay.</p>
              )}
            </section>
          </div>
        )}

        {tab === 'payments' && (
          <div className="max-w-2xl">
            <section className="rounded-xl bg-surface p-6 ring-1 ring-line">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#0c2451] text-sm font-bold text-white">R</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Razorpay</p>
                  <p className="text-sm text-muted">UPI, cards and net banking. Money settles straight to your bank — {PLATFORM.name} never holds it.</p>
                </div>
              </div>
              {rzp === 'connected' ? (
                <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="flex items-center gap-1.5 font-medium text-accent"><ShieldCheck className="size-4" /> Live payments on</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Merchant</dt><dd className="font-medium">Priya Crochet Studio</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Account</dt><dd className="font-mono text-xs">acc_PriyaCrochet</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Settles to</dt><dd className="font-medium">HDFC Bank ••4410 · T+2</dd></div>
                  <a href="#" className="mt-3 flex items-center gap-1.5 font-medium text-accent"><ExternalLink className="size-4" /> Open Razorpay dashboard</a>
                </dl>
              ) : (
                <div className="mt-5 border-t border-line pt-5">
                  <ol className="space-y-1.5 text-sm text-muted">
                    <li>1. Sign in to Razorpay, or create a free account with your PAN and bank details.</li>
                    <li>2. Approve {PLATFORM.name} to create payments on your behalf.</li>
                    <li>3. You're back here, ready to sell.</li>
                  </ol>
                  <button
                    onClick={connect}
                    disabled={rzp === 'connecting'}
                    className="mt-5 flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-ink disabled:opacity-60"
                  >
                    {rzp === 'connecting' && <Loader2 className="size-4 animate-spin" />}
                    {rzp === 'connecting' ? 'Waiting for Razorpay…' : 'Connect Razorpay'}
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'look' && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-8">
              <section>
                <h2 className="text-sm font-medium">Accent colour</h2>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {SWATCHES.map((s) => (
                    <button key={s} aria-label={s} onClick={() => setColor(s)} className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: s, boxShadow: color === s ? `0 0 0 2px var(--color-canvas), 0 0 0 4px ${s}` : undefined }}>
                      {color === s && <Check className="size-4 text-white" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-sm font-medium">Category labels</h2>
                <p className="mt-0.5 text-xs text-faint">What buyers see on each tab. Tabs with nothing published stay hidden.</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                    <Field key={c.key} label={c.label} value={labels[c.key]} onChange={(v) => setLabels((l) => ({ ...l, [c.key]: v }))} />
                  ))}
                </div>
              </section>
            </div>
            <aside>
              <p className="mb-3 text-sm text-muted">Preview</p>
              <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
                <div className="flex items-center gap-3">
                  <img src={STORE.avatar} alt="" className="size-10 rounded-full object-cover" />
                  <p className="font-display text-lg font-semibold">{name}</p>
                </div>
                <div className="mt-3 flex gap-1.5 overflow-hidden text-[11px]">
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-white" style={{ backgroundColor: color }}>All</span>
                  {Object.values(labels).slice(0, 2).map((l) => <span key={l} className="shrink-0 truncate rounded-full bg-white px-2.5 py-1 ring-1 ring-[#ebe3da]">{l}</span>)}
                </div>
                <div className="mt-3 space-y-2">
                  {ITEMS.slice(2, 5).map((i) => (
                    <div key={i.id} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-[#ebe3da]">
                      <img src={i.image} alt="" className="size-10 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium" style={{ color }}>{typeLabel(i.type)}</p>
                        <p className="truncate text-xs font-semibold">{i.title}</p>
                      </div>
                      <p className="text-xs font-semibold">{formatINR(i.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Shell>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input value={value} readOnly={!onChange} onChange={(e) => onChange?.(e.target.value)} className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-accent" />
    </label>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-150 ease-out ${on ? 'bg-accent' : 'bg-line'}`}
    >
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  )
}

const CHANNELS = [
  { key: 'instagram' as const, label: 'Instagram DM', detail: `Opens a chat with @${STORE.handle}`, icon: Instagram },
  { key: 'email' as const, label: 'Email', detail: STORE.email, icon: Mail },
  { key: 'whatsapp' as const, label: 'WhatsApp', detail: 'Shows a WhatsApp chat button — your number is visible to the buyer', icon: MessageCircle },
]

const PLANS = [
  { name: 'Starter', price: '₹199', who: 'Students, artists, micro-influencers', features: ['All four selling modules', '2 GB storage', 'UPI / Razorpay'] },
  { name: 'Pro', price: '₹499', who: 'Experts, event hosts, course creators', features: ['Custom domain', '15 GB storage', 'International payments'] },
  { name: 'Business', price: '₹1,499', who: 'Brands and agencies', features: ['Shipping tracking', '50 GB storage', 'Team logins'] },
]

const SWATCHES = ['#b4472f', '#a2366b', '#3f5aa8', '#1d6b5c', '#7a5a1e', '#2b2b2b']

export const args = {
  firstTime: false,
  tab: 'profile',
  razorpay: 'connected',
  published: true,
}

export const argTypes = {
  firstTime: { control: 'boolean' },
  tab: { control: 'radio', options: ['profile', 'payments', 'look', 'plan'] },
  razorpay: { control: 'radio', options: ['connected', 'not connected'] },
  published: { control: 'boolean' },
}
