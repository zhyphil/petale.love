/**
 * Supabase 客户端（数据库 + Storage）
 * 注意：Supabase 在欧洲区需手动选 Frankfurt 或 Stockholm 数据中心
 */

import { createClient as createServerClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Service Role（仅服务端使用，绕过 RLS）
export function createSupabaseAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

// Browser client（用户端，使用 anon key）
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Supabase 表结构 (在 Supabase SQL Editor 中执行)
 *
 * CREATE TABLE waitlist (
 *   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   email text UNIQUE NOT NULL,
 *   locale text DEFAULT 'fr-FR',
 *   source text,
 *   referrer text,
 *   utm jsonb,
 *   created_at timestamptz DEFAULT now()
 * );
 *
 * CREATE TABLE orders (
 *   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   email text NOT NULL,
 *   stripe_session_id text UNIQUE,
 *   stripe_payment_intent_id text,
 *   amount_cents integer NOT NULL,
 *   currency text DEFAULT 'eur',
 *   status text DEFAULT 'pending', -- pending|completed|refunded
 *   image_urls jsonb,
 *   style_pack text DEFAULT 'standard',
 *   metadata jsonb,
 *   created_at timestamptz DEFAULT now(),
 *   refunded_at timestamptz
 * );
 *
 * CREATE TABLE pet_uploads (
 *   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_email text,
 *   original_image_url text NOT NULL,
 *   previews jsonb,
 *   paid boolean DEFAULT false,
 *   paid_order_id uuid REFERENCES orders(id),
 *   created_at timestamptz DEFAULT now()
 * );
 *
 * CREATE TABLE generated_portraits (
 *   id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   upload_id uuid REFERENCES pet_uploads(id),
 *   order_id uuid REFERENCES orders(id),
 *   style text NOT NULL,
 *   image_url text NOT NULL,
 *   replicate_model text,
 *   cost_cents integer,
 *   created_at timestamptz DEFAULT now()
 * );
 *
 * -- Storage buckets:
 * -- 1. "pet-uploads" (private, 30 days TTL)
 * -- 2. "generated-portraits" (public-read, 90 days TTL)
 */