import React from 'react'
import { Instagram, MessageCircle, Mail } from 'lucide-react'

import { STORE, CONTACT_PRESETS, type ContactChannel } from '../storefront/data'

const CHANNEL: Record<ContactChannel, { label: string; short: string; icon: typeof Mail; href: string }> = {
  instagram: { label: 'Message on Instagram', short: 'Instagram', icon: Instagram, href: `https://ig.me/m/${STORE.handle}` },
  whatsapp: { label: 'Message on WhatsApp', short: 'WhatsApp', icon: MessageCircle, href: '#' },
  email: { label: 'Send an email', short: 'Email', icon: Mail, href: `mailto:${STORE.email}` },
}

export function channelsFor(preset?: string): ContactChannel[] {
  return CONTACT_PRESETS[preset ?? ''] ?? CONTACT_PRESETS['instagram only']
}

/** Buttons for only the channels the seller has turned on. A phone number is never shown. */
export function ContactButtons({ channels, variant = 'pill' }: { channels: ContactChannel[]; variant?: 'pill' | 'row' }) {
  if (variant === 'row') {
    return (
      <>
        {channels.map((c) => {
          const { label, icon: Icon, href } = CHANNEL[c]
          return (
            <li key={c}>
              <a href={href} className="flex h-11 w-full items-center gap-3 rounded-xl px-3 transition-colors duration-150 ease-out hover:bg-line/60">
                <Icon className="size-[18px] text-muted" strokeWidth={1.75} />
                {label}
              </a>
            </li>
          )
        })}
      </>
    )
  }
  return (
    <>
      {channels.map((c) => {
        const { short, icon: Icon, href } = CHANNEL[c]
        return (
          <a
            key={c}
            href={href}
            className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-4 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-line/50"
          >
            <Icon className="size-4" /> {short}
          </a>
        )
      })}
    </>
  )
}
