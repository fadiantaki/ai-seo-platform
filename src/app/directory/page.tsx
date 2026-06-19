'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const RESTAURANT_CUISINES = [
  'Egyptian', 'Seafood', 'Italian', 'Japanese', 'Lebanese', 'Turkish', 'French',
  'American', 'Asian', 'Mediterranean', 'Indian', 'Chinese', 'Mexican', 'Thai',
  'Bar', 'Cafe', 'Brunch', 'Bakery', 'Desserts', 'Street Food', 'Grills',
  'International', 'Nubian', 'Siwan', 'Moroccan', 'Syrian', 'Greek', 'Australian',
  'Fast Food', 'Healthy', 'Vegan', 'Steakhouse', 'Rooftop', 'Lounge',
  'Egyptian Fast Food', 'Egyptian Street Food', 'Asian Fusion', 'Pan-Asian',
  'Fast Casual', 'Gastropub', 'Spanish', 'Vietnamese', 'Wine Bar', 'Contemporary',
  'BBQ', 'Burgers', 'Sandwiches', 'Ice Cream', 'Patisserie', 'Fusion',
  'Diner', 'Pub', 'Ottoman', 'North African', 'Levantine', 'Continental',
  'Wok', 'Latin', 'Organic', 'Vegan Friendly', 'Casual', 'Cultural',
  'Egyptian Seafood', 'Egyptian Sweets', 'European', 'British',
];

function isRestaurant(brand: any) {
  if (!brand.style) return false;
  return brand.style.some((s: string) => RESTAURANT_CUISINES.includes(s));
}

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

  const fashionBrands = brands.filter(b => !isRestaurant(b));
  const restaurants = brands.filter(b => isRestaurant(b));

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
      <div className="flex items-center justify-end pt-4 border-t border-white/5">
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
        <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Register your brand
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Egyptian Business Directory</h1>
          <p className="text-slate-400 max-w-xl">
            Every listing here is optimized to appear when AI systems answer queries about Egypt.
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
