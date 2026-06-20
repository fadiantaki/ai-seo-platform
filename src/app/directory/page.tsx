'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const priceLabel: Record<string, string> = {
  '$': 'Budget', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

export default function DirectoryPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [tab, setTab] = useState<'fashion' | 'restaurants'>('fashion');

  useEffect(() => {
    supabase.from('brands').select('*')
      .order('is_local', { ascending: false })
      .order('ai_searches', { ascending: false })
      .then(({ data }) => setBrands(data ?? []));
  }, []);

  const fashionBrands = brands.filter(b => b.business_type !== 'restaurant');
  const restaurants = brands.filter(b => b.business_type === 'restaurant');

  const activeList = tab === 'fashion' ? fashionBrands : restaurants;
  const local = activeList.filter(b => b.is_local);
  const international = activeList.filter(b => !b.is_local);

  const BrandCard = ({ brand }: { brand: any }) => (
    <Link href={`/biz/${brand.slug}`}
      className="bg-slate-900 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all group">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div>
          <h2 className="text-lg font-bold group-hover:text-purple-300 transition-colors">{brand.name}</h2>
          <p className="text-sm text-slate-500">
            {brand.city}
            {tab === 'fashion' ? ` · ${brand.ships_to} shipping` : brand.ships_to ? ` · ${brand.ships_to}` : ''}
          </p>
        </div>
        {brand.is_local && (
          <span className="shrink-0 text-xs bg-amber-900/40 text-amber-300 border border-amber-700/30 px-2 py-0.5 rounded-full">🇪🇬 Local</span>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{brand.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {brand.style?.slice(0, 3).map((s: string) => (
          <span key={s} className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{s}</span>
        ))}
        {brand.price_range && (
          <span className="text-xs bg-white/5 text-slate-300 px-2 py-1 rounded-lg">{priceLabel[brand.price_range]}</span>
        )}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        {brand.instagram ? (
          <a href={`https://instagram.com/${brand.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
            {brand.instagram}
          </a>
        ) : <span />}
        <span className="text-xs text-purple-400 group-hover:text-purple-300">View profile →</span>
      </div>
    </Link>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com/aivisible" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors" title="@aivisible on Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Register your brand
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Egyptian Business Directory</h1>
          <p className="text-slate-400 max-w-xl">
            Is your business in the list below? Simply click on it, copy your free optimization code, and embed it on your website to start appearing in AI search results. Don&apos;t see your brand?{' '}
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">Register your brand</Link> — it&apos;s free.
          </p>
          <p className="text-slate-500 text-sm mt-3">
            If any of your business details are inaccurate, please email us at{' '}
            <a href="mailto:hello@beaivisible.io" className="text-purple-400 hover:text-purple-300 transition-colors">hello@beaivisible.io</a>
            {' '}or DM us on{' '}
            <a href="https://instagram.com/aivisible" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">@aivisible</a>
            {' '}from your brand&apos;s email or Instagram account.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setTab('fashion')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'fashion' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
            👗 Fashion Brands
            <span className="text-xs opacity-70">({fashionBrands.length})</span>
          </button>
          <button
            onClick={() => setTab('restaurants')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === 'restaurants' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
            🍽️ Restaurants
            <span className="text-xs opacity-70">({restaurants.length})</span>
          </button>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : (
          <div>
            {local.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-sm font-semibold text-amber-300">🇪🇬 Egyptian {tab === 'fashion' ? 'brands' : 'restaurants'}</span>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{local.length}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {local.map((b: any) => <BrandCard key={b.id} brand={b} />)}
                </div>
              </>
            )}
            {international.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-sm font-semibold text-slate-400">🌍 International {tab === 'fashion' ? 'brands' : 'restaurants'} in Egypt</span>
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{international.length}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {international.map((b: any) => <BrandCard key={b.id} brand={b} />)}
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get your business listed</h2>
          <p className="text-slate-400 mb-6">Join {brands.length}+ Egyptian businesses appearing in AI search results</p>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Register free
          </Link>
        </div>
      </div>
    </main>
  );
}
