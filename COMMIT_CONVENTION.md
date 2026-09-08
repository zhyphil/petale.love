# petale · Commit Convention（v0.1.21）

师傅 GitHub 仓库已建（`github.com/zhyphil/petale.love`）→ 每次改动 commit + push 同步。

## 🎯 规则

**格式**（Conventional Commits 简化版）：
```
<type>(<scope>): <subject>
```

## 📋 Type 速查

| Type | 用途 | 例子 |
|---|---|---|
| `feat` | 新功能（用户能感知）| `feat(studio): show 6 free preview portraits` |
| `fix` | bug 修复 | `fix(webhook): use public_url not original_image_url` |
| `refactor` | 重构（无功能变化）| `refactor(backend): extract generateFullPackAndEmail` |
| `perf` | 性能 | `perf(studio): parallel + auto-retry 6 portraits` |
| `chore` | 杂项 | `chore(deps): add archiver for ZIP` |
| `docs` | 文档 | `docs(HANDOFF): add Vercel deploy checklist` |
| `test` | 测试 | `test: add test-resend.js` |
| `lint` | linter | `lint: fix TS errors in zip-pack.ts` |
| `style` | 格式 | `style: prettier reformat` |
| `frontend` | 前端（components/pages）| `frontend(hero): update title to petale` |
| `backend` | 后端（API routes/lib）| `backend(zip): add packagePortraitsAsZip` |
| `fullstack` | 跨端 | `fullstack(email): switch to noreply@` |

## 📋 Scope 速查

| Scope | 范围 |
|---|---|
| `studio` | `/app/studio/` 上传流程 |
| `landing` | `/app/page.tsx` 首页 |
| `api` | 通用 API |
| `webhook` | `/api/webhook` |
| `email` | Resend / 邮件 |
| `stripe` | Stripe 集成 |
| `supabase` | Supabase |
| `replicate` | Replicate |
| `zip` | ZIP 打包 |
| `config` | 配置文件 |
| `deps` | 依赖 |
| `docs` | 文档 |

## ✅ 实际例子（这次 v0.1 → v0.1.20 所有提交）

```bash
git add -A
git commit -m "feat(studio): show 6 free preview portraits instead of 3

- 6 styles: watercolor, renaissance, manga, pop-art, cyberpunk, noel
- Generate in parallel + auto-retry on 429
- Saves to generated_portraits table
- Cost: ~\$0.36/user (down from ~\$1.08 with full flow)

Closes: #1"

git add -A
git commit -m "fix(webhook): use public_url not original_image_url

字段名不匹配导致 webhook 静默失败 (50 张肖像永远不生成)
v0.1.15 修复"

git add -A
git commit -m "fullstack(email): package 12 portraits in 1 ZIP

- archiver v8 (ESM-only) → use ZipArchive class
- Email: 1 download button instead of 12
- Filename pattern: 01-watercolor.jpg, 02-renaissance.jpg, etc.
- Upload to Supabase Storage (generated-portraits bucket)"

git add -A
git commit -m "chore: switch from hello@ to noreply@petale.love

System email (Resend FROM) → noreply@
Contact email (Footer/Privacy/CGU) → hello@
Same petale.love domain verified by Resend"
```

## 🔄 日常流程

```bash
# 1. 改代码
# 2. git add -A
git add -A

# 3. git commit -m "..."  (用上面格式)
git commit -m "feat(studio): 6 portraits grid layout"

# 4. git push
git push origin main
```

## ⚠️ 重要规则

- ✅ 永远**用 Conventional Commits 格式**
- ✅ **subject 50 字符内**（中英文都行）
- ✅ **body 72 字符/行**（解释 WHY）
- ❌ **不要 commit .env.local**（在 .gitignore 里）
- ❌ **不要 commit node_modules/**

## 🛠️ 第一次 push 设置

```bash
cd ~/.openclaw/workspace/projects/petale

# 关联 GitHub 仓库
git remote add origin git@github.com:zhyphil/petale.love.git

# 首次推送
git add -A
git commit -m "chore: initial commit (v0.1.20)
- Next.js 15 + Tailwind + Replicate + Stripe + Supabase + Resend
- Landing page (10 components, French)
- Studio: upload + 6 free preview portraits
- Stripe Checkout + webhook + ZIP email
- Privacy Policy + CGU (GDPR)"
git push -u origin main
```

> ⚠️ MEMORY.md 之前有 "No push rule" — 师傅**明确要求** push 同步 GitHub，**覆盖**之前的规则。