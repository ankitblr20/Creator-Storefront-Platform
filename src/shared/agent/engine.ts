import { PRODUCTS, SHOPS, productBy, shopBy, formatINR, type Order, type Product } from './data'

/**
 * The agent's brain for the prototype: reads what the buyer typed, plus where they are
 * (a shop, a product), and decides what to show. A real build swaps this for a model with
 * the same tools: search the catalogue, search the web, open a shop, start a checkout.
 */

export type WebResult = { source: string; finding: string }

export type Card =
  | { type: 'checkout'; productId: string; topic?: string }
  | { type: 'picks'; productIds: string[] }
  | { type: 'web'; results: WebResult[] }
  | { type: 'shop'; handle: string }
  | { type: 'orders'; ids: string[] }

export type Turn = { from: 'you'; text: string } | { from: 'agent'; text: string; card?: Card }

export type Context = { shop?: string; productId?: string; orders: Order[] }

const SHOP_WORDS: Record<string, string[]> = {
  'priya.crochet': ['priya', 'crochet', 'yarn', 'amigurumi'],
  'mitti.ceramics': ['mitti', 'ceramic', 'ceramics', 'pottery', 'mug', 'mugs'],
  'kaafi.roasters': ['kaafi', 'coffee', 'roaster', 'roasters', 'beans'],
  'bandra.thrift': ['bandra', 'thrift', 'vintage', 'denim', 'jacket'],
  'inkpot.studio': ['inkpot', 'print', 'prints', 'sketchbook'],
}

function words(t: string): string[] {
  return t.toLowerCase().replace(/[^a-z0-9@.\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2)
}

export function findShop(text: string): string | undefined {
  const t = text.toLowerCase()
  const byHandle = SHOPS.find((s) => t.includes(s.handle) || t.includes('@' + s.handle.split('.')[0]))
  if (byHandle) return byHandle.handle
  const w = words(text)
  return Object.entries(SHOP_WORDS).find(([, list]) => list.some((x) => w.includes(x)))?.[0]
}

/** Best product for the words, preferring the shop the buyer is in */
export function findProduct(text: string, shop?: string): Product | undefined {
  const w = words(text).filter((x) => !['the', 'buy', 'book', 'get', 'for', 'and', 'me', 'my', 'please', 'want', 'from', 'with', 'this', 'that', 'one'].includes(x))
  let best: { p: Product; score: number } | undefined
  for (const p of PRODUCTS) {
    const hay = (p.title + ' ' + p.about + ' ' + p.shop).toLowerCase()
    let score = w.reduce((s, x) => s + (p.title.toLowerCase().includes(x) ? 3 : hay.includes(x) ? 1 : 0), 0)
    if (shop && p.shop === shop) score += 0.5
    if (score > 0 && (!best || score > best.score)) best = { p, score }
  }
  return best && best.score >= 2 ? best.p : undefined
}

export function respond(text: string, ctx: Context): Turn {
  const t = text.toLowerCase()
  const mentionedShop = findShop(text)
  const shop = mentionedShop ?? ctx.shop

  // My orders, tickets, deliveries
  if (/(my orders?|where('?s| is)|track|my tickets?|my bookings?|delivery status|when (does|will))/.test(t)) {
    const list = ctx.orders.filter((o) => !shop || !mentionedShop || o.shop === shop)
    const active = list.filter((o) => o.status !== 'Delivered' && o.status !== 'Completed')
    return {
      from: 'agent',
      text: active.length
        ? `You have ${active.length} order${active.length === 1 ? '' : 's'} in progress. Tap one for the ticket, tracking or meeting link.`
        : 'Nothing in progress right now — everything has arrived.',
      card: { type: 'orders', ids: (active.length ? active : list).slice(0, 4).map((o) => o.id) },
    }
  }

  // Open a shop or its Instagram
  if (/(instagram|insta\b|open|visit|go to|take me)/.test(t) && mentionedShop) {
    const s = shopBy(mentionedShop)
    return { from: 'agent', text: `Here’s ${s.name}. Open their shop here, or jump to @${s.handle} on Instagram.`, card: { type: 'shop', handle: s.handle } }
  }

  // Search the web
  if (/(compare|review|internet|web|online|cheaper|legit|google|search)/.test(t)) {
    const p = findProduct(text, shop) ?? (ctx.productId ? productBy(ctx.productId) : undefined)
    const s = shopBy(p?.shop ?? shop ?? 'priya.crochet')
    return {
      from: 'agent',
      text: p
        ? `I checked the web for “${p.title}”. ${s.name}’s price is fair for what’s included, and buyers outside Riftori rate it well.`
        : `I checked ${s.name} outside Riftori. Verified on Instagram, ${s.followers} followers, and good word from past buyers.`,
      card: { type: 'web', results: web(p, s.handle) },
    }
  }

  // Buy or book
  if (/(buy|book|reserve|reorder|purchase|order it|get me|get it|checkout|pay for|i'?ll take|add to)/.test(t)) {
    const p =
      findProduct(text, shop) ??
      (/reorder|usual|coffee/.test(t) ? productBy('kaafi-ratnagiri') : undefined) ??
      (/mugs?/.test(t) ? productBy('mitti-mug') : undefined) ??
      (ctx.productId ? productBy(ctx.productId) : undefined)
    if (!p) {
      const pool = PRODUCTS.filter((x) => !shop || x.shop === shop).slice(0, 4)
      return { from: 'agent', text: 'Which one should I get? Tap it and I’ll set up the order.', card: { type: 'picks', productIds: pool.map((x) => x.id) } }
    }
    const topic = p.kind === 'call' ? topicFrom(text) : undefined
    return { from: 'agent', text: lead(p), card: { type: 'checkout', productId: p.id, topic } }
  }

  // Find / recommend
  if (/(find|gift|recommend|suggest|show|under|cheap|something|ideas?)/.test(t)) {
    const cap = Number((t.match(/under\s*₹?\s*([\d,]+)/)?.[1] ?? '').replace(/,/g, '')) || undefined
    const pool = PRODUCTS.filter((x) => (!mentionedShop || x.shop === mentionedShop) && (!cap || x.price <= cap) && x.price > 0)
      .filter((x) => !/gift/.test(t) || x.kind === 'physical')
      .slice(0, 4)
    return {
      from: 'agent',
      text: pool.length ? `${pool.length} I think you’ll like${cap ? ` under ${formatINR(cap)}` : ''}. Tap one to buy it.` : 'Nothing matches that yet. Try a different budget or shop.',
      card: { type: 'picks', productIds: pool.map((x) => x.id) },
    }
  }

  // A question about a product
  const p = findProduct(text, shop) ?? (ctx.productId ? productBy(ctx.productId) : undefined)
  if (p) {
    return { from: 'agent', text: `${p.about}${p.kind === 'physical' && p.dispatch ? ` ${p.dispatch}.` : ''}${p.when ? ` ${p.when}${p.location ? `, ${p.location}` : ''}.` : ''} Want me to get it?`, card: { type: 'picks', productIds: [p.id] } }
  }

  if (mentionedShop) {
    return { from: 'agent', text: `Here’s ${shopBy(mentionedShop).name}.`, card: { type: 'shop', handle: mentionedShop } }
  }

  return {
    from: 'agent',
    text: 'I can buy or book from any Riftori shop, track your orders, compare prices on the web, or open a shop or its Instagram. Try “book Saturday’s workshop” or “where is my coffee?”',
  }
}

function lead(p: Product): string {
  switch (p.kind) {
    case 'event':
      return `Let’s book it. Pick a ticket and tell me who’s coming — I’ve filled in you.`
    case 'call':
      return 'I picked the first free slot. Add what you want help with so the seller can prepare.'
    case 'digital':
      return 'It’s an instant download. I’ll send it to your email too.'
    default:
      return 'Here’s the order. Check the colour and where it should go — I’ve filled in your saved details.'
  }
}

function topicFrom(text: string): string | undefined {
  const m = text.match(/(?:about|for|on|with)\s+(.{6,})$/i)
  return m ? m[1].replace(/[.?!]+$/, '') : undefined
}

function web(p: Product | undefined, handle: string): WebResult[] {
  if (p?.kind === 'event') {
    return [
      { source: 'insider.in', finding: `Similar workshops nearby cost ${formatINR(Math.round(p.price * 0.85))} – ${formatINR(Math.round(p.price * 1.5))}` },
      { source: 'google.com/maps', finding: `${p.location ?? 'Venue'} · rated 4.7 by 312 people` },
      { source: 'reddit.com', finding: '“Small group and a patient teacher — worth it for a first try”' },
    ]
  }
  if (p?.kind === 'digital') {
    return [
      { source: 'etsy.com', finding: `Similar files sell for ${formatINR(Math.round(p.price * 0.7))} – ${formatINR(Math.round(p.price * 1.8))}` },
      { source: 'ravelry.com', finding: 'Rated 4.8 by 96 makers · “clearest steps I’ve followed”' },
    ]
  }
  if (p) {
    return [
      { source: 'amazon.in', finding: `Closest match: ${formatINR(Math.round(p.price * 0.8))} – ${formatINR(Math.round(p.price * 1.3))}, mass-made` },
      { source: 'reddit.com', finding: '“Small makers pack better and actually answer DMs”' },
      { source: `instagram.com/${handle}`, finding: 'Buyers tagged the shop in 200+ posts this year' },
    ]
  }
  const s = shopBy(handle)
  return [
    { source: `instagram.com/${handle}`, finding: `Verified · ${s.followers} followers · posting since 2019` },
    { source: 'google.com', finding: `${s.name} featured in local maker round-ups` },
    { source: 'reddit.com', finding: '“Ordered twice, both arrived well packed and on time”' },
  ]
}

export function suggestionsFor(ctx: { shop?: string; productId?: string }): string[] {
  if (ctx.productId) {
    const p = productBy(ctx.productId)
    return [
      p.kind === 'event' ? `Book ${p.title}` : p.kind === 'call' ? `Book the ${p.title.toLowerCase()}` : `Buy the ${p.title.toLowerCase()}`,
      'Compare prices and reviews online',
      p.kind === 'physical' ? 'When would it reach me?' : p.kind === 'event' ? 'What should I bring?' : 'What do I get?',
    ]
  }
  if (ctx.shop) {
    const s = shopBy(ctx.shop)
    const first = PRODUCTS.find((x) => x.shop === ctx.shop)
    return [first ? `Buy the ${first.title.toLowerCase()}` : 'What do they sell?', `Is ${s.name} legit? Check online`, `Open @${s.handle} on Instagram`]
  }
  return ['Book Saturday’s amigurumi workshop', 'Where is my coffee?', 'Find a gift under ₹1,000', 'Open Mitti Ceramics on Instagram']
}
