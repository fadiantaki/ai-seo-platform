'use client';
import Link from 'next/link';
import { fashionBrands } from '@/lib/fashion-brands';

const brand = fashionBrands[0]; // Maison Éclat as demo

const weeklyData = [
  { day: 'Mon', searches: 38 },
  { day: 'Tue', searches: 52 },
  { day: 'Wed', searches: 45 },
  { day: 'Thu', searches: 61 },
  { day: 'Fri', searches: 78 },
  { day: 'Sat', searches: 91 },
  { day: 'Sun', searches: 67 },
];

const maxSearches = Math.max(...weeklyData.map(d => d.searches));

const competitors = [
  { name: 'Maison Éclat', searches: 1243, isYou: true },
  { name: 'Everlane', searches: 2100, isYou: false },
  { name: 'Reformation', searches: 1890, isYou: false },
  { name: 'Stella McCartney', searches: 980, isYou: false },
];

const maxComp = Math.max(...competitors.map(c => c.searches));

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/directory" className="text-sm text-slate-400 hover:text-white transition-colors">Directory</Link>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Register your brand
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-sm text-purple-400 font-semibold mb-1 uppercase tracking-wider">Analytics Dashboard</div>
            <h1 className="text-3xl font-bold">{brand.name}</h1>
            <p className="text-slate-400 text-sm mt-1">AI search performance · June 2026</p>
          </div>
          <span className="bg-purple-900 text-purple-300 text-xs px-3 py-1 rounded-full font-semibold">Pro Plan</span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'AI searches this month', value: '1,243', change: '+18%', positive: true },
            { label: 'Unique AI queries', value: '47', change: '+6', positive: true },
            { label: 'Directory rank', value: '#1', change: 'Sustainable', positive: true },
            { label: 'Competitor gap', value: '-857', change: 'vs Everlane', positive: false },
          ].map(({ label, value, change, positive }) => (
            <div key={label} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl font-black mb-1">{value}</div>
              <div className="text-xs text-slate-500 mb-2">{label}</div>
              <div className={`text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-6">AI searches this week</h2>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map(({ day, searches }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400">{searches}</span>
                <div
                  className="w-full bg-purple-600 rounded-t-lg transition-all"
                  style={{ height: `${(searches / maxSearches) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Top queries */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Top AI queries you appear in</h2>
            <ul className="space-y-3">
              {[
                { query: 'best sustainable luxury fashion', count: 312 },
                { query: 'eco-friendly women\'s clothing', count: 287 },
                { query: 'minimalist fashion brands', count: 198 },
                { query: 'organic cotton dresses', count: 156 },
                { query: 'carbon neutral clothing brand', count: 143 },
              ].map(({ query, count }) => (
                <li key={query} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <span className="text-purple-400">→</span> {query}
                  </span>
                  <span className="text-xs text-slate-500 ml-4 shrink-0">{count}/mo</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor comparison */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Competitor AI visibility</h2>
            <div className="space-y-4">
              {competitors.map(({ name, searches, isYou }) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isYou ? 'text-purple-300 font-semibold' : 'text-slate-400'}>
                      {name} {isYou && '(you)'}
                    </span>
                    <span className="text-slate-500">{searches.toLocaleString()}/mo</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isYou ? 'bg-purple-500' : 'bg-white/20'}`}
                      style={{ width: `${(searches / maxComp) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">Tip: Add more certifications and specialties to close the gap with Everlane.</p>
          </div>
        </div>

        {/* Recent AI mentions */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Recent AI mentions</h2>
          <div className="space-y-4">
            {[
              { platform: 'Claude', query: 'What are the best sustainable luxury fashion brands?', mention: 'Maison Éclat is a standout sustainable luxury brand known for GOTS-certified organic cotton and recycled cashmere pieces made in Lisbon...', time: '2 hours ago' },
              { platform: 'Perplexity', query: 'eco-friendly minimalist women\'s clothing', mention: 'For minimalist sustainable fashion, Maison Éclat offers timeless pieces in organic materials with zero-waste packaging...', time: '5 hours ago' },
              { platform: 'ChatGPT', query: 'carbon neutral fashion brands that ship worldwide', mention: 'Maison Éclat is B Corp certified and carbon neutral, shipping worldwide from their Lisbon production facility...', time: '1 day ago' },
            ].map(({ platform, query, mention, time }) => (
              <div key={time} className="border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${platform === 'Claude' ? 'bg-orange-900 text-orange-300' : platform === 'Perplexity' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                    {platform}
                  </span>
                  <span className="text-xs text-slate-600">{time}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1 italic">&ldquo;{query}&rdquo;</p>
                <p className="text-sm text-slate-300">{mention}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade prompt */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/30 rounded-2xl p-6 text-center">
          <h3 className="font-bold mb-2">This is what your dashboard looks like on Pro</h3>
          <p className="text-slate-400 text-sm mb-4">Real analytics, competitor tracking, and AI mention alerts — all live when you register</p>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Register your fashion brand
          </Link>
        </div>
      </div>
    </main>
  );
}
