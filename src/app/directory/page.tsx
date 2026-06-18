import Link from 'next/link';
import { fashionBrands } from '@/lib/fashion-brands';

const STYLES = ['All', 'Sustainable', 'Streetwear', 'Luxury', 'Activewear', 'Minimalist', 'Avant-garde'];

const planBadge: Record<string, { label: string; cls: string }> = {
  pro: { label: 'Pro', cls: 'bg-purple-900 text-purple-300' },
  starter: { label: 'Starter', cls: 'bg-blue-900 text-blue-300' },
  free: { label: 'Free', cls: 'bg-white/10 text-slate-400' },
};

const priceLabel: Record<string, string> = {
  '$': 'Budget', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Register your brand
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <div className="text-sm text-purple-400 font-semibold mb-2 uppercase tracking-wider">👗 Fashion Brand Directory</div>
          <h1 className="text-4xl font-bold mb-3">AI-Optimized Fashion Brands</h1>
          <p className="text-slate-400 max-w-xl">
            Every brand here is optimized to appear when AI systems answer fashion queries.
            Pro and Starter members rank higher in AI recommendations.
          </p>
        </div>

        {/* Style filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STYLES.map(s => (
            <span key={s} className={`px-4 py-2 rounded-full text-sm cursor-pointer border transition-colors ${s === 'All' ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/20 text-slate-400 hover:border-white/40 hover:text-white'}`}>
              {s}
            </span>
          ))}
        </div>

        {/* Brand grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {fashionBrands.map(brand => (
            <Link key={brand.id} href={`/biz/${brand.slug}`}
              className="bg-slate-900 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{brand.name}</h2>
                  <p className="text-sm text-slate-500">{brand.city} · {brand.shipsTo} shipping</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${planBadge[brand.plan].cls}`}>
                  {planBadge[brand.plan].label}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{brand.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {brand.style.map(s => (
                  <span key={s} className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{s}</span>
                ))}
                <span className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{priceLabel[brand.priceRange]}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-xs text-slate-400">
                    <span className="text-white font-semibold">{brand.aiSearches.toLocaleString()}</span> AI searches/mo
                  </span>
                </div>
                <span className="text-xs text-purple-400 group-hover:text-purple-300">View profile →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get your brand listed</h2>
          <p className="text-slate-400 mb-6">Join {fashionBrands.length}+ fashion brands appearing in AI search results</p>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Register free
          </Link>
        </div>
      </div>
    </main>
  );
}
