import { router, json, error, db } from '@appdeploy/sdk';

const CATALOG = [
  { id: 'p1', name: 'Daily Care Hand Wash', price: 2450, stock: 50 },
  { id: 'p2', name: 'Fresh Breath Toothpaste', price: 1800, stock: 50 },
  { id: 'p3', name: 'Hydrating Face Cream', price: 5200, stock: 20 },
  { id: 'p4', name: 'Baby Gentle Wipes', price: 2100, stock: 50 },
  { id: 'p5', name: 'Home Cleaning Essentials', price: 3500, stock: 25 },
  { id: 'p6', name: 'Soft Cotton Wool', price: 1250, stock: 50 },
  { id: 'p7', name: 'Reusable Water Bottle', price: 4800, stock: 20 },
  { id: 'p8', name: 'Body Lotion', price: 3900, stock: 30 },
  { id: 'p9', name: 'Baby Care Starter Pack', price: 6900, stock: 15 },
  { id: 'p10', name: 'Laundry Detergent', price: 2800, stock: 35 },
  { id: 'p11', name: 'Lunch Storage Set', price: 4200, stock: 20 },
  { id: 'p12', name: 'Pocket Hand Sanitiser', price: 950, stock: 60 },
  { id: 'p13', name: 'Gentle Shampoo', price: 3200, stock: 25 },
  { id: 'p14', name: 'Soft Facial Tissues', price: 1400, stock: 40 },
  { id: 'p15', name: 'Baby Feeding Bottle', price: 4500, stock: 15 },
  { id: 'p16', name: 'Daily Sunscreen', price: 6500, stock: 15 },
  { id: 'p17', name: 'Kitchen Sponge Pack', price: 1200, stock: 30 },
  { id: 'p18', name: 'Travel Toiletry Pouch', price: 3800, stock: 20 },
  { id: 'p19', name: 'Baby Soft Blanket', price: 7800, stock: 12 },
  { id: 'p20', name: 'Reusable Shopping Bag', price: 1600, stock: 35 },
];

export const handler = router({
  'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
  'GET /api/products': [async () => json({ products: CATALOG, mode: 'demo' })],
  'POST /api/orders': [
    async ({ body }) => {
      const payload = body as {
        customer?: {
          name?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
        };
        items?: Array<{ productId?: string; quantity?: number }>;
      };
      const customer = payload?.customer;
      const items = payload?.items;
      if (
        !customer ||
        typeof customer.name !== 'string' ||
        !customer.name.trim() ||
        typeof customer.phone !== 'string' ||
        !customer.phone.trim() ||
        typeof customer.address !== 'string' ||
        !customer.address.trim() ||
        !Array.isArray(items) ||
        items.length === 0 ||
        items.length > 30
      ) {
        return error(
          'Please provide customer details and at least one product.',
          400
        );
      }
      const normalized = [];
      for (const item of items) {
        const product = CATALOG.find(
          candidate => candidate.id === item.productId
        );
        const quantity = Number(item.quantity);
        if (
          !product ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > product.stock
        )
          return error('A product or quantity is invalid or unavailable.', 400);
        normalized.push({
          productId: product.id,
          name: product.name,
          quantity,
          unitPrice: product.price,
          lineTotal: product.price * quantity,
        });
      }
      const subtotal = normalized.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );
      const delivery = subtotal >= 25000 ? 0 : 1500;
      const total = subtotal + delivery;
      const orderId =
        'EMD-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.random().toString(36).slice(2, 6).toUpperCase();
      const record = {
        id: orderId,
        customer: {
          name: customer.name.trim().slice(0, 100),
          phone: customer.phone.trim().slice(0, 40),
          email:
            typeof customer.email === 'string'
              ? customer.email.trim().slice(0, 160)
              : '',
          address: customer.address.trim().slice(0, 300),
          city:
            typeof customer.city === 'string'
              ? customer.city.trim().slice(0, 100)
              : 'Abeokuta',
        },
        items: normalized,
        subtotal,
        delivery,
        total,
        status: 'demo_order_received',
        paymentStatus: 'not_paid_demo',
        createdAt: new Date().toISOString(),
      };
      try {
        const [savedId] = await db.add('emcare_orders', [record]);
        if (!savedId)
          return error('Could not save the demo order. Please try again.', 503);
        return json(
          {
            orderId,
            status: record.status,
            total,
            paymentStatus: 'not paid — demo only',
          },
          201
        );
      } catch (e) {
        console.error('Order persistence failed', e);
        return error(
          'Order storage is not configured. No order was confirmed.',
          503
        );
      }
    },
  ],
});
