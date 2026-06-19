'use client';
import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Schema.org JSON-LD injection',
      'llms.txt generation',
      'AI meta tags',
      '1 brand listing',
      'Basic profile page',
    ],
    cta: 'Start free',
    highlight: false,
    href: '/dashboard',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: [
      'Everything in Free',
      'AI search analytics dashboard',
      'Priority directory ranking',
      'Monthly AI visibility report',
      'Embed script status tracking',
      'Up to 3 brand listings',
    ],
    cta: 'Start Starter',
    highlight: true,
    href: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    period: '/month',
    features: [
      'Everything in Starter',
      'MCP server endpoint',
      'Direct Claude tool integration',
      'Competitor AI tracking',
      'AI mention alerts',
      'Unlimited brand listings',
    ],
    cta: 'Start Pro',
    highlight: false,
    href: null,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan,
        brandId: 'new',
        brandName: 'Your Brand',
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
          Register your brand
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-3">Simple pricing</h1>
          <p className="text-slate-400">Start free. Upgrade when AI search starts driving real traffic.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div key={plan.id} className={`rounded-2xl p-6 border flex flex-col ${plan.highlight ? 'bg-purple-900/40 border-purple-500' : 'bg-white/5 border-white/10'}`}>
              {plan.highlight && <div className="text-xs text-purple-300 font-semibold mb-3 uppercase tracking-wider">Most popular</div>}
              <div className="text-xl font-bold mb-1">{plan.name}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-slate-400 mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span> {f}
                  </li>
                ))}
              </ul>
              {plan.href ? (
                <Link href={plan.href}
                  className="block text-center py-3 rounded-xl font-semibold transition-colors bg-purple-600 hover:bg-purple-500 text-white">
                  {plan.cta}
                </Link>
              ) : (
                <div className="relative">
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl font-semibold cursor-not-allowed opacity-40 ${plan.highlight ? 'bg-purple-600 text-white' : 'border border-white/20 text-white'}`}>
                    {plan.cta}
                  </button>
                  <div className="mt-2 text-center text-xs text-slate-500">Coming soon</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          Paid plans coming soon · Start free today · No credit card required
        </div>
      </div>
    </main>
  );
}
