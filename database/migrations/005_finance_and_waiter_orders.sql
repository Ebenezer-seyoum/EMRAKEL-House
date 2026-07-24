create extension if not exists pgcrypto;

create table if not exists public.restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  table_number text not null unique,
  seats integer not null default 4 check (seats > 0),
  status text not null default 'available' check (status in ('available', 'occupied', 'reserved', 'closed')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.income_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  category text not null default 'food_sales',
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  payment_method text not null default 'cash',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(order_id)
);

create table if not exists public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.expense_categories(id) on delete restrict,
  category text not null default 'Other',
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  payment_method text not null default 'cash',
  expense_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'voided')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists table_number text;
alter table public.orders add column if not exists waiter_name text;
alter table public.orders add column if not exists payment_method text default 'cash';
alter table public.orders add column if not exists paid_at timestamptz;

insert into public.expense_categories (name) values
  ('Ingredients'), ('Maintenance'), ('Salaries'), ('Rent'), ('Utilities'), ('Transport'), ('Marketing'), ('Other')
on conflict (name) do nothing;

insert into public.restaurant_tables (table_number, seats)
select value, 4 from unnest(array['1','2','3','4','5','6','7','8','9','10']) as value
on conflict (table_number) do nothing;

create index if not exists income_transactions_date_idx on public.income_transactions (transaction_date desc);
create index if not exists expenses_date_idx on public.expenses (expense_date desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);
