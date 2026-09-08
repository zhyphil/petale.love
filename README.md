# petale — 宠物 AI 肖像

> **宠物 AI 肖像，先看后付，专为宠物主和宠物纪念设计。**
> MVP 启动包（v0.1.4 · 2026-09-06）

## 项目定位

- **品牌**：petale（法语"花瓣" + 英文"pet + tale"双关 —— "宠物的故事"）
- **首发市场**：法国（fr-FR）
- **核心场景**：宠物 AI 肖像 + 宠物纪念 + 节日季
- **差异化**："先看后付"（3 张免费预览）+ 7 天无理由退款
- **首发节日**：Pet Memorial Day（2026-09-13，周日）

## 技术栈

| 模块 | 选型 |
|---|---|
| 前端 + 后端 | **Next.js 15**（App Router + Server Actions）|
| 部署 | **Vercel**（首选，5 分钟上线）|
| 数据库 | **Supabase**（Postgres + Storage，免费 500MB）|
| AI 生成 | **Replicate API**（Flux Pro 1.1 主用 + Flux Schnell 备用）|
| 支付 | **Stripe Checkout**（€9.99 单次包）|
| 邮件 | **Resend**（订单 + 退款）|
| 图床 | **Supabase Storage**（与 DB 同源，省钱）|
| 样式 | **Tailwind CSS** + **shadcn/ui** |
| 国际化 | **next-intl**（fr-FR 优先，en-US 备用）|

## 当前 MVP（v0.1）范围

**W1 周一-周五交付**：
- [x] 项目骨架
- [ ] Landing page（hero + email waitlist + 法语文案）
- [ ] Studio 页面：上传宠物照片 → 3 张免费预览
- [ ] Stripe Checkout：€9.99 / 50 张包
- [ ] Supabase 集成：waitlist 表 + uploads 表
- [ ] iOS WebView 包装（Capacitor）

**v0.2 范围（W2+）**：
- LoRA 自训（10 张照片 → 专属模型 → 50 张）
- 节日季限定主题（圣诞、情人节、Halloween）
- 退款流程自动化
- 多语言切换（en-FR + en-US）

## 快速启动

### 1. 准备 API 密钥

注册以下服务并拿 API key（链接在 `.env.example`）：

| 服务 | 用途 | 成本 |
|---|---|---|
| Replicate | AI 生成 | $5 免费额度 → pay-as-you-go |
| Stripe | 支付 | 0%（测试模式）|
| Supabase | 数据库 + 图床 | 免费 500MB |
| Resend | 邮件 | 100 封/天免费 |
| Vercel | 部署 | 免费 hobby |

### 2. 克隆并配置

```bash
cd ~/.openclaw/workspace/projects/petale
pnpm install
cp .env.example .env.local
# 填入所有 API key
```

### 3. 启动 dev server

```bash
pnpm dev
# 打开 http://localhost:3000
```

### 4. 验证 API 连接

```bash
pnpm test:replicate   # 验证 Replicate + flux-2-pro
pnpm test:supabase    # 验证 Supabase + 表结构 + Storage
```

### 5. 部署

```bash
# 第一次：vercel link + vercel env add（每个 key 一次）
vercel --prod
```

## 项目结构

```
petale/
├── app/
│   ├── layout.tsx             # 根布局 + SEO meta
│   ├── page.tsx               # Landing（hero + waitlist）
│   ├── globals.css
│   ├── studio/page.tsx        # 上传 + 预览核心 loop
│   └── api/
│       ├── waitlist/route.ts  # POST: 邮箱订阅
│       ├── generate/route.ts  # POST: 出图（Replicate）
│       ├── checkout/route.ts  # POST: Stripe Checkout session
│       └── webhook/route.ts   # Stripe webhook → 发邮件
├── components/
│   ├── Hero.tsx               # Hero section
│   ├── EmailForm.tsx          # Waitlist 表单
│   ├── UploadPreview.tsx      # 上传 + 预览组件
│   └── Footer.tsx
├── lib/
│   ├── replicate.ts           # Replicate 客户端封装
│   ├── stripe.ts              # Stripe 客户端封装
│   ├── resend.ts              # 邮件发送
│   ├── supabase.ts            # 数据库客户端
│   └── prompts.ts             # 宠物肖像 prompt 模板
├── public/                    # 静态资源
├── .env.example               # 环境变量模板
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 域名 + 品牌资产

| 资产 | 状态 |
|---|---|
| petale.app | 🟡 Porkbun 待购（€10-30）|
| petale.io / .ai | ⚪ Cloudflare Registrar 待查 |
| petale.fr | 🟡 询价中 |
| petale.com | 🟡 Afternic 待购（€500+）|
| Twitter @petale_ai | 🟢 可注册 |
| Instagram @petale.ai | 🟢 待注册 |
| TikTok @petale.ai | 🟢 待注册 |

## 营销节点（v0.1 MVP 准备期）

| 日期 | 节日 | 准备状态 |
|---|---|---|
| **2026-09-13** | Pet Memorial Day | 🎯 **首发目标** |
| 2026-09-26 | National Dog Day | W3 |
| 2026-10-29 | National Cat Day | W5 |
| 2026-10-31 | Halloween | W5-W6 |
| 2026-12-25 | Christmas | W10-W12 |

## 6 周 KPI

- 安装量：**1000+**
- 付费转化：**50+**（5% benchmark）
- Apple Search Ads CPA：**< €3**
- €500 预算：**break-even 或微利**

---

_此 README 由 petale v0.1 启动包生成 · 2026-09-06_