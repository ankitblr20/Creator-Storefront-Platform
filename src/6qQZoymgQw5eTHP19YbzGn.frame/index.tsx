import React, { useEffect, useState } from 'react'
import { Loader2, Gift, Check, X } from 'lucide-react'

type Props = Partial<typeof args> & { onSubmit?: () => void; onSignIn?: () => void }

export default function SignUp(props: Props) {
  const { state, category: initialCategory, otp: initialOtp, referral: initialReferral, onSubmit, onSignIn } = { ...args, ...props }
  const [category, setCategory] = useState(initialCategory)
  const [name, setName] = useState('Priya Nair')
  const [email, setEmail] = useState('priya@priyacrochet.in')
  const [phone, setPhone] = useState('98201 44312')
  const [otpStep, setOtpStep] = useState<'idle' | 'sending' | 'sent' | 'verified'>(initialOtp as 'idle' | 'sent' | 'verified')
  const [code, setOtp] = useState(initialOtp === 'verified' ? '482913' : '')
  const [resendIn, setResendIn] = useState(0)
  const [heard, setHeard] = useState(initialReferral ? 'A friend or another seller' : '')
  const [otherHeard, setOtherHeard] = useState('')
  const [refCode, setRefCode] = useState(initialReferral)
  const [codeOpen, setCodeOpen] = useState(Boolean(initialReferral))
  const [google, setGoogle] = useState(false)
  const referrer = REFERRERS[refCode.trim().toUpperCase()]
  const codeTyped = refCode.trim().length >= 4
  const submitting = state === 'submitting'
  const phoneValid = phone.replace(/\D/g, '').length === 10
  const otpWrong = state === 'otp-wrong'

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const sendOtp = () => {
    setOtpStep('sending')
    setTimeout(() => {
      setOtpStep('sent')
      setResendIn(30)
    }, 600)
  }

  const ready = name.trim() && email.includes('@') && otpStep === 'verified' && !submitting

  return (
    <main className="grid min-h-full bg-surface lg:grid-cols-[1fr_minmax(0,520px)]">
      {/* Form */}
      <section className="flex flex-col px-6 py-10 sm:px-12 lg:px-20 lg:py-16">
        <p className="text-sm font-semibold tracking-tight">Riftori</p>

        <div className="my-auto w-full max-w-md pt-12">
          <h1 className="font-display text-[34px] font-semibold leading-tight tracking-tight">Create your account</h1>
          <p className="mt-2 text-[15px] text-muted">14-day free trial, no card needed. You’ll choose your store name and link next.</p>

          {referrer && (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent-soft p-4">
              <Gift className="mt-0.5 size-5 shrink-0 text-accent" />
              <p className="text-sm">
                <span className="font-semibold">{referrer} invited you.</span>{' '}
                <span className="text-muted">You get 2 months free after your trial when you pick a plan.</span>
              </p>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={() => { setGoogle(true); setTimeout(() => onSubmit?.(), 700) }}
            className="mt-8 flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-surface text-sm font-semibold ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas"
          >
            {google ? <Loader2 className="size-4 animate-spin" /> : <GoogleMark />}
            {google ? 'Connecting to Google…' : 'Continue with Google'}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-faint">
            <span className="h-px flex-1 bg-line" /> or sign up with your mobile <span className="h-px flex-1 bg-line" />
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (ready) onSubmit?.()
            }}
          >
            <Input label="Your name" value={name} onChange={setName} placeholder="Full name" />

            {/* Mobile + OTP */}
            <div>
              <span className="mb-1.5 block text-sm font-medium">Mobile number</span>
              <div className="flex gap-2">
                <div className={`flex h-11 min-w-0 flex-1 items-center rounded-lg bg-surface ring-1 focus-within:ring-2 focus-within:ring-accent ${otpStep === 'verified' ? 'ring-accent' : 'ring-line'}`}>
                  <span className="pl-3 pr-2 text-sm text-muted">+91</span>
                  <input
                    inputMode="numeric"
                    value={phone}
                    disabled={otpStep === 'verified'}
                    onChange={(e) => { setPhone(e.target.value.replace(/[^\d ]/g, '').slice(0, 11)); setOtpStep('idle'); setOtp('') }}
                    className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm font-medium tabular-nums outline-none disabled:text-ink"
                  />
                  {otpStep === 'verified' && <span className="mr-3 flex items-center gap-1 text-xs font-semibold text-accent"><Check className="size-3.5" /> Verified</span>}
                </div>
                {otpStep !== 'verified' && (
                  <button
                    type="button"
                    disabled={!phoneValid || otpStep === 'sending' || resendIn > 0}
                    onClick={sendOtp}
                    className="h-11 shrink-0 whitespace-nowrap rounded-lg bg-ink px-4 text-sm font-semibold text-white transition-opacity duration-150 ease-out disabled:opacity-40"
                  >
                    {otpStep === 'sending' ? 'Sending…' : otpStep === 'sent' ? (resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP') : 'Send OTP'}
                  </button>
                )}
              </div>

              {(otpStep === 'sent' || otpWrong) && (
                <div className="mt-3">
                  <span className="mb-1.5 block text-xs text-muted">Enter the 6-digit code sent to +91 {phone}</span>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '')
                        setOtp(v)
                        if (v.length === 6 && !otpWrong) setOtpStep('verified')
                      }}
                      placeholder="••••••"
                      className={`h-11 min-w-0 flex-1 rounded-lg bg-surface px-3 text-center text-lg font-semibold tracking-[0.5em] ring-1 outline-none focus:ring-2 ${otpWrong ? 'ring-warn focus:ring-warn' : 'ring-line focus:ring-accent'}`}
                    />
                  </div>
                  {otpWrong && <span className="mt-1.5 block text-xs text-warn">That code didn’t match. Check the SMS or resend.</span>}
                </div>
              )}
              {otpStep === 'idle' && <span className="mt-1.5 block text-xs text-faint">We’ll text you a code. You’ll also use it to sign in.</span>}
            </div>

            <Input label="Email" type="email" value={email} onChange={setEmail} hint="For receipts, payouts and your plan." />

            <fieldset>
              <legend className="mb-2 text-sm font-medium">What do you do?</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`h-9 rounded-full px-4 text-sm transition-colors duration-150 ease-out ${
                      category === c ? 'bg-ink font-medium text-white' : 'bg-canvas text-ink hover:bg-line'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">How did you hear about us?</span>
              <select
                value={heard}
                onChange={(e) => {
                  setHeard(e.target.value)
                  if (e.target.value === 'A friend or another seller') setCodeOpen(true)
                }}
                className={`h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-accent ${heard ? '' : 'text-faint'}`}
              >
                <option value="" disabled>Choose one</option>
                {HEARD.map((h) => <option key={h} className="text-ink">{h}</option>)}
              </select>
              {heard === 'Other' && (
                <input
                  value={otherHeard}
                  onChange={(e) => setOtherHeard(e.target.value)}
                  placeholder="Tell us where"
                  className="mt-2 h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-accent"
                />
              )}
            </label>

            {codeOpen ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Referral code <span className="font-normal text-faint">(optional)</span></span>
                <div className={`flex h-11 items-center rounded-lg bg-surface ring-1 focus-within:ring-2 ${codeTyped && !referrer ? 'ring-warn focus-within:ring-warn' : 'ring-line focus-within:ring-accent'}`}>
                  <input
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="e.g. PRIYA2M"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold uppercase tracking-wide outline-none placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-faint"
                  />
                  {referrer ? <Check className="mr-3 size-4 text-accent" /> : codeTyped ? <X className="mr-3 size-4 text-warn" /> : null}
                </div>
                <span className={`mt-1.5 block text-xs ${codeTyped && !referrer ? 'text-warn' : 'text-faint'}`}>
                  {referrer ? `Applied — invited by ${referrer}.` : codeTyped ? 'We couldn’t find that code. Check the spelling with your friend.' : 'Got invited by another seller? Enter their code for 2 months free.'}
                </span>
              </label>
            ) : (
              <button type="button" onClick={() => setCodeOpen(true)} className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-ink">
                <Gift className="size-4" /> Have a referral code?
              </button>
            )}

            <button
              type="submit"
              disabled={!ready}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-white transition-[background-color,opacity] duration-150 ease-out hover:bg-accent-ink disabled:opacity-50"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? 'Creating your account…' : otpStep === 'verified' ? 'Create account' : 'Verify your mobile to continue'}
            </button>
            <p className="text-center text-xs text-faint">By continuing you agree to Riftori’s Terms and Privacy Policy.</p>
            <p className="text-center text-sm text-muted">
              Already have an account?{' '}
              <button type="button" onClick={onSignIn} className="font-medium text-ink underline underline-offset-4">
                Sign in
              </button>
            </p>
          </form>
        </div>
      </section>

      {/* What happens next */}
      <aside className="hidden flex-col justify-center gap-10 bg-canvas px-12 py-16 lg:flex">
        <div>
          <p className="text-sm text-muted">Next, in your profile</p>
          <p className="mt-1 font-display text-3xl font-semibold leading-tight tracking-tight">Pick the name buyers see — and your link.</p>
          <p className="mt-3 text-[15px] text-muted">e.g. <span className="font-medium text-ink">Priya Crochet</span> at <span className="font-medium text-ink">riftori.com/priya-crochet</span></p>
        </div>
        <dl className="space-y-5 text-[15px]">
          {POINTS.map((p) => (
            <div key={p.title}>
              <dt className="font-semibold">{p.title}</dt>
              <dd className="mt-0.5 leading-relaxed text-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </main>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none transition-shadow duration-150 ease-out placeholder:text-faint focus:ring-2 focus:ring-accent"
      />
      {hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-[18px]" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

const CATEGORIES = ['Creator', 'Solopreneur', 'Small business', 'Coach', 'Event company', 'Student']

const HEARD = [
  'Instagram',
  'A friend or another seller',
  'Saw “Powered by Riftori” on a store',
  'YouTube',
  'LinkedIn',
  'WhatsApp group',
  'Google search',
  'Other',
]

/** Valid referral codes in this prototype */
const REFERRERS: Record<string, string> = {
  PRIYA2M: 'Priya Crochet',
  RHEA2M: 'Fit with Rhea',
  DEV2M: 'Career with Dev',
}

const POINTS = [
  { title: 'Sell anything from one page', body: 'Workshops, 1:1 calls, PDFs, kits, weekly classes and retreats.' },
  { title: 'Keep every rupee', body: 'No commission on sales. Payments go straight to your bank through Razorpay.' },
  { title: 'Invite friends, earn months', body: 'Every seller you refer who picks a plan gets you 2 months free — and them too.' },
]

export const args = {
  state: 'default',
  category: 'Solopreneur',
  otp: 'idle',
  referral: '',
}

export const argTypes = {
  state: { control: 'radio', options: ['default', 'otp-wrong', 'submitting'] },
  category: { control: 'select', options: ['Creator', 'Solopreneur', 'Small business', 'Coach', 'Event company', 'Student'] },
  otp: { control: 'radio', options: ['idle', 'sent', 'verified'] },
  referral: { control: 'select', options: ['', 'PRIYA2M', 'RHEA2M'] },
}
