#!/usr/bin/env node
/**
 * Supabase 连接 + 数据表 + Storage 烟雾测试
 * 用法：
 *   1. 填好 .env.local 的 Supabase keys
 *   2. 在 Supabase Dashboard SQL Editor 跑完 lib/supabase.sql
 *   3. pnpm test:supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 未设置');
    console.error('   检查 .env.local');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  console.log('🐾 petale Supabase 烟雾测试');
  console.log('   URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('');

  let allPass = true;

  // 测试 1：连接 + 查表
  console.log('1️⃣  测试 waitlist 表读写...');
  const testEmail = `test-${Date.now()}@petale.app`;
  const { error: insertErr } = await supabase.from('waitlist').insert({
    email: testEmail,
    locale: 'fr-FR',
    source: 'smoke-test',
  });
  if (insertErr) {
    console.error('   ❌ 插入失败:', insertErr.message);
    allPass = false;
  } else {
    const { data, error: selectErr } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', testEmail)
      .single();
    if (selectErr || !data) {
      console.error('   ❌ 读失败:', selectErr?.message);
      allPass = false;
    } else {
      console.log('   ✅ waitlist 读写 OK');
      // 清理
      await supabase.from('waitlist').delete().eq('email', testEmail);
    }
  }

  // 测试 2：查所有表是否存在
  console.log('');
  console.log('2️⃣  测试表结构...');
  const expectedTables = ['waitlist', 'pet_uploads', 'orders', 'generated_portraits'];
  for (const table of expectedTables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && error.code === 'PGRST116') {
      console.error(`   ❌ 表 ${table} 不存在或 RLS 阻止查询`);
      allPass = false;
    } else if (error && error.code === '42P01') {
      console.error(`   ❌ 表 ${table} 不存在（需先跑 lib/supabase.sql）`);
      allPass = false;
    } else {
      console.log(`   ✅ ${table}`);
    }
  }

  // 测试 3：Storage bucket
  console.log('');
  console.log('3️⃣  测试 Storage buckets...');
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
  if (bucketErr) {
    console.error('   ❌ 查 bucket 失败:', bucketErr.message);
    allPass = false;
  } else {
    const expectedBuckets = ['pet-uploads', 'generated-portraits'];
    for (const bucketName of expectedBuckets) {
      const exists = buckets.some((b) => b.name === bucketName);
      if (exists) {
        console.log(`   ✅ ${bucketName}`);
      } else {
        console.error(`   ❌ bucket ${bucketName} 不存在（需在 Dashboard 创建）`);
        allPass = false;
      }
    }
  }

  // 测试 4：上传一张测试图
  console.log('');
  console.log('4️⃣  测试 Storage 上传...');
  try {
    const response = await fetch('https://picsum.photos/seed/petale-test/200/200');
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `smoke-test-${Date.now()}.jpg`;
    const { error: uploadErr } = await supabase.storage
      .from('pet-uploads')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadErr) {
      console.error('   ❌ 上传失败:', uploadErr.message);
      allPass = false;
    } else {
      const { data: urlData } = supabase.storage
        .from('pet-uploads')
        .getPublicUrl(filename);
      console.log('   ✅ 上传 OK, public URL:', urlData.publicUrl);

      // 清理
      await supabase.storage.from('pet-uploads').remove([filename]);
    }
  } catch (err) {
    console.error('   ❌ 上传异常:', err.message);
    allPass = false;
  }

  // 总结
  console.log('');
  if (allPass) {
    console.log('🎉 全部通过！petale 数据库已就绪');
    console.log('   下一步：填好剩余的 .env.local（Stripe + Resend），然后 pnpm dev');
  } else {
    console.log('⚠️  有问题，按上面的 ❌ 修复');
    process.exit(1);
  }
}

main();