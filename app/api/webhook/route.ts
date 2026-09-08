/**
 * POST /api/webhook
 * Stripe webhook 接收器
 * 关键事件：
 *   - checkout.session.completed → 发邮件 + 生成完整 50 张
 *   - charge.refunded → 更新订单状态
 *
 * 本地测试：stripe listen --forward-to localhost:3000/api/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { constructWebhookEvent } from '@/lib/stripe';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateFullPackAndEmail } from '@/lib/petale-order';

// 关闭 body parsing，由 Stripe SDK 自己解析
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(payload, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const email = session.metadata?.email;
      const uploadId = session.metadata?.uploadId;

      // v0.1.16: 加详细 log 诊断
      console.log(`[webhook] checkout.session.completed`);
      console.log(`  orderId: ${orderId}`);
      console.log(`  email: ${email}`);
      console.log(`  uploadId: ${uploadId || '(EMPTY)'}`);
      console.log(`  metadata:`, JSON.stringify(session.metadata));

      if (!orderId || !email) {
        console.error('Missing metadata on checkout.session:', session.id);
        return NextResponse.json({ ok: true });
      }

      // 1. 更新订单状态
      await supabase
        .from('orders')
        .update({
          status: 'completed',
          stripe_payment_intent_id:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id,
        })
        .eq('id', orderId);

      // 2. 异步生成完整 50 张（v0.1 简化：先生成 12 张代表风格，全包上传后给链接）
      // v0.2 升级：背景任务 + S3 持久化 + 进度推送
      if (uploadId) {
        // 从原上传获取原图 URL（v0.1.15: 修复字段名不匹配 bug）
        // /api/upload 存的是public_url，不是 original_image_url
        const { data: upload } = await supabase
          .from('pet_uploads')
          .select('public_url')
          .eq('id', uploadId)
          .single();

        if (upload?.public_url) {
          console.log(`[webhook] ✅ Found upload ${uploadId}, starting 12-portrait generation...`);
          generateFullPackAndEmail({
            orderId,
            uploadId,
            email,
            imageUrl: upload.public_url,
            supabase,
          }).catch((err) =>
            console.error('[webhook] Generate full pack error:', err),
          );
        } else {
          console.warn(`[webhook] ❌ No public_url for uploadId ${uploadId}`);
        }
      } else {
        console.warn(`[webhook] ❌ uploadId empty, skipping generation`);
      }

      return NextResponse.json({ ok: true });
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const orderId = (charge.metadata as Record<string, string>)?.orderId;

      if (orderId) {
        await supabase
          .from('orders')
          .update({
            status: 'refunded',
            refunded_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      }
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ ok: true, ignored: event.type });
  }
}

/**
 * 异步任务：生成完整 50 张 + 发邮件
 * v0.1：12 张代表性风格
 * v0.2：50 张全包（每风格 4-5 张变体）
 */
async function _legacyGenerateFullPackAndEmail({
  orderId,
  uploadId,
  email,
  imageUrl,
  supabase,
}: {
  orderId: string;
  uploadId: string;
  email: string;
  imageUrl: string;
  supabase: ReturnType<typeof createSupabaseAdmin>;
}) {
  // v0.1.17: 重构到 lib/petale-order.ts（webhook + test endpoint 共用）
  return generateFullPackAndEmail({ orderId, uploadId, email, imageUrl, supabase });
}