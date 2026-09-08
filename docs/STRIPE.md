# Stripe 集成完整指南（petale）

> 本指南按顺序执行，每步30 秒 - 2 分钟

## Step 1：注册 + 激活 Stripe 账号（5 分钟）

**步骤 1.1**：打开 [dashboard.stripe.com/register](https://dashboard.stripe.com/register)

**步骤 1.2**：填表（用**真实法国公司信息或个人身份**）：
- Email
- Full name (e.g. "Phil Z.")
- Country: **France**
- 默认会创建法国 EUR 账户

**步骤 1.3**：激活账户（会要求验证手机号 + 银行卡 + 身份证件）

> 💡 **测试模式**：激活后默认是 **Test mode**（左下角 toggle）。所有支付都是模拟的，不用真的扣钱。

---

## Step 2：创建 Product + Price（2 分钟）

**步骤 2.1**：打开 [dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)

**步骤 2.2**：点 **"+ Add product"**

**步骤 2.3**：填：

| 字段 | 填什么 |
|---|---|
| Name | `petale Pack 50` |
| Description | `50 portraits artistiques HD de votre animal · 12 styles · Satisfait ou remboursé 7 jours` |
| Image | (跳过，v0.1 不需要) |
| Pricing model | **One-time**（一次性付款，不是订阅）|
| Price | `9.99 EUR` |
| Currency | `EUR` |
| Tax behavior | (默认 `No tax` 或根据法区设置) |
| Recurring | 跳过（因为是 one-time） |

**步骤 2.4**：点 **Save product**

**步骤 2.5**：复制 **Price ID**（格式 `price_xxxxxxxxxxxxxxxxxxxxxxxx`）→ 填到 `.env.local` 的 `STRIPE_PRICE_ID_EUR`

---

## Step 3：拿 API keys（30 秒）

**步骤 3.1**：打开 [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

**步骤 3.2**：你会看到：

| 在 Stripe Dashboard 看到 | 复制到 `.env.local` |
|---|---|
| **Publishable key**（`pk_test_...`）| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Secret key**（`sk_test_...`）→ 点 **Reveal** 才能看完整 | `STRIPE_SECRET_KEY` |

⚠️ Secret key 复制时点 **Reveal** 按钮，**不能截图**（会暴露）。

---

## Step 4：本地测试 Stripe Webhook（需要 Stripe CLI）

### 安装 Stripe CLI（macOS）：

```bash
brew install stripe/stripe-cli/stripe
```

或者下载 .pkg：[github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)

### 登录 Stripe CLI：

```bash
stripe login
```

浏览器会打开让你授权。

### 启动 webhook 监听：

```bash
cd /Users/haoyuzuo/.openclaw/workspace/projects/petale
stripe listen --forward-to localhost:3000/api/webhook
```

**会输出类似**：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxx (this is for `whsec_...`)
```

**复制 `whsec_...`** → 填到 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`

---

## Step 5：填 .env.local

```bash
cd /Users/haoyuzuo/.openclaw/workspace/projects/petale
nano .env.local
```

填这些（替换 *** 为真实值）：

```bash
# ===== Stripe（test mode）=====
STRIPE_SECRET_KEY=***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=***
STRIPE_WEBHOOK_SECRET=***
STRIPE_PRICE_ID_EUR=price_xxxxxxxxxxxxxxxxxxxxxxxx
```

保存退出。

---

## Step 6：启动本地测试

```bash
cd /Users/haoyuzuo/.openclaw/workspace/projects/petale

# 1. 启动 webhook 监听（另一个 terminal window，保持运行）
stripe listen --forward-to localhost:3000/api/webhook

# 2. 启动 Next.js dev server
pnpm dev
```

---

## Step 7：完整流程测试（端到端）

**步骤 7.1**：浏览器打开 `http://localhost:3000`

**步骤 7.2**：点 "Essayer maintenant" → `/studio` 页面

**步骤 7.3**：上传任意宠物照片（找一张你家宠物的）

**步骤 7.4**：等待 15-30 秒，**看到 3 张免费预览**（如果 Replicate token 有效）

**步骤 7.5**：输入邮箱 + 点 "Continuer · €9,99"

**步骤 7.6**：被跳转到 **Stripe Checkout**，用测试卡支付：

| 字段 | 填什么 |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry | 任意未来日期（如 `12/30`）|
| CVC | 任意 3 位（如 `123`）|
| Name | 任意 |
| Email | 任意（如 `test@petale.app`）|

**步骤 7.7**：支付成功 → 跳回 `/studio?success=true`

**步骤 7.8**：在 **stripe listen 窗口**看到 `checkout.session.completed` 事件
**步骤 7.9**：在 Supabase Dashboard → `orders` 表看到新订单，status = `completed`
**步骤 7.10**：在 Resend Dashboard（如果已配置）看到订单邮件发送

---

## 🎉 完成！

如果所有步骤都通了，petale **MVP v0.1 完整跑通**。

---

## 🆘 常见问题

**Stripe Checkout 跳回时显示 `?canceled=true`**：测试卡被 Stripe 风控了，换一张（如 `4000 0025 0000 3155` 需 3DS 验证）

**Webhook 没触发**：
- 检查 `stripe listen` 是否在另一个 terminal 运行
- 检查 `STRIPE_WEBHOOK_SECRET` 跟 `stripe listen` 输出的 `whsec_...` 一致

**支付成功后 `orders.status` 仍是 `pending`**：
- Webhook 没收到
- 检查 `app/api/webhook/route.ts` 里的签名验证是否通过
- 看 Vercel/Next.js dev 日志

---

## 🌍 切到 Live Mode（生产）

MVP 跑通后再切：
1. Stripe Dashboard 左下角 toggle 到 **Live**
2. 重新生成 Live API keys（`sk_live_...` 和 `pk_live_...`）
3. 创建 Live Product + Price
4. 在 Live webhook 设置里加 endpoint `https://petale.app/api/webhook`
5. 更新 Vercel env（用 `vercel env add STRIPE_SECRET_KEY` 等命令）

> ⚠️ **不要在测试完成前切 Live** —— Live 模式真的扣钱。