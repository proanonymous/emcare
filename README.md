# EMCARE Pharmacy & Stores

Responsive React + Vite storefront with optional Supabase customer authentication and order storage.

## Local development

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill in the Supabase project URL and publishable/anon key.
5. Run `npm run dev`.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the SQL in `supabase/schema.sql`.
4. Copy the Project URL and publishable key (or legacy anon key) into `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

5. In Supabase Authentication settings, configure the site URL and allowed redirect URLs for your deployed site.
6. Configure email confirmation and SMTP according to the store's needs.

The app uses Supabase Auth for email/password accounts. Orders are inserted into `public.orders` under the signed-in customer's user ID. Row Level Security lets customers read their own orders and create orders for themselves. The browser cannot update order or payment status.

## Deployment

Add the two `VITE_SUPABASE_*` variables to the hosting provider's environment settings for the production deployment, then run a fresh build/deploy.

## Security notes

- Never put a Supabase `service_role` key in frontend code or any `VITE_*` variable.
- The publishable/anon key is intended for browser use when Row Level Security is correctly enabled.
- Payment collection is not implemented. An order is saved as unpaid/pending; the store must confirm stock, delivery and payment separately.
- The product catalogue and prices are currently sample data in `src/App.tsx`; replace them with verified store inventory before accepting real customer orders.
- No admin dashboard or product-management interface is included yet.
