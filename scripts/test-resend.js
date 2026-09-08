#!/usr/bin/env node
/**
 * Resend 测试：发一封测试邮件
 * 验证：
 * 1. API key 有效
 * 2. From 邮箱可发
 * 3. 域名验证状态
 *
 * 用法：
 *   pnpm test:resend  (或 node --env-file=.env.local scripts/test-resend.js)
 *   带收件人： pnpm test:resend -- your@email.com
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const RECIPIENT = process.argv[2] || 'zhyphil@gmail.com'; // 师傅自己的邮箱

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY 未设置');
    console.error('   检查 .env.local');
    process.exit(1);
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@petale.love';
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log('🐾 petale Resend 测试');
  console.log('   From:', fromEmail);
  console.log('   To:', RECIPIENT);
  console.log('');

  try {
    const result = await resend.emails.send({
      from: `petale <${fromEmail}>`,
      to: RECIPIENT,
      subject: '🐾 petale 测试邮件 — Resend 集成验证',
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="font-family: Fraunces, Georgia, serif; color: #c87838; font-size: 28px;">
            🎉 petale Resend 集成成功
          </h1>
          <p style="font-size: 16px; line-height: 1.6; color: #2e1810;">
            这是一封测试邮件，用于验证 petale 项目邮件系统跑通。
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #2e1810;">
            如果你看到这封邮件，意味着：
          </p>
          <ul style="font-size: 14px; line-height: 1.8; color: #553020;">
            <li>✅ Resend API key有效</li>
            <li>✅ ${fromEmail} 能发送邮件</li>
            <li>⚠️ 邮件可能在<strong>垃圾箱</strong>（如未验证域名）</li>
          </ul>
          <p style="font-size: 14px; color: #834626; margin-top: 32px;">
            — L'équipe petale 🐾
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('❌ Resend 错误:', result.error);
      process.exit(1);
    }

    console.log('✅ 邮件已发送');
    console.log('   Message ID:', result.data?.id);
    console.log('');
    console.log('下一步：检查 ' + RECIPIENT + ' 的收件箱（含垃圾箱）');
  } catch (err) {
    console.error('❌ 发送失败:', err.message);
    if (err.message.includes('403')) {
      console.error('   → 域名未验证，只能发到 Resend 账户邮箱');
      console.error('   → 需要先在 Resend 完成域名验证');
    } else if (err.message.includes('401')) {
      console.error('   → RESEND_API_KEY 错误，检查 .env.local');
    } else if (err.message.includes('422')) {
      console.error('   → From 邮箱格式不对或域名未验证');
    }
    process.exit(1);
  }
}

main();