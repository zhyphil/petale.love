/**
 * POST /api/checkout
 * 创建 Stripe Checkout Session
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';

const CheckoutSchema = z.object({
  email: z.string().email(),
  imageUrl: z.string().url(),
  uploadId: z.string().uuid().optional(),
  styles: z.array(z.string()).optional(),
  locale: z.string().default('fr'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { email, imageUrl, uploadId, styles, locale } = parsed.data;
    const priceId = process.env.STRIPE_PRICE_ID_EUR;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe Price ID non configuré' },
        { status: 500 },
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://petale.app';

    // 先在数据库创建订单记录
    const supabase = createSupabaseAdmin();
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        email,
        amount_cents: 999,
        currency: 'eur',
        status: 'pending',
        metadata: {
          imageUrl,
          uploadId,
          styles: styles ?? [],
          locale,
        },
      })
      .select('id')
      .single();

    if (dbError || !order) {
      console.error('Order insert error:', dbError);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    const session = await createCheckoutSession({
      priceId,
      customerEmail: email,
      successUrl: `${siteUrl}/studio?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/studio?canceled=true`,
      metadata: {
        orderId: order.id,
        email,
        uploadId: uploadId ?? '',
      },
    });

    // 把 stripe session id 写回订单
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Checkout POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}