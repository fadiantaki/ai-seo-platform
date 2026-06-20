'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

const priceLabel: Record<string, string> = {
  '$': 'Budget-friendly', '$$': 'Mid-range', '$$$': 'Premium', '$$$$': 'Luxury',
};

const gradeColor: Record<string, string> = {
  A: 'text-green-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-red-400',
};
const gradeRing: Record<string, string> = {
  A: 'border-green-500/60', B: 'border-blue-500/60', C: 'border-amber-500/60', D: 'border-red-500/60',
};

interface Report {
  score: number;
  grade: string;
  aiVisibilityContext: string;
  profileScore: number;
  profileMax: number;
  profileBreakdown: Record<string, number>;
  embedScore: number;
  embedMax: number;
  aiMentionScore: number;
  aiMentionMax: number;
  mentionCount: number;
  totalQueries: number;
  mentionRate: string;
  mentionedIn: string[];
  missedIn: string[];
  gaps: string[];
  sampleQuery: string;
  sampleResponse: string;
  generatedAt: string;
}

export default function BizPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<Record<string, any> | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTrust, setShowTrust] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    supabase.from('brands').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) {
          setBrand(data);
          if (data.ai_report) setReport(data.ai_report);
        }
      });
  }, [slug]);

  if (!brand) return null;

  const embedCode = `<script src="https://beaivisible.io/api/embed/${brand.slug}" async></script>`;

  function copyCode() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function generateReport() {
    setGenerating(true);
    setReportError('');
    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate report');
      setReport(json.report);
    } catch (e: any) {
      setReportError(e.message);
    }
    setGenerating(false);
  }

  const reportAge = report?.generatedAt
    ? Math.floor((Date.now() - new Date(report.generatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

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
            {brand.city}{brand.ships_to ? ` · Ships to ${brand.ships_to}` : ''}{brand.price_range ? ` · ${priceLabel[brand.price_range] ?? brand.price_range}` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {brand.style?.map((s: string) => (
              <span key={s} className="text-sm bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* AI Visibility Report */}
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🤖</span>
                <h2 className="font-bold text-lg">AI Visibility Report</h2>
                <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">Free</span>
              </div>
              <p className="text-sm text-slate-400">
                {report
                  ? `Last generated ${reportAge === 0 ? 'today' : `${reportAge} day${reportAge !== 1 ? 's' : ''} ago`} · See how AI platforms see ${brand.name}`
                  : `Find out if ChatGPT and Perplexity mention ${brand.name} when people search for you`}
              </p>
            </div>
            <button
              onClick={generateReport}
              disabled={generating}
              className="shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Scanning AI platforms…
                </>
              ) : report ? '↺ Regenerate report' : '✦ Generate my AI report'}
            </button>
          </div>

          {reportError && (
            <div className="mt-4 bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-300">
              {reportError}
            </div>
          )}

          {generating && (
            <div className="mt-6 space-y-3">
              {['Querying ChatGPT…', 'Checking Perplexity…', 'Analysing mentions…', 'Calculating score…'].map((msg, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <svg className="w-4 h-4 animate-spin shrink-0" style={{ animationDelay: `${i * 0.2}s` }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {msg}
                </div>
              ))}
            </div>
          )}

          {report && !generating && (
            <div className="mt-6">
              {/* Score + grade */}
              <div className="flex items-center gap-6 mb-4">
                <div className={`w-20 h-20 rounded-full border-4 ${gradeRing[report.grade]} flex flex-col items-center justify-center shrink-0`}>
                  <span className={`text-3xl font-black ${gradeColor[report.grade]}`}>{report.grade}</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-white">{report.score}</span>
                    <span className="text-slate-500 text-sm">/100</span>
                  </div>
                  <p className="text-xs text-slate-400">Overall AI Visibility Score</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-1000"
                  style={{ width: `${report.score}%` }} />
              </div>

              {/* Score breakdown — 3 components */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-purple-300 mb-0.5">{report.profileScore}<span className="text-xs text-slate-500">/{report.profileMax}</span></div>
                  <div className="text-xs text-slate-400">Profile</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className={`text-xl font-bold mb-0.5 ${report.embedScore > 0 ? 'text-green-400' : 'text-slate-500'}`}>{report.embedScore}<span className="text-xs text-slate-500">/{report.embedMax}</span></div>
                  <div className="text-xs text-slate-400">Embed</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-300 mb-0.5">{report.aiMentionScore}<span className="text-xs text-slate-500">/{report.aiMentionMax}</span></div>
                  <div className="text-xs text-slate-400">AI Mentions</div>
                </div>
              </div>

              {/* AI visibility context */}
              <div className="bg-slate-800/60 rounded-xl p-4 mb-5">
                <p className="text-xs text-slate-300 leading-relaxed">{report.aiVisibilityContext}</p>
              </div>

              {/* Queries breakdown */}
              {report.mentionedIn?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-green-400 mb-2">✓ ChatGPT mentions you when people ask:</p>
                  <ul className="space-y-1">
                    {report.mentionedIn.map((q, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 shrink-0 mt-0.5">→</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.missedIn?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-red-400 mb-2">✗ You don&apos;t appear yet when people ask:</p>
                  <ul className="space-y-1">
                    {report.missedIn.map((q, i) => (
                      <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                        <span className="text-red-400 shrink-0 mt-0.5">→</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample AI response */}
              {report.sampleResponse && (
                <div className="bg-black/30 rounded-xl p-4 mb-5">
                  <p className="text-xs text-slate-500 mb-2">What ChatGPT says when asked: <span className="text-slate-400 italic">&quot;{report.sampleQuery}&quot;</span></p>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.sampleResponse}{report.sampleResponse.length >= 500 ? '…' : ''}</p>
                </div>
              )}

              {/* Actionable gaps */}
              {report.gaps?.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-300 mb-2">🔧 Improve your score — quick wins:</p>
                  <ul className="space-y-1.5">
                    {report.gaps.map((g, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 shrink-0 mt-0.5">+</span> {g}
                      </li>
                    ))}
                  </ul>
                  {!report.embedScore && (
                    <button onClick={() => document.getElementById('embed-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-3 text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      Get your free embed code ↓
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
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

        {/* Top queries */}
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
        <div id="embed-section" className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold">Embed code</h2>
            <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">Free · Forever</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Paste this in your website&apos;s <code className="text-slate-300">&lt;head&gt;</code> to make {brand.name} visible in AI search results.
          </p>
          <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-green-400 break-all mb-4">
            {embedCode}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyCode}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
              {copied ? '✓ Copied!' : 'Copy code'}
            </button>
            <button onClick={() => setShowTrust(!showTrust)}
              className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              🔒 Is this safe to install?
            </button>
          </div>

          {/* Trust explainer — toggled */}
          {showTrust && (
            <div className="mt-5 bg-green-950/30 border border-green-700/30 rounded-xl p-5 text-sm">
              <p className="font-semibold text-green-300 mb-3">✓ Yes — here is exactly what the code does:</p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>It adds your brand data to your page&apos;s &lt;head&gt;</strong> — structured information (name, city, category, description) in a format AI crawlers understand. Think of it as a business card for AI systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>It does NOT collect your visitors&apos; data.</strong> No cookies. No tracking pixels. No personal information is captured or sent anywhere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>It does NOT slow your website.</strong> The script loads with the <code className="text-slate-400">async</code> attribute, meaning it runs in the background and never blocks your page from loading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>It sends one small ping to our server</strong> so we can confirm the embed is active — nothing more. No page content, no user data, no browsing history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>You can inspect it yourself.</strong> Open your browser DevTools after installing and look at your page &lt;head&gt; — you&apos;ll see exactly what was added. No hidden code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span><strong>Remove it anytime.</strong> Simply delete the one line from your website. No account deletion needed, no contracts.</span>
                </li>
              </ul>
              <p className="text-slate-500 text-xs mt-4">
                Questions? Email us at <a href="mailto:hello@beaivisible.io" className="text-purple-400">hello@beaivisible.io</a> or DM <a href="https://instagram.com/aivisible_eg" target="_blank" rel="noopener noreferrer" className="text-pink-400">@aivisible_eg</a>
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
