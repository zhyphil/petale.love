/**
 * POST /api/generate
 * 接收用户上传的照片，调用 Replicate 生成 3 张免费预览
 * 复用：已经发过 3 张预览后，付费生成 47 张全部包
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase';
import { generateFreePreview, generatePetPortrait, type PetStyle } from '@/lib/replicate';

const GenerateSchema = z.object({
  imageUrl: z.string().url('URL invalide'),
  uploadId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  mode: z.enum(['free-preview', 'full-pack']),
  styles: z.array(z.enum([
    'watercolor', 'renaissance', 'manga', 'pop-art', 'cyberpunk',
    'noel', 'aquarium', 'stone-age', 'medieval-knight', 'astronaut',
    'vintage-film', 'impressionist',
  ])).optional(),
});

// 免费预览：6 张（覆盖 3 种核心风格 + 3 种前卫风格，让用户感受 petale 风格广度）
const FREE_STYLES: PetStyle[] = [
  'watercolor', 'renaissance', 'manga',  // 3 个「安全」选择
  'pop-art', 'cyberpunk', 'noel',       // 3 个「前卫」选择
];
// 付费包：12 张风格（10 + 2 隐藏）覆盖全部风格
const FULL_PACK_STYLES: PetStyle[] = [
  'watercolor', 'renaissance', 'manga', 'pop-art', 'cyberpunk',
  'noel', 'aquarium', 'stone-age', 'medieval-knight', 'astronaut',
  'vintage-film', 'impressionist',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      );
    }

    const { imageUrl, uploadId, email, mode, styles } = parsed.data;

    // 免费预览模式：3 张
    // 全包模式：12 种风格各 4 张 = 48 张（接近 50 张营销）
    const targetStyles =
      mode === 'free-preview'
        ? styles ?? FREE_STYLES
        : styles ?? FULL_PACK_STYLES;

    // 全包模式需要付费验证（v0.2 加，v0.1 先简化信任）

    // Replicate 低余额（< $5）时 burst = 1，同时跑多张会被 429 限流
    // 策略：并行 + 自动重试（v0.1.10 优化，v0.1.11 升级为 6 张免费预览）
    //  - 第 1 轮：6 张并行（接受部分 429）
    //  - 第 2 轮：429 的串行重试（间隔 12s）
    //  - 总时间：最优 15s（burst允许），最差 130s（全429重试）
    // 策略：并行 + 自动重试（v0.1.10 优化）
    //  - 第 1 轮：3 张并行（接受部分 429）
    //  - 第 2 轮：429 的串行重试（间隔 12s）
    //  - 总时间：最优 15s（bust允许），最差 70s（全429重试）
    const results: Array<{ style: PetStyle; result: Awaited<ReturnType<typeof generatePetPortrait>> }> = [];
    const INTER_REQUEST_DELAY_MS = 12000; // burst 恢复

    // 第 1 轮：6 张并行
    // v0.1.14: 统一用 flux-2-pro（师傅充 $25+ 后 burst 放宽）
    // - 之前的混用模型（Schnell/Dev）错：不支持 input_images
    // - 现在 6 张都用 Pro，能保留宠物特征
    type FirstRoundResult =
      | { style: PetStyle; status: 'ok'; result: Awaited<ReturnType<typeof generatePetPortrait>> }
      | { style: PetStyle; status: 'rate-limit' }
      | { style: PetStyle; status: 'failed'; error: string };

    const firstRound: FirstRoundResult[] = await Promise.all(
      targetStyles.map(async (style) => {
        try {
          const result = await generatePetPortrait({ imageUrl, style });
          return { style, status: 'ok', result };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          const isRateLimit =
            msg.includes('429') ||
            msg.toLowerCase().includes('rate limit') ||
            msg.toLowerCase().includes('throttl');
          if (isRateLimit) {
            console.warn(`[429] Rate limit hit on ${style}, will retry`);
            return { style, status: 'rate-limit' };
          }
          console.error(`Replicate non-rate-limit error for ${style}:`, msg);
          return { style, status: 'failed', error: msg };
        }
      })
    );

    // 收集第一轮成功的
    for (const r of firstRound) {
      if (r.status === 'ok') results.push({ style: r.style, result: r.result });
    }

    // 第 2 轮：429 重试（串行 12s 间隔）
    const toRetry = firstRound.filter((r): r is Extract<FirstRoundResult, { status: 'rate-limit' }> => r.status === 'rate-limit');
    for (const failed of toRetry) {
      console.log(`[retry] waiting ${INTER_REQUEST_DELAY_MS / 1000}s before retrying ${failed.style}...`);
      await new Promise((r) => setTimeout(r, INTER_REQUEST_DELAY_MS));
      try {
        const result = await generatePetPortrait({ imageUrl, style: failed.style });
        results.push({ style: failed.style, result });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // 如果还是 429，再试一次（终极 fallback）
        if (msg.includes('429')) {
          console.log(`[retry-2] second 429 on ${failed.style}, waiting 30s...`);
          await new Promise((r) => setTimeout(r, 30000));
          try {
            const result = await generatePetPortrait({ imageUrl, style: failed.style });
            results.push({ style: failed.style, result });
          } catch (err3) {
            console.error(`[failed] ${failed.style} retry failed twice:`, err3);
          }
        } else {
          console.error(`[failed] ${failed.style}:`, msg);
        }
      }
    }

    const portraits = results.map((r) => r.result.imageUrl);

    if (portraits.length === 0) {
      return NextResponse.json(
        { error: "La génération a échoué. Réessayez ou changez de photo." },
        { status: 502 },
      );
    }

    // 保存到数据库（如果有 uploadId）
    if (uploadId) {
      const supabase = createSupabaseAdmin();
      await supabase
        .from('generated_portraits')
        .insert(
          results.map((r) => ({
            upload_id: uploadId,
            order_id: null,
            style: r.style,
            image_url: r.result.imageUrl,
            replicate_model: r.result.model,
            cost_cents: Math.round(r.result.cost * 100),
          })),
        )
        .then(({ error }) => {
          if (error) console.error('Save portraits error:', error);
        });
    }

    return NextResponse.json({
      ok: true,
      portraits: portraits.map((url, i) => ({
        style: targetStyles[i],
        url,
      })),
      totalCost: results.reduce((sum, r) => sum + (r.result.cost ?? 0), 0),
      generatedCount: results.filter((r) => r !== null).length,
      requestedCount: targetStyles.length,
    });
  } catch (err) {
    console.error('Generate POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}