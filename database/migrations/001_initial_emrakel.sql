create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.table_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  booking_date date not null,
  booking_time time not null,
  guests integer not null check (guests > 0),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  order_type text not null default 'pickup' check (order_type in ('pickup', 'delivery', 'dine_in')),
  address text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) not null default 0 check (total_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.gallery_images enable row level security;
alter table public.table_bookings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public can read active categories" on public.menu_categories
  for select using (is_active = true);

create policy "Public can read available menu items" on public.menu_items
  for select using (is_available = true);

create policy "Public can read active gallery images" on public.gallery_images
  for select using (is_active = true);

create policy "Public can read site settings" on public.site_settings
  for select using (true);

create policy "Customers can create bookings" on public.table_bookings
  for insert with check (true);

create policy "Customers can create orders" on public.orders
  for insert with check (true);

create policy "Customers can create order items" on public.order_items
  for insert with check (true);

insert into public.menu_categories (slug, name, sort_order)
values
  ('burgers', 'Burgers', 1),
  ('pizza', 'Pizza', 2),
  ('cocktails', 'Cocktails', 3)
on conflict (slug) do nothing;

insert into public.site_settings (setting_key, setting_value)
values
  ('brand', '{"name":"EMRAKEL","subtitle":"Burger, Pizza & Cocktail House"}'),
  ('home', '{"headline":"Burgers, stone-style pizza, and crafted cocktails in one warm house."}')
on conflict (setting_key) do nothing;
