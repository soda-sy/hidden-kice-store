create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text,
  thumbnail_url text,
  original_price integer not null check (original_price >= 0),
  sale_price integer not null check (sale_price >= 0),
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_sale_price_not_above_original check (sale_price <= original_price)
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_active_display_order_idx
  on public.products (display_order, id) where is_active;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;

revoke insert, update, delete, truncate on public.categories from anon, authenticated;
revoke insert, update, delete, truncate on public.products from anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;

drop policy if exists "Active categories are viewable by everyone" on public.categories;
create policy "Active categories are viewable by everyone"
  on public.categories for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Active products are viewable by everyone" on public.products;
create policy "Active products are viewable by everyone"
  on public.products for select
  to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.categories c
      where c.id = products.category_id and c.is_active
    )
  );
