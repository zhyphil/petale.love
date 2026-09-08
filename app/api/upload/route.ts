/**
 * POST /api/upload
 * 接收用户上传的图片，返回公开 URL（用于 Replicate 输入）
 * v0.1：用 Supabase Storage 公开 bucket
 * v0.2：换成私有 bucket + 短期签名 URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'pet-uploads';
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large (max 10 MB)' },
        { status: 413 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type (JPEG, PNG, WebP)' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();

    // 文件名：时间戳 + 随机字符串 + 原扩展名
    const ext = file.name.split('.').pop() ?? 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: "Échec de l'upload" },
        { status: 500 },
      );
    }

    // 获取公开 URL
    const { data: publicUrl } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    // v0.1.13: 插入 pet_uploads 表拿到 uploadId
    // （webhook 需要这个 id 来触发 50 张生成）
    const { data: uploadRow, error: dbError } = await supabase
      .from('pet_uploads')
      .insert({
        storage_path: filename,
        public_url: publicUrl.publicUrl,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Insert pet_uploads error:', dbError);
    }

    return NextResponse.json({
      ok: true,
      url: publicUrl.publicUrl,
      filename,
      uploadId: uploadRow?.id ?? null,
    });
  } catch (err) {
    console.error('Upload POST error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const maxDuration = 30; // 30s timeout for large uploads