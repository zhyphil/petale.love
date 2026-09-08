/**
 * Replicate API 客户端封装
 * 文档：https://replicate.com/docs
 */

import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/**
 * petale 主要出图模型选择：
 * - Flux 2 Pro（黑森林实验室，新一代）：$0.015/input MP + $0.015/output MP（默认 1MP）~ $0.06/张
 * - Flux Pro 1.1（旧版）：固定 $0.04/张
 * - Flux Schnell（黑森林实验室）：快速便宜 ~$0.008/张
 * - SDXL Lightning 4-step：极致便宜 ~$0.006/张
 *
 * v0.1 默认 Flux 2 Pro（最新模型，质量优先 + 多图输入支持）
 */
const PRIMARY_MODEL = 'black-forest-labs/flux-2-pro' as const;



export type PetStyle =
  | 'watercolor'
  | 'renaissance'
  | 'manga'
  | 'pop-art'
  | 'cyberpunk'
  | 'noel'
  | 'aquarium'
  | 'stone-age'
  | 'medieval-knight'
  | 'astronaut'
  | 'vintage-film'
  | 'impressionist';

export interface GenerateOptions {
  imageUrl: string;
  /** v0.2 多张输入支持。默认单张 */
  additionalImageUrls?: string[];
  style: PetStyle;
  prompt?: string;
  /** v0.1.12: 模型选择，默认 'flux-pro' */
  model?: 'flux-pro' | 'flux-schnell'; // v0.1.14: 仅支持 input_images 的模型；保留 enum 兼容旧 API
  /** v0.1.20: 变体 1-4（不同 prompt 关键词生成同一风格的 4 张变体）*/
  variant?: 1 | 2 | 3 | 4 | 5;
}

export interface GenerateResult {
  imageUrl: string;
  model: string;
  cost: number; // USD
  durationMs: number;
}

/**
 * v0.1 单张 Flux Pro 1.1 出图
 * @param options.imageUrl 用户上传照片的 URL（Supabase Storage）
 * @param options.style 12 种风格之一
 */
export async function generatePetPortrait(
  options: GenerateOptions,
): Promise<GenerateResult> {
  // v0.1.34: 5 个变体关键词（让每风格 4 张图都有差异）
const VARIANT_SUFFIXES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '',
  2: ', soft warm lighting, golden hour, intimate atmosphere',
  3: ', minimalist solid background, clean composition, professional studio look',
  4: ', dramatic angle, dynamic pose, cinematic composition, bold perspective',
  5: ', close-up intimate framing, eye-level perspective, emotional depth, shallow depth of field',
};

const stylePrompt = STYLE_PROMPTS[options.style];
  const variantSuffix =
    (options.variant as 1 | 2 | 3 | 4 | 5) !== undefined && VARIANT_SUFFIXES[options.variant as 1 | 2 | 3 | 4 | 5]
      ? VARIANT_SUFFIXES[options.variant]
      : '';
  const fullPrompt = options.prompt
    ? `${stylePrompt}, ${options.prompt}${variantSuffix}`
    : `${stylePrompt}${variantSuffix}`;

  const start = Date.now();
  const modelId = PRIMARY_MODEL;

  const output = await replicate.run(modelId, {
    input: {
      prompt: fullPrompt,
      input_images: [options.imageUrl], // flux-2-pro 支持多张输入图数组
      aspect_ratio: '1:1',
      resolution: '1 MP', // 默认 1024×1024，可选 0.5/1/2/4 MP
      output_format: 'jpg',
      output_quality: 90,
      safety_tolerance: 2,
    },
  });

  const durationMs = Date.now() - start;

  // Replicate SDK 1.0 输出格式：
  // - string / string[] (URL 数组)
  // - FileOutput 实例（继承自 ReadableStream，有 toString() / url() 方法）
  // - FileOutput[] (FileOutput 实例数组)
  let imageUrl: string | null = null;

  function extractUrl(item: unknown): string | null {
    if (typeof item === 'string') return item;
    if (item instanceof URL) return item.href;
    if (item && typeof item === 'object') {
      // FileOutput 实例（Replicate SDK 1.0）
      if (typeof (item as { toString?: () => string }).toString === 'function') {
        const s = (item as { toString: () => string }).toString();
        if (s.startsWith('http')) return s;
      }
      if (typeof (item as { url?: () => URL | string }).url === 'function') {
        const u = (item as { url: () => URL | string }).url();
        return typeof u === 'string' ? u : u.href;
      }
      if (typeof (item as { href?: string }).href === 'string') {
        return (item as { href: string }).href;
      }
    }
    return null;
  }

  if (Array.isArray(output)) {
    imageUrl = extractUrl(output[0]);
  } else {
    imageUrl = extractUrl(output);
  }

  if (!imageUrl) {
    console.error('Replicate unexpected output:', output);
    throw new Error('Replicate returned unexpected output format');
  }

  // flux-2-pro 定价：$0.015 per input/output image megapixel
  // 假设用户上传照片 3MP → 输入 $0.045 + 输出 1MP $0.015 = $0.06/张
  const estimatedCost = 0.06;

  return {
    imageUrl,
    model: PRIMARY_MODEL,
    cost: estimatedCost,
    durationMs,
  };
}

/**
 * 3 张免费预览（不同风格）
 * 用于 Studio 页面的免费预览步骤
 */
export async function generateFreePreview(
  imageUrl: string,
): Promise<GenerateResult[]> {
  const previewStyles: PetStyle[] = ['watercolor', 'renaissance', 'manga'];
  return Promise.all(previewStyles.map((style) => generatePetPortrait({ imageUrl, style })));
}

/**
 * 12 种风格的 prompt 模板
 * 全部用英文（Flux 模型英文 prompt 效果最好），但 prompt 描述风格通用
 */
const STYLE_PROMPTS: Record<PetStyle, string> = {
  watercolor:
    'a soft watercolor painting of the same pet, delicate brushstrokes, pastel color palette, gentle wash effect, white background, fine art style, masterpiece, high detail',
  renaissance:
    'a Renaissance oil painting portrait of the same pet, royal robes, ornate gilded frame background, dramatic chiaroscuro lighting, classical composition, museum quality, in the style of Raphael and Vermeer',
  manga:
    'a Japanese manga style illustration of the same pet, bold line art, expressive eyes, dynamic pose, vibrant flat colors, anime aesthetic, cute kawaii style, white background',
  'pop-art':
    'a pop art portrait of the same pet, in the style of Andy Warhol, bold primary colors, halftone dots, high contrast, comic book aesthetic, multiple panels, vibrant and energetic',
  cyberpunk:
    'a cyberpunk neon portrait of the same pet, glowing cybernetic implants, futuristic city backdrop, neon pink and cyan lighting, holographic effects, dystopian aesthetic, ultra detailed digital art',
  noel:
    'the same pet wearing a Santa hat, surrounded by Christmas decorations, soft snowflakes, warm fireplace background, festive red and gold colors, cozy holiday atmosphere, magical Christmas scene',
  aquarium:
    'the same pet underwater in a tropical coral reef, surrounded by colorful fish, sunbeams filtering through water, vibrant marine colors, dreamy aquatic atmosphere, photo realistic underwater photography',
  'stone-age':
    'the same pet depicted as a prehistoric cave painting, ochre and charcoal colors, rough stone texture background, primitive art style, ancient and tribal aesthetic',
  'medieval-knight':
    'the same pet wearing shining medieval knight armor, holding a tiny banner, castle background, dramatic heroic pose, Renaissance painting style, epic fantasy atmosphere',
  astronaut:
    'the same pet wearing a space suit, floating in outer space, Earth visible in background, stars and nebulae, retro NASA poster aesthetic, heroic space exploration theme',
  'vintage-film':
    'the same pet as a vintage 1970s film photograph, Kodak Portra 400 film grain, warm color tones, soft focus, retro aesthetic, nostalgic atmosphere, Polaroid style',
  impressionist:
    'the same pet in the style of Monet and Renoir, loose impressionist brushstrokes, dappled light, soft pastel colors, garden setting, dreamy and ethereal, post-impressionist masterpiece',
};