/**
 * ZIP 打包 + 上传到 Supabase Storage（v0.1.20）
 *
 * 用户付完款 → 12 张肖像生成 → 打包成 1 个 ZIP → 邮件发 1 个链接
 *
 * archiver v8 是 ESM-only，CommonJS 里用 .ZipArchive 类
 */

import { ZipArchive } from 'archiver';
import { createSupabaseAdmin } from './supabase';

const ZIP_BUCKET = 'generated-portraits';

/**
 * 把多张肖像（URL 列表）打包成 1 个 ZIP 文件
 * @returns ZIP 文件的公开 URL（Supabase Storage）
 */
export async function packagePortraitsAsZip(
  portraitEntries: Array<{ style: string; url: string }>,
  orderId: string,
): Promise<string> {
  const supabase = createSupabaseAdmin();

  console.log(`[zip] Starting ZIP packaging for ${portraitEntries.length} portraits...`);

  // archiver v8 在 CJS 里：用 ZipArchive 类
  const zip = new ZipArchive({ zlib: { level: 6 } });
  const zipBufferChunks: Buffer[] = [];
  zip.on('data', (chunk: Buffer) => zipBufferChunks.push(chunk));

  const zipFinished = new Promise<void>((resolve, reject) => {
    zip.on('end', () => resolve());
    zip.on('error', (err: unknown) => reject(err));
  });

  // 并行下载所有肖像（添加到 ZIP）
  await Promise.all(
    portraitEntries.map(async ({ style, url }, idx) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // ZIP 内部文件名：01-watercolor.jpg, 02-renaissance.jpg...
        const filename = `${String(idx + 1).padStart(2, '0')}-${style}.jpg`;
        zip.append(buffer, { name: filename });
        console.log(`[zip] ✅ Added ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
      } catch (err) {
        console.error(`[zip] ❌ Failed to add ${style}:`, err);
      }
    }),
  );

  // 完成 ZIP
  await zip.finalize();
  await zipFinished;

  const zipBuffer = Buffer.concat(zipBufferChunks);
  console.log(`[zip] ZIP ready: ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  // 上传到 Supabase Storage
  const filename = `petale-${orderId}-${Date.now()}.zip`;
  const { error: uploadErr } = await supabase.storage
    .from(ZIP_BUCKET)
    .upload(filename, zipBuffer, {
      contentType: 'application/zip',
      upsert: false,
    });

  if (uploadErr) {
    console.error('[zip] Upload error:', uploadErr);
    throw new Error(`Failed to upload ZIP: ${uploadErr.message}`);
  }

  // 公开 URL
  const { data: publicUrl } = supabase.storage
    .from(ZIP_BUCKET)
    .getPublicUrl(filename);

  console.log(`[zip] ✅ ZIP uploaded: ${publicUrl.publicUrl}`);
  return publicUrl.publicUrl;
}