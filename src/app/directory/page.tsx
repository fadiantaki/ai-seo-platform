import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const planBadge: Record<string, { label: string; cls: string }> = {
  pro: { label: 'Pro', cls: 'bg-purple-900 text-purple-300' },
  starter: { label: 'Starter', cls: 'bg-blue-900 text-blue-300' },
  free: { label: 'Free', cls: 'bg-white/10 text-slate-400' },
};

const priceLabel: Record<string, string> = {
  '$': 'Budget', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

async function getBrands() {
  const { data } = await supabase
    .from('brands')
    .select('*')
    .order('is_local', { ascending: false })
    .order('ai_searches', { ascending: false });
  return data ?? [];
}

export default async function DirectoryPage() {
  const brands = await getBrands();

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

        {brands.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg mb-2">No brands listed yet</p>
            <p className="text-sm">Be the first to register your fashion brand</p>
            <Link href="/dashboard" className="inline-block mt-6 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Register free
            </Link>
          </div>
        ) : (() => {
          const local = brands.filter((b: any) => b.is_local);
          const international = brands.filter((b: any) => !b.is_local);
          const BrandCard = ({ brand }: { brand: any }) => (
            <Link href={`/biz/${brand.slug}`}
              className="bg-slate-900 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all group">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div>
                  <h2 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{brand.name}</h2>
                  <p className="text-sm text-slate-500">{brand.city} · {brand.ships_to} shipping</p>
                </div>
                {brand.is_local && (
                  <span className="shrink-0 text-xs bg-amber-900/40 text-amber-300 border border-amber-700/30 px-2 py-0.5 rounded-full">🇪🇬 Local</span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{brand.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {brand.style?.map((s: string) => (
                  <span key={s} className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{s}</span>
                ))}
                {brand.price_range && (
                  <span className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{priceLabel[brand.price_range]}</span>
                )}
              </div>
              <div className="flex items-center justify-end pt-4 border-t border-white/5">
                <span className="text-xs text-purple-400 group-hover:text-purple-300">View profile →</span>
              </div>
            </Link>
          );
          return (
            <div>
              {local.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-sm font-semibold text-amber-300">🇪🇬 Egyptian brands</span>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{local.length}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {local.map((brand: any) => <BrandCard key={brand.id} brand={brand} />)}
                  </div>
                </>
              )}
              {international.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-sm font-semibold text-slate-400">🌍 International brands in Egypt</span>
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{international.length}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {international.map((brand: any) => <BrandCard key={brand.id} brand={brand} />)}
                  </div>
                </>
              )}
            </div>
          );
        })()}

        <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get your brand listed</h2>
          <p className="text-slate-400 mb-6">Join {brands.length}+ fashion brands appearing in AI search results</p>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Register free
          </Link>
        </div>
      </div>
    </main>
  );
}
