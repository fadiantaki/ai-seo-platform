import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments not yet enabled' }, { status: 503 });
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const { plan, brandId, brandName } = await req.json();

  const PLANS: Record<string, { name: string; price: number; interval: 'month' }> = {
    starter: { name: 'AIVisible Starter', price: 2900, interval: 'month' },
    pro: { name: 'AIVisible Pro', price: 7900, interval: 'month' },
  };

  const planConfig = PLANS[plan];
  if (!planConfig) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const baseUrl = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: planConfig.name, description: `AI search optimization for ${brandName}` },
        unit_amount: planConfig.price,
        recurring: { interval: planConfig.interval },
      },
      quantity: 1,
    }],
    metadata: { brandId, plan },
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&brand=${brandId}`,
    cancel_url: `${baseUrl}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
