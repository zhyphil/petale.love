/**
 * POST /api/waitlist
 * 加入 waitlist 邮箱 + 发送确认邮件
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase';
import { sendWaitlistConfirmation } from '@/lib/resend';

const WaitlistSchema = z.object({
  email: z.string().email('Email invalide').max(255),
  locale: z.string().optional(),
  source: z.string().optional(),
  referrer: z.string().optional(),
  utm: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = WaitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { email, locale, source, referrer, utm } = parsed.data;
    const supabase = createSupabaseAdmin();

    // Upsert（deduplicate by email）
    const { error: dbError } = await supabase
      .from('waitlist')
      .upsert(
        {
          email,
          locale: locale ?? 'fr-FR',
          source: source ?? 'landing',
          referrer: referrer ?? req.headers.get('referer') ?? null,
          utm: utm ?? {},
        },
        { onConflict: 'email', ignoreDuplicates: false },
      );

    if (dbError) {
      console.error('Supabase waitlist insert error:', dbError);
      return NextResponse.json(
        { error: 'Erreur serveur. Réessayez.' },
        { status: 500 },
      );
    }

    // 异步发邮件（不阻塞响应）
    sendWaitlistConfirmation(email).catch((err) =>
      console.error('Resend confirmation error:', err),
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Waitlist POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}