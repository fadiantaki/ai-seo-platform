import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

const priceLabel: Record<string, string> = {
  '$': 'Budget-friendly', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

export default async function BizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!brand) notFound();

  const embedInstalled = brand.embed_installed ?? false;
  const llmsUrl = `https://ai-seo-platform-dun.vercel.app/api/llms/${brand.id}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <Link href="/directory" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Back to directory
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${brand.plan === 'pro' ? 'bg-purple-900 text-purple-300' : brand.plan === 'starter' ? 'bg-blue-900 text-blue-300' : 'bg-white/10 text-slate-400'}`}>
              {brand.plan.charAt(0).toUpperCase() + brand.plan.slice(1)}
            </span>
            {embedInstalled ? (
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-900 text-green-300">✓ AI-optimized</span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-red-900/50 text-red-300">⚠ Script not installed</span>
            )}
          </div>
          <p className="text-slate-400 mb-4">{brand.city} · Ships to {brand.ships_to} · {priceLabel[brand.price_range] ?? brand.price_range}</p>
          <div className="flex flex-wrap gap-2">
            {brand.style?.map((s: string) => (
              <span key={s} className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Script not installed CTA */}
        {!embedInstalled && (
          <div className="bg-orange-900/20 border border-orange-700/40 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-orange-300 mb-1">Embed script not installed</p>
              <p className="text-sm text-slate-400">This brand is listed but not yet AI-optimized. Install the script to start appearing in AI search results.</p>
            </div>
            <Link href="/dashboard" className="shrink-0 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              Get script
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-purple-400 mb-1">{brand.ai_searches?.toLocaleString() ?? 0}</div>
              <div className="text-sm text-slate-400">AI searches / month</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-green-400 mb-1">{brand.top_queries?.length ?? 0}</div>
              <div className="text-sm text-slate-400">Active AI queries</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-pink-400 mb-1">{brand.certifications?.length ?? 0}</div>
              <div className="text-sm text-slate-400">Certifications</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-orange-400 mb-1">{brand.specialties?.length ?? 0}</div>
              <div className="text-sm text-slate-400">Signature products</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-sm text-slate-400 uppercase tracking-wider">Top AI queries</h3>
            {brand.top_queries?.length > 0 ? (
              <ul className="space-y-2">
                {brand.top_queries.map((q: string) => (
                  <li key={q} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">→</span> {q}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No queries tracked yet. Install the embed script to start tracking.</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-3">About</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{brand.description}</p>
          {brand.target_audience && <p className="text-slate-500 text-sm mt-3">Target audience: {brand.target_audience}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {brand.specialties?.length > 0 && (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h2 className="font-semibold mb-3">Signature products</h2>
              <ul className="space-y-2">
                {brand.specialties.map((s: string) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-pink-400">✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Certifications & values</h2>
            {brand.certifications?.length > 0 ? (
              <ul className="space-y-2">
                {brand.certifications.map((c: string) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-green-400">✓</span> {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No certifications listed yet.</p>
            )}
            {brand.website && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <a href={brand.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Visit website →
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold">AI data endpoint</h2>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">AI reads this</span>
          </div>
          <p className="text-sm text-slate-500 mb-3">This URL is what Claude, ChatGPT and Perplexity read about this brand</p>
          <a href={llmsUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-400 hover:text-green-300 font-mono break-all transition-colors">
            {llmsUrl}
          </a>
        </div>

        {brand.plan === 'free' && (
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-6 text-center">
            <h3 className="font-bold mb-2">Unlock full AI visibility</h3>
            <p className="text-slate-400 text-sm mb-4">Upgrade to Starter to get analytics, priority ranking, and monthly AI reports</p>
            <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              Upgrade to Starter — $29/mo
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
