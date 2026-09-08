/**
 * POST /api/test/full-pack
 * v0.1.17 dev only: 直接跑"12 张生成 + 邮件"，不走 Stripe Checkout
 *
 * 用法：
 *   curl -X POST http://localhost:3000/api/test/full-pack \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"you@example.com","imageUrl":"https://...","uploadId":"uuid"}'
 *
 * ⚠️ 只在 dev 跑（production 自动 403）
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateFullPackAndEmail } from '@/lib/petale-order';

const TestSchema = z.object({
  email: z.string().email(),
  // v0.1.23: 放宽 orderId 验证（不再强制 UUID 格式，方便手动复制测试）
  orderId: z.string().min(10).optional(),
  // 保留旧参数以兼容（v0.1.18 之前的调用）
  imageUrl: z.string().url().optional(),
  uploadId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  // dev only
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Disabled in production' },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const parsed = TestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { email, orderId, imageUrl, uploadId } = parsed.data;
    const supabase = createSupabaseAdmin();

    // v0.1.19: 如果有 orderId，直接查表 + 打包 + 发邮件（**不重新生成**，省 $0.72）
    if (orderId) {
      console.log(`[test] Direct email re-send for order=${orderId} email=${email}`);

      // 查 generated_portraits 表
      const { data: rows, error: rowsErr } = await supabase
        .from('generated_portraits')
        .select('style, image_url')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (rowsErr || !rows || rows.length === 0) {
        return NextResponse.json(
          { error: rowsErr?.message ?? 'No portraits found for this orderId' },
          { status: 404 },
        );
      }

      // 打包 ZIP
      const { packagePortraitsAsZip } = await import('@/lib/zip-pack');
      const zipUrl = await packagePortraitsAsZip(
        rows.map((r: { style: string; image_url: string }) => ({
          style: r.style,
          url: r.image_url,
        })),
        orderId,
      );

      // 发邮件
      const { sendOrderConfirmation } = await import('@/lib/resend');
      await sendOrderConfirmation({
        email,
        imageUrl: rows[0].image_url,
        zipUrl,
      });

      return NextResponse.json({
        ok: true,
        mode: 're-send',
        orderId,
        portraitCount: rows.length,
        zipUrl,
      });
    }

    // 旧模式（v0.1.18）：需要 imageUrl + uploadId，会重新生成 12 张
    if (!imageUrl || !uploadId) {
      return NextResponse.json(
        { error: 'Provide orderId (preferred) OR imageUrl + uploadId' },
        { status: 400 },
      );
    }

    console.log(`[test] Direct full-pack test: email=${email} uploadId=${uploadId}`);

    const result = await generateFullPackAndEmail({
      orderId: `test-${Date.now()}`,
      uploadId,
      email,
      imageUrl,
      supabase,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Test full-pack error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}