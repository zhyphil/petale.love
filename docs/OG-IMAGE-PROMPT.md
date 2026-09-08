# petale OG 图生成 prompt（给 ChatGPT Pro 用）

## 🎯 任务

用 ChatGPT Pro 生成 petale 的 Open Graph 图（1200×630），用于社交分享卡。

## 📐 Prompt

复制这段到 ChatGPT（用 gpt-image-1 模型）：

```
Pet portrait SaaS app called petale. Show 3 stylized pet portraits arranged horizontally:
1) Left: a watercolor painting of a golden retriever with soft brushstrokes, pastel color palette
2) Center: a Renaissance oil painting of a cat wearing royal robes with a gold ornate frame background
3) Right: a Japanese manga style illustration of a rabbit with big expressive eyes, kawaii style

Each portrait should be in a soft rounded card/frame with subtle shadow. Background: warm gradient from soft cream (#fdf8f3) at top to warm peach (#fdf8f3 to #f9ebd9) at bottom.

Brand mark in top-left: stylized paw print icon with sun/star accent.
Text overlay (bottom-center, large, bold): "petale"
Tagline below: "Le portrait artistique de votre compagnon"

Color palette: warm orange/petal colors (#c87838, #df9b4f), cream backgrounds, no harsh shadows.

Style: modern, friendly, premium SaaS feel. Soft shadows, rounded corners (16px radius), generous whitespace.

NO text in image except "petale" wordmark.
Negative space on right side for optional text overlay.
Photorealistic pet subjects in stylized art styles — actual identifiable animals, not abstract.
```

## 🖼️ 输出要求

- 尺寸：1200×630
- 格式：PNG（不要 JPEG，压缩会损 OG 分享效果）
- 风格：扁平渐变 + 3 张宠物肖像（保留识别度）

## 💾 保存路径

```
~/.openclaw/workspace/projects/petale/public/og.png
```

替换当前 placeholder 文件。

## 🔄 备选方案（如果 ChatGPT Pro 出图失败）

1. **手动画**：用 Canva / Figma 做，30 分钟
2. **直接用 Replicate Flux 2 Pro**：跑 4-5 张，挑最好的
3. **临时方案**：先用一个简单的 petale logo + 文字，留着 v0.2 再优化

## 🎨 favicon（已生成）

`public/favicon.svg` 已经写好（暖色背景 + 宠物爪印 + 太阳/星星）。Next.js 用 `<Icon />` 组件引用即可。