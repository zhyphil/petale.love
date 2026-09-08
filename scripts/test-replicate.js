#!/usr/bin/env node
/**
 * Replicate API 烟雾测试
 * 用法：
 *   1. 在 .env.local 填入 REPLICATE_API_TOKEN
 *   2. pnpm test:replicate
 *
 * 用途：验证 API token + flux-2-pro 模型 + 多图输入 都能跑通
 *
 * 注意：Wikipedia 不允许 hotlinking（403 Forbidden）。
 * 本脚本使用 picsum.photos 公开图床 + CORS 友好 + 不限流。
 */

require('dotenv').config({ path: '.env.local' });
const Replicate = require('replicate');

// picsum.photos 公开图床——每次访问随机一张图（CORS 友好 + 无限流）
// seed 锁定同一张图，让结果可复现
const TEST_IMAGE_URL = 'https://picsum.photos/seed/petale-pet/1024/1024';
const TEST_PROMPT =
  'a watercolor painting of the same animal in the photo, soft brushstrokes, pastel color palette, gentle wash effect, white background, fine art style, masterpiece';

async function main() {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ REPLICATE_API_TOKEN not set in .env.local');
    console.error('   Get your token: https://replicate.com/account/api-tokens');
    process.exit(1);
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  console.log('🐾 petale Replicate 烟雾测试');
  console.log('   Model: black-forest-labs/flux-2-pro');
  console.log('   Test image:', TEST_IMAGE_URL);
  console.log('');

  const start = Date.now();
  try {
    const output = await replicate.run('black-forest-labs/flux-2-pro', {
      input: {
        prompt: TEST_PROMPT,
        input_images: [TEST_IMAGE_URL],
        aspect_ratio: '1:1',
        resolution: '1 MP',
        output_format: 'jpg',
        output_quality: 90,
        safety_tolerance: 2,
      },
    });

    const durationMs = Date.now() - start;

    // Replicate SDK 1.0 输出兼容：string / string[] / FileOutput (extends ReadableStream) / FileOutput[]
    function extractUrl(item) {
      if (typeof item === 'string') return item;
      if (item instanceof URL) return item.href;
      if (item && typeof item === 'object') {
        if (typeof item.toString === 'function') {
          const s = item.toString();
          if (s.startsWith('http')) return s;
        }
        if (typeof item.url === 'function') {
          const u = item.url();
          return typeof u === 'string' ? u : u.href;
        }
        if (typeof item.href === 'string') return item.href;
      }
      return null;
    }

    const imageUrl = Array.isArray(output) ? extractUrl(output[0]) : extractUrl(output);

    console.log('✅ 生成成功');
    console.log('   URL:', imageUrl);
    console.log('   时长:', (durationMs / 1000).toFixed(1), '秒');
    console.log('');
    console.log('下一步：在浏览器打开 URL 查看效果');
    console.log('         如果想用真实宠物图测试：');
    console.log('         1. 把测试图片 URL 换成 https://你的.supabase.co/storage/...');
    console.log('         2. 或在本地跑 pnpm dev，从 /studio 页面上传');
  } catch (err) {
    console.error('❌ 生成失败:', err.message);
    if (err.message.includes('401')) {
      console.error('   → 检查 REPLICATE_API_TOKEN 是否正确');
    } else if (err.message.includes('403')) {
      console.error('   → 图片 URL 不可访问（hotlinking 屏蔽）。换 picsum.photos 或 unsplash');
    } else if (err.message.includes('429')) {
      console.error('   → 余额不足，去 https://replicate.com/account/billing 充值');
    } else if (err.message.includes('safety')) {
      console.error('   → 触发安全过滤，调低 safety_tolerance 或换 prompt');
    } else if (err.message.includes('timeout')) {
      console.error('   → 网络问题，重试或换 VPN');
    }
    process.exit(1);
  }
}

main();