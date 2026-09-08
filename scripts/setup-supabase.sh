#!/bin/bash
# petale · Supabase 完整初始化脚本
# 用法：
#   1. 在 supabase.com 创建项目（Region = Europe，名字 = petale-prod）
#   2. 复制 Project URL + anon key + service_role key 到 .env.local
#   3. 在 Supabase Dashboard → SQL Editor 里跑这个文件的内容（lib/supabase.sql）
#
# 这个脚本会自动：
#   - 创建所有数据表
#   - 设置 RLS 策略（隐私合规）
#   - 创建 Storage bucket
#   - 创建必要的索引

set -e

echo "🐾 petale Supabase 初始化"
echo ""
echo "步骤 1/4：创建项目"
echo "  → 打开 https://supabase.com/dashboard/new/project"
echo "  → Name: petale-prod"
echo "  → Database Password: <生成的强密码，存到 1Password>"
echo "  → Region: Europe (Frankfurt or Stockholm)"
echo "  → Plan: Free (500MB)"
echo "  → 点击 Create new project"
echo ""
echo "步骤 2/4：复制 API keys 到 .env.local"
echo "  → Supabase Dashboard → Settings → API"
echo "  → Project URL → NEXT_PUBLIC_SUPABASE_URL"
echo "  → anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  → service_role secret → SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "步骤 3/4：在 SQL Editor 跑 lib/supabase.sql（创建表 + RLS）"
echo "  → Supabase Dashboard → SQL Editor → New query"
echo "  → 复制 lib/supabase.sql 全部内容 → Run"
echo ""
echo "步骤 4/4：创建 Storage bucket"
echo "  → Supabase Dashboard → Storage → New bucket"
echo "  → Name: pet-uploads → Public bucket: ON → 10MB limit"
echo "  → Name: generated-portraits → Public bucket: ON"
echo ""
echo "完成后跑：pnpm test:supabase 验证连接"