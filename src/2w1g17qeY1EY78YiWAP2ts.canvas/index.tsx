import BuyerStorefront from '../wqJs3sHLwCMSgKD86zcA8A.prototype'
import SellerDashboard from '../i6Lo85ePZvUTNgnpoueeFQ.prototype'
import AdminConsole from '../oWzDKayonPNUMHhKczbj2n.prototype'
import BuyerAgent from '../59BVEiSt85XdZRo7qzUzKU.prototype'

export const placements = [
  note({ id: 'title', x: 0, y: -260, width: 1870 }, 'Riftori — Priya Crochet', { fontSize: 56, fontWeight: 'bold' }),
  note({ id: 'buyer-label', x: 0, y: -120, width: 390 }, 'Buyer: one link → module → item → checkout → QR ticket, booking, download or delivery status', { fontSize: 24, color: '#60646C' }),
  note({ id: 'seller-label', x: 590, y: -120, width: 1280 }, 'Seller: landing → sign up → connect Razorpay → publish first item → manage orders, customers and fulfilment', { fontSize: 24, color: '#60646C' }),
  note({ id: 'admin-label', x: 2070, y: -120, width: 1280 }, 'Riftori team: platform overview → sellers → buyers & orders → payments → subscriptions → support → risk', { fontSize: 24, color: '#60646C' }),
  note({ id: 'buyer-agent-label', x: 3550, y: -120, width: 390 }, 'Buyer agent: ask → agent fills your details → pay from wallet → every order, ticket and shop (and its Instagram) in one app', { fontSize: 24, color: '#60646C' }),
  place(BuyerStorefront, { id: 'buyer', x: 0, y: 0 }),
  place(SellerDashboard, { id: 'seller', x: 590, y: 0 }),
  place(AdminConsole, { id: 'admin', x: 2070, y: 0 }),
  place(BuyerAgent, { id: 'buyer-agent', x: 3550, y: 0 }),
]
