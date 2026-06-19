import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLANS = {
  starter: {
    name: 'AIVisible Starter',
    price: 2900, // $29.00 in cents
    interval: 'month' as const,
  },
  pro: {
    name: 'AIVisible Pro',
    price: 7900, // $79.00 in cents
    interval: 'month' as const,
  },
};

export async function POST(req: NextRequest) {
  const { plan, brandId, brandName } = await req.json();

  const planConfig = PLANS[plan as keyof typeof PLANS];
  if (!planConfig) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const baseUrl = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: planConfig.name,
            description: `AI search optimization for ${brandName}`,
          },
          unit_amount: planConfig.price,
          recurring: { interval: planConfig.interval },
        },
        quantity: 1,
      },
    ],
    metadata: { brandId, plan },
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&brand=${brandId}`,
    cancel_url: `${baseUrl}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
