import { ORDERS, findItem, type Item } from '../storefront/data'

/** One person who bought one item, as the seller sees them */
export type Buyer = {
  name: string
  instagram: string
  email: string
  phone: string
  city: string
  when: string
  amount: number
  /** Variant, ticket, slot or download state */
  detail: string
  status: string
  /** Paid by the buyer's Riftori agent on their behalf */
  viaAgent: boolean
  /** How many times they've bought from this store */
  orders: number
}

const PEOPLE = [
  ['Ananya Rao', 'ananya.makes', 'Mumbai'],
  ['Pooja Desai', 'poojadesai', 'Mumbai'],
  ['Ishita Bose', 'ishita.b', 'Kolkata'],
  ['Zoya Merchant', 'zoyam', 'Mumbai'],
  ['Aditi Shah', 'aditishah_', 'Ahmedabad'],
  ['Farah Sheikh', 'farah.knits', 'Mumbai'],
  ['Neha Kulkarni', 'nehak', 'Pune'],
  ['Ritu Agarwal', 'ritu.agarwal', 'Delhi'],
  ['Kavya Menon', 'kavyamenon', 'Bengaluru'],
  ['Shruti Nair', 'shruti.n', 'Kochi'],
  ['Rohit Iyer', 'rohit.iyer', 'Chennai'],
  ['Megha Joshi', 'megha.j', 'Pune'],
  ['Divya Menon', 'divya.creates', 'Hyderabad'],
  ['Harsh Vora', 'harshvora', 'Surat'],
] as const

const WHEN = ['12 min ago', '1 h ago', '3 h ago', 'Yesterday', 'Yesterday', '2 days ago', '3 days ago', '5 days ago', '1 week ago', '2 weeks ago']

function seed(id: string): number {
  return id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
}

function detailFor(item: Item, i: number): { detail: string; status: string } {
  switch (item.type) {
    case 'physical':
      return { detail: `${item.options?.[i % item.options.length] ?? 'Standard'} · 1 ×`, status: ['New', 'Packed', 'Dispatched', 'Delivered', 'Delivered'][i % 5] }
    case 'digital':
      return { detail: i % 3 === 0 ? 'Not downloaded yet' : `Downloaded ${1 + (i % 3)}×`, status: 'Delivered' }
    case 'call':
      return { detail: ['Tue 10 Jun, 6:00 pm', 'Wed 11 Jun, 11:00 am', 'Fri 13 Jun, 5:00 pm', 'Mon 2 Jun, 6:00 pm'][i % 4], status: i % 4 === 3 ? 'Completed' : 'Upcoming' }
    default:
      return { detail: `${item.tickets?.[i % item.tickets.length]?.name ?? '1 seat'}`, status: 'Upcoming' }
  }
}

/**
 * Who bought this item. Real orders from Orders come first; the rest are the store's
 * regulars, so every item shows the names behind its sales count.
 */
export function buyersFor(itemId: string): Buyer[] {
  const item = findItem(itemId)
  const fromOrders: Buyer[] = ORDERS.filter((o) => o.item === item.title).map((o) => ({
    name: o.buyer,
    instagram: PEOPLE.find((p) => p[0] === o.buyer)?.[1] ?? o.buyer.toLowerCase().replace(/\s+/g, '.'),
    email: o.email,
    phone: o.phone,
    city: PEOPLE.find((p) => p[0] === o.buyer)?.[2] ?? 'Mumbai',
    when: o.when,
    amount: o.amount,
    detail: o.detail,
    status: o.status,
    viaAgent: false,
    orders: 2,
  }))
  const shown = Math.min(item.sold, 8)
  const s = seed(item.id)
  const rest: Buyer[] = []
  for (let i = 0; rest.length + fromOrders.length < shown && i < PEOPLE.length; i++) {
    const [name, instagram, city] = PEOPLE[(s + i * 5) % PEOPLE.length]
    if (fromOrders.some((b) => b.name === name) || rest.some((b) => b.name === name)) continue
    const { detail, status } = detailFor(item, i)
    rest.push({
      name,
      instagram,
      email: `${instagram.replace(/[._]/g, '')}@gmail.com`,
      phone: `+91 98${(s * 7 + i * 131) % 900 + 100} ${(s * 13 + i * 977) % 90000 + 10000}`,
      city,
      when: WHEN[(i + 1) % WHEN.length],
      amount: item.price,
      detail,
      status,
      viaAgent: (s + i) % 3 === 0,
      orders: 1 + ((s + i) % 5),
    })
  }
  return [...fromOrders, ...rest]
}
