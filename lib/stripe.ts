/**
 * Stripe 客户端封装
 */

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

/**
 * 创建 Checkout Session
 * @param priceId Stripe Price ID（€9.99 单次包）
 * @param metadata 透传给 webhook 的元数据（userId, imageUrl, style 等）
 */
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  metadata,
  customerEmail,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
  customerEmail?: string;
}) {
  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata,
    locale: 'fr',
    payment_intent_data: {
      metadata,
      statement_descriptor: 'petale',
    },
  });
}

/**
 * 创建退款
 * @param sessionId Checkout Session ID
 * @param reason 退款原因（可选）
 */
export async function refundCheckoutSession(sessionId: string, reason?: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session.payment_intent) {
    throw new Error('No payment intent on session');
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent.id;

  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: 'requested_by_customer',
    metadata: reason ? { reason } : undefined,
  });
}

/**
 * 验证 webhook 签名
 */
export function constructWebhookEvent(payload: string, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
}