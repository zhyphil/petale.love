/**
 * 宠物订单 helper（v0.1.17 提取）
 * 被 webhook + 测试 endpoint 共用
 */

import { generatePetPortrait } from './replicate';
import { sendOrderConfirmation } from './resend';
import { packagePortraitsAsZip } from './zip-pack';
import type { SupabaseClient } from '@supabase/supabase-js';

const FULL_PACK_STYLES = [
  'watercolor', 'renaissance', 'manga', 'pop-art', 'cyberpunk',
  'noel', 'aquarium', 'stone-age', 'medieval-knight', 'astronaut',
  'vintage-film', 'impressionist',
] as const;

/**
 * 生成完整 12 张肖像 + 发邮件
 * webhook + 测试 endpoint 共用
 */
export async function generateFullPackAndEmail({
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
  supabase: SupabaseClient;
}) {
  const VARIANTS = [1, 2, 3, 4] as const;
  const TOTAL = FULL_PACK_STYLES.length * VARIANTS.length; // 12 × 4 = 48

  console.log(`[generate] Starting ${TOTAL} portraits (${FULL_PACK_STYLES.length} styles × 4 variants in parallel) for ${email} (order ${orderId})...`);

  // v0.1.29: 48 张全部并行（不串行）—— 串行需要 12 分钟，并行 ~30 秒
  type GenerationResult = { style: string; variant: 1 | 2 | 3 | 4; url: string };

  const generationTasks: Promise<GenerationResult | null>[] = [];

  for (const style of FULL_PACK_STYLES) {
    for (const variant of VARIANTS) {
      generationTasks.push(
        (async () => {
          try {
            const result = await generatePetPortrait({ imageUrl, style, variant });
            console.log(`[generate] ✅ ${style} v${variant} done`);
            return { style, variant, url: result.imageUrl };
          } catch (err) {
            console.error(`[generate] ❌ ${style} v${variant} failed:`, err);
            return null;
          }
        })(),
      );
    }
  }

  // 全部并行启动
  const results = await Promise.all(generationTasks);
  const portraits = results
    .filter((r): r is GenerationResult => r !== null)
    .map((r) => r.url);

  // 写 DB（串行避免 burst）
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (!r) continue;
    try {
      await supabase.from('generated_portraits').insert({
        upload_id: uploadId,
        order_id: orderId,
        style: `${r.style}-v${r.variant}`,
        image_url: r.url,
        replicate_model: 'flux-2-pro',
        cost_cents: 6,
      });
    } catch (err) {
      console.error(`[generate] ❌ DB insert ${r.style}-v${r.variant} failed:`, err);
    }
  }

  if (portraits.length > 0) {
    console.log(`[zip] Packaging ${portraits.length} portraits...`);
    let zipUrl = '';
    try {
      // 查 DB 拿 style → url 映射
      const { data: rows, error: rowsErr } = await supabase
        .from('generated_portraits')
        .select('style, image_url')
        .eq('order_id', orderId)
        .order('style', { ascending: true });

      if (rowsErr || !rows || rows.length === 0) {
        throw new Error(rowsErr?.message ?? 'No portraits found in DB to package');
      }

      const entries = rows.map((r: { style: string; image_url: string }) => ({
        style: r.style,
        url: r.image_url,
      }));

      zipUrl = await packagePortraitsAsZip(entries, orderId);
    } catch (err) {
      // v0.1.33: ZIP 失败时也发 fallback 邮件（不静默）
      console.error(`[zip] ❌ ZIP packaging failed:`, err);
      try {
        const { sendOrderConfirmation } = await import('@/lib/resend');
        await sendOrderConfirmation({
          email,
          imageUrl: portraits[0],
          zipUrl: '', // 空 zipUrl 邮件模板会显示 12 个单独链接
        });
        console.log(`[resend] ✅ Fallback email sent (no ZIP)`);
      } catch (emailErr) {
        console.error(`[resend] ❌ Fallback email failed:`, emailErr);
      }
      return { ok: false, error: 'ZIP failed, fallback email sent', portraitCount: portraits.length };
    }

    console.log(`[resend] Sending email to ${email} with ZIP...`);
    try {
      await sendOrderConfirmation({
        email,
        imageUrl: portraits[0],
        zipUrl, // v0.1.18: 单一 ZIP 链接
      });
      console.log(`[resend] ✅ Email sent to ${email}`);
      return { ok: true, portraitCount: portraits.length, zipUrl };
    } catch (err) {
      console.error(`[resend] ❌ Email failed:`, err);
      return { ok: false, error: 'Email failed', portraitCount: portraits.length, zipUrl };
    }
  } else {
    console.error(`[generate] ❌ No portraits generated`);
    return { ok: false, error: 'No portraits generated' };
  }
}