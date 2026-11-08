-- EMCARE Supabase schema
-- Run this in Supabase SQL Editor. Never expose the service_role key in the browser.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  delivery_address text not null,
  city text not null,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null check (delivery_fee >= 0),
  total integer not null check (total = subtotal + delivery_fee),
  status text not null default 'pending' check (status in ('pending','confirmed','processing','completed','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','refunded')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Customers can read their own orders" on public.orders;
create policy "Customers can read their own orders"
  on public.orders for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Customers can create their own orders" on public.orders;
create policy "Customers can create their own orders"
  on public.orders for insert to authenticated
  with check (auth.uid() = user_id);

-- Customers cannot update payment status, totals, or order status from the browser.
