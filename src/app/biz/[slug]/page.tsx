import Link from 'next/link';
import { fashionBrands } from '@/lib/fashion-brands';
import { notFound } from 'next/navigation';

const priceLabel: Record<string, string> = {
  '$': 'Budget-friendly', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

export default async function BizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = fashionBrands.find(b => b.slug === slug);
  if (!brand) notFound();

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
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${brand.plan === 'pro' ? 'bg-purple-900 text-purple-300' : brand.plan === 'starter' ? 'bg-blue-900 text-blue-300' : 'bg-white/10 text-slate-400'}`}>
              {brand.plan.charAt(0).toUpperCase() + brand.plan.slice(1)}
            </span>
          </div>
          <p className="text-slate-400 mb-4">{brand.city} · Ships to {brand.shipsTo} · {priceLabel[brand.priceRange]}</p>
          <div className="flex flex-wrap gap-2">
            {brand.style.map(s => (
              <span key={s} className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* AI search stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-purple-400 mb-1">{brand.aiSearches.toLocaleString()}</div>
              <div className="text-sm text-slate-400">AI searches / month</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-green-400 mb-1">{brand.topQueries.length}</div>
              <div className="text-sm text-slate-400">Active AI queries</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-pink-400 mb-1">{brand.certifications.length}</div>
              <div className="text-sm text-slate-400">Certifications</div>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-3xl font-black text-orange-400 mb-1">{brand.specialties.length}</div>
              <div className="text-sm text-slate-400">Signature products</div>
            </div>
          </div>

          {/* Top AI queries */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-sm text-slate-400 uppercase tracking-wider">Top AI queries</h3>
            <ul className="space-y-2">
              {brand.topQueries.map(q => (
                <li key={q} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">→</span> {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* About */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-3">About</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{brand.description}</p>
          <p className="text-slate-500 text-sm mt-3">Target audience: {brand.targetAudience}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Specialties */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Signature products</h2>
            <ul className="space-y-2">
              {brand.specialties.map(s => (
                <li key={s} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-pink-400">✦</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Certifications & values</h2>
            <ul className="space-y-2">
              {brand.certifications.map(c => (
                <li key={c} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span> {c}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <a href={brand.website} target="_blank" rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Visit website →
              </a>
            </div>
          </div>
        </div>

        {/* llms.txt */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold">AI data endpoint</h2>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">AI reads this</span>
          </div>
          <p className="text-sm text-slate-500 mb-3">This URL is what Claude, ChatGPT and Perplexity read when answering queries about this brand</p>
          <a href={llmsUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-400 hover:text-green-300 font-mono break-all transition-colors">
            {llmsUrl}
          </a>
        </div>

        {/* Upgrade CTA for free plan */}
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
