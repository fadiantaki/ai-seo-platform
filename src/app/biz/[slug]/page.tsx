'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

const priceLabel: Record<string, string> = {
  '$': 'Budget-friendly', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

export default function BizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<Record<string, any> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from('brands').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setBrand(data); });
  }, [slug]);

  if (!brand) return null;

  const embedCode = `<script src="https://beaivisible.io/api/embed/${brand.slug}" async></script>`;

  function copyCode() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          <h1 className="text-4xl font-bold mb-3">{brand.name}</h1>
          <p className="text-slate-400 mb-4">
            {brand.city} · Ships to {brand.ships_to} · {priceLabel[brand.price_range] ?? brand.price_range}
          </p>
          <div className="flex flex-wrap gap-2">
            {brand.style?.map((s: string) => (
              <span key={s} className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Stats — numbers blurred, labels visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: brand.ai_searches?.toLocaleString() ?? '—', label: 'AI searches / mo', color: 'text-purple-400' },
            { value: `${brand.top_queries?.length ?? 0}`, label: 'Active AI queries', color: 'text-green-400' },
            { value: `${brand.certifications?.length ?? 0}`, label: 'Certifications', color: 'text-pink-400' },
            { value: `${brand.specialties?.length ?? 0}`, label: 'Signature products', color: 'text-orange-400' },
          ].map((s, i) => (
            <div key={s.label} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
              <div className={`text-3xl font-black mb-1 ${s.color} ${i < 2 ? 'blur-sm select-none' : ''}`}>
                {s.value}
              </div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold mb-3">About</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{brand.description}</p>
          {brand.target_audience && (
            <p className="text-slate-500 text-sm mt-3">Target audience: {brand.target_audience}</p>
          )}
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

        {/* Product catalogue */}
        {brand.products?.length > 0 && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold">Product catalogue</h2>
              <span className="text-xs bg-pink-900/50 text-pink-300 px-2 py-0.5 rounded-full">{brand.products.length} products</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {brand.products.map((p: { name: string; category: string; description: string; price: string }, i: number) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">{p.name}</span>
                    {p.price && <span className="text-xs text-purple-300 shrink-0">{p.price}</span>}
                  </div>
                  {p.category && <span className="text-xs text-slate-500 mb-2 block">{p.category}</span>}
                  {p.description && <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top queries — blurred numbers, queries visible */}
        {brand.top_queries?.length > 0 && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold mb-3">Top AI queries</h2>
            <ul className="space-y-2">
              {brand.top_queries.map((q: string) => (
                <li key={q} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">→</span> {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Embed code */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold">Embed code</h2>
            <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">Free</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Paste this in your website&apos;s <code className="text-slate-300">&lt;head&gt;</code> to make {brand.name} visible in AI search results.
          </p>
          <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-green-400 break-all mb-3">
            {embedCode}
          </div>
          <button onClick={copyCode}
            className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
            {copied ? '✓ Copied!' : 'Copy code'}
          </button>
        </div>

      </div>
    </main>
  );
}
