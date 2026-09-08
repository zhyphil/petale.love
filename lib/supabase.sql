-- petale · Supabase 数据库初始化
-- 在 Supabase Dashboard → SQL Editor → New query 跑这个文件
-- 包含：表创建 + 索引 + RLS 策略 + Storage 策略

-- ===== 1. 启用 UUID 生成 =====
create extension if not exists "uuid-ossp";

-- ===== 2. 数据表 =====

-- Waitlist（邮件订阅）
create table if not exists waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  locale text default 'fr-FR',
  source text,
  referrer text,
  utm jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_waitlist_email on waitlist(email);
create index if not exists idx_waitlist_created_at on waitlist(created_at desc);

-- Pet uploads（用户上传的宠物照片）
create table if not exists pet_uploads (
  id uuid primary key default uuid_generate_v4(),
  user_email text,
  storage_path text not null,        -- Supabase Storage path (e.g. "1234-abc.jpg")
  public_url text not null,           -- public URL for Replicate
  previews jsonb,                     -- 3 张免费预览的 URL
  paid boolean default false,
  paid_order_id uuid,                 -- FK to orders
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')  -- 30 天自动过期
);
create index if not exists idx_pet_uploads_created_at on pet_uploads(created_at desc);
create index if not exists idx_pet_uploads_user_email on pet_uploads(user_email);

-- Orders（Stripe 订单）
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  amount_cents integer not null default 999,
  currency text default 'eur',
  status text default 'pending',        -- pending|completed|refunded|failed
  image_url text,                       -- 原图 URL
  style_pack text default 'standard',   -- standard|seasonal
  metadata jsonb,
  created_at timestamptz default now(),
  refunded_at timestamptz
);
create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_stripe_session on orders(stripe_session_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- Generated portraits（AI 生成的全部肖像）
create table if not exists generated_portraits (
  id uuid primary key default uuid_generate_v4(),
  upload_id uuid references pet_uploads(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  style text not null,
  image_url text not null,
  replicate_model text,
  cost_cents integer default 6,
  created_at timestamptz default now()
);
create index if not exists idx_generated_portraits_upload_id on generated_portraits(upload_id);
create index if not exists idx_generated_portraits_order_id on generated_portraits(order_id);

-- ===== 3. RLS（Row Level Security）=====

-- 启用 RLS（所有表）
alter table waitlist enable row level security;
alter table pet_uploads enable row level security;
alter table orders enable row level security;
alter table generated_portraits enable row level security;

-- Waitlist：仅 service_role 可写（API routes 用 service_role key）
drop policy if exists "service_role can manage waitlist" on waitlist;
create policy "service_role can manage waitlist" on waitlist
  for all to service_role
  using (true) with check (true);

-- Pet uploads：service_role 可写
drop policy if exists "service_role can manage pet_uploads" on pet_uploads;
create policy "service_role can manage pet_uploads" on pet_uploads
  for all to service_role
  using (true) with check (true);

-- Orders：service_role 可写
drop policy if exists "service_role can manage orders" on orders;
create policy "service_role can manage orders" on orders
  for all to service_role
  using (true) with check (true);

-- Generated portraits：service_role 可写 + anon 可公开读（分享用）
drop policy if exists "service_role can manage generated_portraits" on generated_portraits;
create policy "service_role can manage generated_portraits" on generated_portraits
  for all to service_role
  using (true) with check (true);

drop policy if exists "anon can view generated_portraits" on generated_portraits;
create policy "anon can view generated_portraits" on generated_portraits
  for select to anon
  using (true);

-- ===== 4. Storage buckets =====

-- pet-uploads（用户上传的宠物照片）
insert into storage.buckets (id, name, public, file_size_limit)
values ('pet-uploads', 'pet-uploads', true, 10485760)  -- 10MB
on conflict (id) do nothing;

-- generated-portraits（AI 生成的肖像）
insert into storage.buckets (id, name, public, file_size_limit)
values ('generated-portraits', 'generated-portraits', true, 104857600)  -- 100MB (v0.1.30)
on conflict (id) do nothing;

-- ===== 5. Storage RLS =====

-- pet-uploads：service_role 可写，anon 可读（公开）
drop policy if exists "service_role can upload to pet-uploads" on storage.objects;
create policy "service_role can upload to pet-uploads" on storage.objects
  for insert to service_role
  with check (bucket_id = 'pet-uploads');

drop policy if exists "anon can view pet-uploads" on storage.objects;
create policy "anon can view pet-uploads" on storage.objects
  for select to anon
  using (bucket_id = 'pet-uploads');

-- generated-portraits：service_role 可写，anon 可读
drop policy if exists "service_role can upload to generated-portraits" on storage.objects;
create policy "service_role can upload to generated-portraits" on storage.objects
  for insert to service_role
  with check (bucket_id = 'generated-portraits');

drop policy if exists "anon can view generated-portraits" on storage.objects;
create policy "anon can view generated-portraits" on storage.objects
  for select to anon
  using (bucket_id = 'generated-portraits');

-- ===== 6. 自动清理过期图片 =====
-- （v0.2 加：cron job 每天跑，删除 30 天前的 pet_uploads）

-- ===== 完成 =====
select 'petale database initialized. Now run: pnpm test:supabase' as status;