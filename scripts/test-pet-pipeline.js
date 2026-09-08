#!/usr/bin/env node
/**
 * 真实宠物图端到端测试
 * 流程：本地宠物图 → Supabase Storage → Replicate 生成 → 输出 URL
 *
 * 用法：
 *   1. 把宠物图放到 /tmp/petale-test/your-pet.jpg
 *   2. node --env-file=.env.local scripts/test-pet-pipeline.js
 *   3. 或者带文件名：node --env-file=.env.local scripts/test-pet-pipeline.js /tmp/petale-test/cat.jpg
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Replicate = require('replicate');

// CLI 参数 / 默认路径
const localImagePath = process.argv[2] || '/tmp/petale-test/cat.jpg';

const STYLE_KEYS = ['watercolor', 'renaissance', 'manga'];
const STYLE_LABELS = {
  watercolor: 'Aquarelle',
  renaissance: 'Renaissance',
  manga: 'Manga',
};

async function main() {
  if (!fs.existsSync(localImagePath)) {
    console.error(`❌ 图片不存在: ${localImagePath}`);
    console.error('   准备步骤：');
    console.error('   1. 找一张你家宠物的照片');
    console.error('   2. 保存到 /tmp/petale-test/your-pet.jpg');
    console.error('   3. 重跑：node --env-file=.env.local scripts/test-pet-pipeline.js');
    process.exit(1);
  }

  console.log('🐾 petale 真实宠物图端到端测试');
  console.log('   输入图片:', localImagePath);
  console.log('   输出风格:', STYLE_KEYS.join(', '));
  console.log('');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  // ===== Step 1：上传到 Supabase Storage =====
  console.log('1️⃣  上传到 Supabase Storage...');
  const ext = path.extname(localImagePath).slice(1) || 'jpg';
  const filename = `pet-test-${Date.now()}.${ext}`;
  const buffer = fs.readFileSync(localImagePath);

  const { error: uploadErr } = await supabase.storage
    .from('pet-uploads')
    .upload(filename, buffer, {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (uploadErr) {
    console.error('   ❌ 上传失败:', uploadErr.message);
    process.exit(1);
  }

  const { data: urlData } = supabase.storage
    .from('pet-uploads')
    .getPublicUrl(filename);
  const imageUrl = urlData.publicUrl;
  console.log('   ✅ 上传 OK:', imageUrl);

  // ===== Step 2：保存到数据库（可选） =====
  console.log('');
  console.log('2️⃣  保存到 pet_uploads 表...');
  const { data: uploadRow, error: dbErr } = await supabase
    .from('pet_uploads')
    .insert({
      storage_path: filename,
      public_url: imageUrl,
    })
    .select('id')
    .single();

  if (dbErr) {
    console.error('   ⚠️ 数据库记录失败（不影响生成）:', dbErr.message);
  } else {
    console.log('   ✅ DB id:', uploadRow.id);
  }

  // ===== Step 3：调用 Replicate 生成 3 张预览 =====
  console.log('');
  console.log('3️⃣  调用 Replicate 生成 3 张预览...');
  console.log('   模型: flux-2-pro');
  console.log('');

  const stylePrompts = {
    watercolor:
      'a soft watercolor painting of the same pet as in the photo, delicate brushstrokes, pastel color palette, gentle wash effect, white background, fine art style, masterpiece, preserve pet features',
    renaissance:
      'a Renaissance oil painting portrait of the same pet as in the photo, royal robes, ornate gilded frame background, dramatic chiaroscuro lighting, classical composition, museum quality, in the style of Raphael and Vermeer, preserve pet features',
    manga:
      'a Japanese manga style illustration of the same pet as in the photo, bold line art, expressive eyes, dynamic pose, vibrant flat colors, anime aesthetic, cute kawaii style, white background, preserve pet features',
  };

  const portraits = [];

  for (const style of STYLE_KEYS) {
    const start = Date.now();
    process.stdout.write(`   🎨 ${STYLE_LABELS[style]}... `);

    try {
      const output = await replicate.run('black-forest-labs/flux-2-pro', {
        input: {
          prompt: stylePrompts[style],
          input_images: [imageUrl],
          aspect_ratio: '1:1',
          resolution: '1 MP',
          output_format: 'jpg',
          output_quality: 90,
          safety_tolerance: 2,
        },
      });

      // 解析输出（兼容 FileOutput）
      let resultUrl = null;
      if (typeof output === 'string') resultUrl = output;
      else if (output && typeof output.toString === 'function') {
        resultUrl = output.toString();
      } else if (Array.isArray(output) && output[0]) {
        resultUrl =
          typeof output[0] === 'string'
            ? output[0]
            : typeof output[0].toString === 'function'
            ? output[0].toString()
            : null;
      }

      const duration = ((Date.now() - start) / 1000).toFixed(1);

      if (resultUrl && resultUrl.startsWith('http')) {
        console.log(`✅ ${duration}s`);
        console.log(`      ${resultUrl}`);
        portraits.push({ style, url: resultUrl });
      } else {
        console.log(`❌ 输出解析失败:`, resultUrl);
      }
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
  }

  // ===== 总结 =====
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (portraits.length === 3) {
    console.log('🎉 全部成功！petale 端到端流程跑通');
    console.log('');
    console.log('📋 接下来：');
    console.log('   1. 在浏览器打开上面 3 个 URL 看效果');
    console.log('   2. 集成 Stripe（docs/STRIPE.md）');
    console.log('   3. pnpm dev 启动，跑全流程');
  } else {
    console.log(`⚠️ ${portraits.length}/3 张生成成功`);
    console.log('   检查 Replicate token 余额或 prompt 调整');
  }
}

main();