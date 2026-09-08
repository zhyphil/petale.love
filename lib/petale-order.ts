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
  const portraits: string[] = [];
  const VARIANTS = [1, 2, 3, 4] as const;
  const TOTAL = FULL_PACK_STYLES.length * VARIANTS.length; // 12 × 4 = 48

  console.log(`[generate] Starting ${TOTAL} portraits (${FULL_PACK_STYLES.length} styles × 4 variants) for ${email} (order ${orderId})...`);

  for (const style of FULL_PACK_STYLES) {
    for (const variant of VARIANTS) {
      try {
        const result = await generatePetPortrait({ imageUrl, style, variant });
        portraits.push(result.imageUrl);
        console.log(`[generate] ✅ ${style} v${variant} (${portraits.length}/${TOTAL})`);

        await supabase.from('generated_portraits').insert({
          upload_id: uploadId,
          order_id: orderId,
          style: `${style}-v${variant}`,
          image_url: result.imageUrl,
          replicate_model: result.model,
          cost_cents: Math.round(result.cost * 100),
        });
      } catch (err) {
        console.error(`[generate] ❌ ${style} v${variant} failed:`, err);
      }
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
      console.error(`[zip] ❌ ZIP packaging failed:`, err);
      return { ok: false, error: 'ZIP failed', portraitCount: portraits.length };
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