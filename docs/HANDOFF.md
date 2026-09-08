# petale 项目状态（v0.1.4 · 2026-09-06 22:42 GMT+2 收工快照）

> 师傅今晚到此为止。明天接着干。所有进度都在这里 + `memory/2026-09-06.md`。

## 🎯 一句话现状

**petale v0.1.4 已构建 + 真实宠物测试成功**（Aquarelle + Renaissance 两张都很赞）。**今晚最终品牌决策**：从 museau **改名 petale**（法语"花瓣" + 英文"pet + tale"双关），原因是 museau.pet 已被法国竞品占用（实体画框 + 邮寄业务）。**唯一缺**：域名购买 + Stripe / Resend 完整集成 + Replicate 余额充值。**8 天后（9-13）Pet Memorial Day 是首发窗口**。

## 🎨 品牌决策历史

| 时间 | 决策 | 原因 |
|---|---|---|
| 21:11 | Museau（法语"口鼻"）| 最初品牌 |
| 22:34 | **改名 petale**（"pet + tale"双关）| Museau.pet 已被法国宠物肖像竞品占用，**避免 SEO/品牌冲突** |

## ✅ 今晚已搞定

| 项 | 状态 | 备注 |
|---|---|---|
| **Next.js 15 项目骨架** | ✅ 34 个文件 | `~/.openclaw/workspace/projects/petale/`（2026-09-08 师傅重命名，**品牌+目录 100% 一致**）|
| **Landing page** | ✅ 全法语 + SEO | 10 个组件：Hero/Features/Examples/HowItWorks/Pricing/FAQ/CTA 等 |
| **API 路由** | ✅ 5 个 | waitlist / upload / generate / checkout / webhook |
| **数据库 schema** | ✅ 4 表 + RLS | `lib/supabase.sql` 一键跑过 |
| **Replicate 集成** | ✅ flux-2-pro 跑通 | 13 秒出图，URL 完整解析（v0.1.3 修复） |
| **Supabase 集成** | ✅ 全部 Healthy | Project ID `cttxhefhridvjzzemosk`（Ireland / West EU）|
| **真实宠物端到端测试** | ✅ 2/3 张成功 | 测试猫 Aquarelle + Renaissance 都好看 |
| **Brand 重命名** | ✅ v0.1.4 全项目完成 | Museau → petale（代码 + 配置 + .env）|

## ❌ 今晚没做（明天补齐）

| 项 | 详情 |
|---|---|
| **域名购买** | petale.app + petale.love 两个都没买（museau.app/museau.love 都被占）|
| **Stripe** | 完全没开始 |
| **Stripe Webhook** | 没配置 |
| **Apple Developer** | 没注册 |
| **Vercel 部署** | 没开始 |
| **OG 图 + favicon** | 占位文件 |
| **Privacy Policy + CGU** | GDPR 必需 |
| **iOS WebView 包装** | Capacitor 没装 |
| **Replicate 余额** | ❌ 耗尽（402），需充 $10 |
| **Resend 域验证** | ⏳ API key 创建好但域名未验证 |

## 🌅 明天师傅 9 点的第一步（按顺序）

### Step 1：买域名（30 分钟）

**Porkbun** (主域名 `petale.app`)：
1. 打开 [porkbun.com](https://porkbun.com) → 搜 `petale.app`
2. 注册账户 + 加入购物车 + 付款（€10-30）

**Cloudflare** (营销域名 `petale.love`)：
1. 打开 [dash.cloudflare.com](https://dash.cloudflare.com) → Registrar → 搜 `petale.love`
2. 成本价购买（$20.20/年）

**DNS 统一在 Cloudflare 管**：如果 petale.app 在 Porkbun 买，记得在 Porkbun 把 nameservers 改成 Cloudflare 的（Cloudflare 注册时会给 `anna.ns.cloudflare.com` 等）。

### Step 2：Replicate 充值（1 分钟）⚠️ 重要
1. 打开 [replicate.com/account/billing](https://replicate.com/account/billing)
2. 充 $10

### Step 3：Resend 域验证（10 分钟，1 键搞定）
1. Resend Dashboard → Domains → 点 `petale.love`
2. 点 **"☁️ Auto configure"** 按钮（关键！） → Resend 自动加 DNS 记录
3. 几分钟后点 Verify → 验证成功

### Step 4：填 .env.local（5 分钟）
大部分已 OK，只差 Stripe keys：
```bash
cd ~/.openclaw/workspace/projects/petale
nano .env.local
```

填/确认：
```bash
NEXT_PUBLIC_SUPABASE_URL=***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
REPLICATE_API_TOKEN=***
RESEND_API_KEY=***
RESEND_FROM_EMAIL=noreply@petale.love  # ✅ 已更新（系统发件）
NEXT_PUBLIC_SITE_URL=https://petale.app  # ✅ 已更新
NEXT_PUBLIC_SITE_NAME=petale  # ✅ 已更新

# 待填
STRIPE_SECRET_KEY=***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=***
STRIPE_WEBHOOK_SECRET=***
STRIPE_PRICE_ID_EUR=price_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5：Stripe 集成（30 分钟）
按 `docs/STRIPE.md` 7 步走：
1. 注册 Stripe 账号（5 分钟）
2. 创建 Product（€9.99 Pack 50）（2 分钟）
3. 拿 API keys（30 秒）
4. 装 Stripe CLI + 启动 webhook 监听（5 分钟）
5. 填 .env.local（已在 Step 4 包含）
6. `pnpm dev` + 测试
7. 测试卡 `4242 4242 4242 4242` 端到端测试（5 分钟）

### Step 6：完整端到端验证（15 分钟）
1. `stripe listen --forward-to localhost:3000/api/webhook`
2. `pnpm dev`
3. 浏览器 `http://localhost:3000`
4. 上传你家宠物照片
5. 看到 3 张免费预览
6. 点 "Continuer · €9,99" → Stripe Checkout
7. 测试卡支付 → 跳回 → webhook 触发 → 收到邮件

### Step 7：Vercel 部署 + Capacitor iOS 包装（W1 周五）
1. `npm i -g vercel`
2. `vercel link` + `vercel env add`（每个 key）+ `vercel --prod`
3. **petale.love DNS 解析到 Vercel**
4. Capacitor iOS 包装 → App Store 提交

## 🎯 Pet Memorial Day 倒计时

**今天是 2026-09-06**（周日），Pet Memorial Day 是 **2026-09-13**（下周日）。
**留给 MVP 上线的时间 = 7 天**。

## 💡 品牌名重新定位（重要）

| 维度 | petale |
|---|---|
| 法语 | "pétale"（花瓣）|
| 英文双关 | pet + tale = "pet's story"（宠物的故事）|
| 发音 | 法：peh-TAL / 英：pet-TALE |
| 情感温度 | 抽象 + 诗意（不像 museau 那么具体）|
| SEO 优势 | 不与 museau.pet 法国竞品冲突 |
| 域名空间 | .app / .love / .studio / .art / .design 全干净 |
| App Store | 8 个 storefront 全干净 |

## 💬 下次继续的触发词

- 「petale + [问题]」：项目相关
- 「域名 + petale」：明天买域名
- 「Stripe + petale」：支付集成
- 「Resend + petale」：邮件集成
- 「充值 + petale」：Replicate $10
- 「Vercel + petale」：部署
- 「App Store + petale」：iOS 上架
- 「Pet Memorial Day + petale」：9-13 首发准备

---

_Handoff v0.1.4 · 2026-09-06 22:42 GMT+2_
_Memory: memory/2026-09-06.md_
_Docs: docs/STRIPE.md（明天 Stripe 集成指南）_

> ✅ **目录已重命名为 `petale/`**（2026-09-08）。品牌 + 目录名 100% 一致。