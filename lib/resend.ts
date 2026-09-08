/**
 * Resend 邮件客户端
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hello@petale.app';

export async function sendWaitlistConfirmation(email: string) {
  return resend.emails.send({
    from: `petale <${FROM_EMAIL}>`,
    to: email,
    subject: 'Vous êtes sur la liste petale 🐾',
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #2e1810;">
        <h1 style="font-family: Fraunces, Georgia, serif; color: #c87838; font-size: 28px;">Merci !</h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Vous êtes sur la liste d'attente petale. On vous écrira avant le
          <strong>13 septembre</strong> (Journée du Souvenir Animal) avec un accès anticipé
          et un code promo exclusif pour le Pack 50.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          En attendant, voici 3 portraits artistiques gratuits de votre compagnon.
          Téléchargez une photo sur <a href="https://petale.app/studio" style="color: #c87838;">petale.app/studio</a> —
          vous voyez avant de payer.
        </p>
        <p style="font-size: 14px; color: #834626; margin-top: 32px;">
          — L'équipe petale 🐶🐱
        </p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation({
  email,
  imageUrl,
  zipUrl,
}: {
  email: string;
  imageUrl: string;
  /** v0.1.18: 单一 ZIP 链接（替代 12 个单独链接）*/
  zipUrl: string;
}) {
  return resend.emails.send({
    from: `petale <${FROM_EMAIL}>`,
    to: email,
    subject: 'Vos portraits petale sont prêts 🎨',
    html: `
      <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #2e1810;">
        <h1 style="font-family: Fraunces, Georgia, serif; color: #c87838; font-size: 28px;">
          Merci pour votre confiance.
        </h1>
        <p style="font-size: 16px; line-height: 1.6;">
          Vos 12 portraits haute définition sont prêts. <strong>Un seul clic pour tout télécharger</strong> dans un fichier ZIP.
          Chaque style est numéroté (01-watercolor.jpg, 02-renaissance.jpg, etc.) pour faciliter l'impression.
        </p>

        <div style="margin: 32px 0; text-align: center;">
          <img src="${imageUrl}" alt="Portrait petale" style="max-width: 100%; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);" />
        </div>

        <div style="margin: 32px 0; text-align: center;">
          <a href="${zipUrl}" style="display: inline-block; padding: 16px 40px; background: #c87838; color: white; text-decoration: none; border-radius: 999px; font-size: 18px; font-weight: 600; box-shadow: 0 8px 24px rgba(200, 120, 56, 0.3);">
            📦 Télécharger tous mes portraits (ZIP)
          </a>
          <p style="font-size: 12px; color: #834626; margin-top: 12px;">
            12 portraits · haute définition · libres de droits
          </p>
        </div>

        <p style="font-size: 14px; color: #834626; margin-top: 32px;">
          Pas convaincu ? Répondez à cet email sous 7 jours, on vous rembourse intégralement.
        </p>
        <p style="font-size: 14px; color: #834626;">
          — L'équipe petale 🐾
        </p>
      </div>
    `,
  });
}