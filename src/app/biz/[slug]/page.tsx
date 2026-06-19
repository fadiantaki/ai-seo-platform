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

        {/* Header — fully public */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl font-bold">{brand.name}</h1>
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-900/50 text-green-300">
              ✓ Listed on AIVisible
            </span>
          </div>
          <p className="text-slate-400 mb-4">
            {brand.city} · Ships to {brand.ships_to} · {priceLabel[brand.price_range] ?? brand.price_range}
          </p>
          <div className="flex flex-wrap gap-2">
            {brand.style?.map((s: string) => (
              <span key={s} className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Private stats — blurred with claim CTA */}
        <div className="relative mb-10">
          {/* Blurred stats behind the overlay */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 blur-sm select-none pointer-events-none" aria-hidden>
            {[
              { value: '2,400', label: 'AI searches / mo', color: 'text-purple-400' },
              { value: '94%', label: 'Visibility score', color: 'text-green-400' },
              { value: '12', label: 'Active AI queries', color: 'text-pink-400' },
              { value: '#3', label: 'Category rank', color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Claim overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-950/90 backdrop-blur-sm border border-purple-700/40 rounded-2xl px-8 py-6 text-center max-w-sm mx-4">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-bold mb-1 text-white">This is your brand?</h3>
              <p className="text-slate-400 text-sm mb-4">
                Claim it to see your AI search stats, visibility score, and which queries drive traffic to you.
              </p>
              <Link
                href={`/dashboard?claim=${brand.slug}`}
                className="block bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Claim {brand.name} — it&apos;s free
              </Link>
            </div>
          </div>
        </div>

        {/* About — public */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-3">About</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{brand.description}</p>
          {brand.target_audience && (
            <p className="text-slate-500 text-sm mt-3">Target audience: {brand.target_audience}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Specialties — public */}
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

          {/* Certifications — public */}
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

        {/* Top queries — blurred */}
        <div className="relative mb-6">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 blur-sm select-none pointer-events-none" aria-hidden>
            <h2 className="font-semibold mb-3">Top AI queries</h2>
            <ul className="space-y-2">
              {['best fashion brand in Cairo', 'luxury Egyptian designer', 'where to buy local Egyptian fashion'].map(q => (
                <li key={q} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">→</span> {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-950/80 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
              <p className="text-sm text-slate-300 font-medium">🔒 Visible to brand owner only</p>
              <Link href={`/dashboard?claim=${brand.slug}`} className="text-xs text-purple-400 hover:text-purple-300 mt-1 block">
                Claim your brand →
              </Link>
            </div>
          </div>
        </div>

        {/* AI data endpoint — public, this is a selling point to show */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold">AI data endpoint</h2>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">Claude & ChatGPT read this</span>
          </div>
          <p className="text-sm text-slate-500 mb-3">
            This is the structured data file that AI models read when someone asks about {brand.name}
          </p>
          <a href={`https://ai-seo-platform-dun.vercel.app/api/llms/${brand.slug}`}
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-green-400 hover:text-green-300 font-mono break-all transition-colors">
            {`https://ai-seo-platform-dun.vercel.app/api/llms/${brand.slug}`}
          </a>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-6 text-center">
          <h3 className="font-bold mb-2">Is this your brand?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Claim your free profile to get your embed script, see your AI search analytics, and take control of how AI describes your brand.
          </p>
          <Link href={`/dashboard?claim=${brand.slug}`}
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
            Claim {brand.name} free →
          </Link>
        </div>
      </div>
    </main>
  );
}
