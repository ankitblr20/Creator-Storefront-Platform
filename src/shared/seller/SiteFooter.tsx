import React from 'react'
import { Instagram, Twitter, Youtube, Linkedin, Mail, ArrowRight } from 'lucide-react'

export type LegalPage = 'privacy' | 'terms' | 'refund' | 'disclaimer' | 'contact'

export const LEGAL_TITLES: Record<LegalPage, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms & Conditions',
  refund: 'Refund & Cancellation',
  disclaimer: 'Disclaimer',
  contact: 'Contact Us',
}

/** Riftori's public site footer — on the landing page and every legal page */
export function SiteFooter({ onLegal, onStart }: { onLegal?: (page: LegalPage) => void; onStart?: () => void }) {
  const legal = (page: LegalPage) => (e: React.MouseEvent) => {
    e.preventDefault()
    onLegal?.(page)
  }

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-ink">R</span>
              <span className="text-lg font-semibold tracking-tight">Riftori</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              One link to sell events, 1:1 meetings, digital and physical products. ₹199 a month, 0% commission.
            </p>
            <button
              onClick={onStart}
              className="mt-5 flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-white/90"
            >
              Start free trial <ArrowRight className="size-4" />
            </button>
          </div>

          <Column title="Product">
            <Link href="#sell">What you can sell</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#compare">Compare</Link>
            <Link href="#">Help centre</Link>
          </Column>
          <Column title="For sellers">
            <Link href="#sell">Events & tickets</Link>
            <Link href="#sell">1:1 meetings</Link>
            <Link href="#sell">Digital products</Link>
            <Link href="#sell">Physical products</Link>
          </Column>
          <Column title="Company">
            <Link href="#">About Riftori</Link>
            <Link href="#">Careers</Link>
            <Link href="#" onClick={legal('contact')}>Contact us</Link>
            <Link href="#">Our brands</Link>
          </Column>
          <Column title="Legal">
            <Link href="#" onClick={legal('privacy')}>Privacy Policy</Link>
            <Link href="#" onClick={legal('terms')}>Terms & Conditions</Link>
            <Link href="#" onClick={legal('refund')}>Refund & Cancellation</Link>
            <Link href="#" onClick={legal('disclaimer')}>Disclaimer</Link>
          </Column>
        </div>

        {/* Follow + contact */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 py-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Follow us</span>
            <div className="flex gap-1">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full text-white/80 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
          <a href="mailto:support@riftori.com" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <Mail className="size-4" /> support@riftori.com
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-6 text-sm text-white/50">
          <p>Copyright © 2025 Riftori Technologies Pvt Ltd. All rights reserved.</p>
          <p>Made in India · Payments by Razorpay</p>
        </div>
      </div>
    </footer>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </div>
  )
}

function Link({ href, onClick, children }: { href: string; onClick?: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} onClick={onClick} className="text-white/60 transition-colors duration-150 ease-out hover:text-white">
        {children}
      </a>
    </li>
  )
}

const SOCIALS = [
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com/riftori' },
  { label: 'X (Twitter)', icon: Twitter, href: 'https://x.com/riftori' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com/@riftori' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/riftori' },
]
