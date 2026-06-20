'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { brandContacts, instagramDMTemplate } from '@/lib/brand-contacts';

interface BrandRow {
  id: string;
  slug: string;
  name: string;
  email: string | null;
  embed_installed: boolean;
  embed_last_seen: string | null;
  embed_domain: string | null;
  outreach_sent: boolean;
  outreach_sent_at: string | null;
  plan: string;
}

const ADMIN_USER = 'aivisible';
const ADMIN_PASS = 'AIVisible2025!';

export default function OutreachPage() {
  const [authed, setAuthed] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'installed'>('all');
  const [dmBrand, setDmBrand] = useState<{ name: string; slug: string; instagram: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'bulk-email'>('tracker');
  const [bulkSubject, setBulkSubject] = useState('{name} is now listed on AIVisible — activate your free AI profile');
  const [bulkBody, setBulkBody] = useState(`Hi {name} team,

Have you noticed that more and more people are now searching for restaurants and businesses using AI — asking Claude, ChatGPT, or Perplexity instead of Google?

"Best restaurants in Cairo", "where to eat in Zamalek", "top brunch spots in New Cairo" — these searches are happening right now, and the businesses that appear are the ones that have set up their AI profile.

That's exactly what we built AIVisible for.

We've already created a free profile for {name} on AIVisible — Egypt's first AI search directory. Your profile is live at:

👉 {profile_url}

Take a look and make sure your details are accurate (name, description, location, contact). If anything is wrong, just reply to this email and we'll fix it immediately.

---

TO APPEAR IN AI SEARCH RESULTS, DO THIS ONE THING:

Copy this line of code and paste it inside the <head> tag of your website:

{embed_code}

That's it. One line. Takes 2 minutes. And it tells every AI system — Claude, ChatGPT, Perplexity — exactly who you are, what you offer, and where to find you.

It's completely free.

---

Why does this matter?

AI search is growing fast. People — especially younger customers — are skipping Google and asking AI directly. The businesses that show up in those answers are the ones they visit. The ones that don't show up simply don't get considered.

AIVisible makes sure {name} is one of the ones that shows up.

Visit your profile, check your details, and paste the code on your site. If you need any help, just reply to this email — we're happy to assist.

— The AIVisible Team
hello@beaivisible.io
instagram.com/aivisible_eg`);
  const [bulkPreview, setBulkPreview] = useState<{ id: string; name: string; email: string; slug: string }[]>([]);
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('aivisible_admin') === 'true') {
      setAuthed(true); localStorage.setItem('aivisible_admin', 'true');
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    supabase.from('brands')
      .select('id, slug, name, email, embed_installed, embed_last_seen, embed_domain, outreach_sent, outreach_sent_at, plan')
      .order('name')
      .then(({ data }) => setBrands(data || []));
  }, [authed]);

  async function loadBulkPreview() {
    const res = await fetch('/api/bulk-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: bulkSubject, body: bulkBody, preview: true }),
    });
    const data = await res.json();
    setBulkPreview(data.recipients || []);
  }

  async function sendBulkEmail() {
    if (!confirm(`Send to ${bulkPreview.length} brands? This cannot be undone.`)) return;
    setBulkSending(true);
    setBulkResult(null);
    const res = await fetch('/api/bulk-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: bulkSubject, body: bulkBody }),
    });
    const data = await res.json();
    setBulkResult({ sent: data.sent, failed: data.failed });
    setBulkSending(false);
    // Refresh brand list
    const { data: fresh } = await supabase.from('brands')
      .select('id, slug, name, email, embed_installed, embed_last_seen, embed_domain, outreach_sent, outreach_sent_at, plan')
      .order('name');
    if (fresh) setBrands(fresh);
  }

  async function markOutreachSent(brandId: string) {
    await supabase.from('brands').update({
      outreach_sent: true,
      outreach_sent_at: new Date().toISOString(),
    }).eq('id', brandId);
    setBrands(prev => prev.map(b => b.id === brandId
      ? { ...b, outreach_sent: true, outreach_sent_at: new Date().toISOString() }
      : b
    ));
  }

  function copyDM(brandName: string, brandSlug: string) {
    const text = instagramDMTemplate(brandName, brandSlug);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const contactMap = Object.fromEntries(brandContacts.map(c => [c.slug, c]));

  const filtered = brands.filter(b => {
    if (filter === 'installed') return b.embed_installed;
    if (filter === 'sent') return b.outreach_sent && !b.embed_installed;
    if (filter === 'pending') return !b.outreach_sent;
    return true;
  });

  const stats = {
    total: brands.length,
    installed: brands.filter(b => b.embed_installed).length,
    sent: brands.filter(b => b.outreach_sent).length,
    pending: brands.filter(b => !b.outreach_sent).length,
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Admin Login</h1>
          <p className="text-slate-500 text-sm text-center mb-8">AIVisible internal dashboard</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Username" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Password"
                onKeyDown={e => { if (e.key === 'Enter') { if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) { setAuthed(true); localStorage.setItem('aivisible_admin', 'true'); } else { setLoginError('Invalid username or password'); } } }} />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button onClick={() => { if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) { setAuthed(true); localStorage.setItem('aivisible_admin', 'true'); } else { setLoginError('Invalid username or password'); } }}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-semibold transition-colors">
              Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <Link href="/directory" className="hover:text-white">Directory</Link>
          <a href="https://instagram.com/aivisible_eg" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors" title="@aivisible_eg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Outreach</h1>
            <p className="text-slate-400">Track DMs and send bulk emails to all listed brands.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('tracker')}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === 'tracker' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
              Instagram Tracker
            </button>
            <button onClick={() => { setActiveTab('bulk-email'); loadBulkPreview(); }}
              className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === 'bulk-email' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
              📧 Bulk Email
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total brands', value: stats.total, color: 'text-white' },
            { label: 'DMs pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'DMs sent', value: stats.sent, color: 'text-blue-400' },
            { label: 'Embed installed', value: stats.installed, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bulk Email Panel */}
        {activeTab === 'bulk-email' && (
          <div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Compose */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject line</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    value={bulkSubject}
                    onChange={e => setBulkSubject(e.target.value)}
                    placeholder="Subject..."
                  />
                  <p className="text-xs text-slate-500 mt-1">Use <code className="text-purple-400">{'{name}'}</code> for brand name</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email body</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm min-h-64 resize-y font-mono"
                    value={bulkBody}
                    onChange={e => setBulkBody(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Variables: <code className="text-purple-400">{'{name}'}</code> · <code className="text-purple-400">{'{profile_url}'}</code> · <code className="text-purple-400">{'{embed_code}'}</code>
                  </p>
                </div>

                {bulkResult && (
                  <div className={`rounded-xl px-4 py-3 text-sm ${bulkResult.failed === 0 ? 'bg-green-900/40 border border-green-700/50 text-green-300' : 'bg-yellow-900/40 border border-yellow-700/50 text-yellow-300'}`}>
                    ✓ Sent: {bulkResult.sent} · Failed: {bulkResult.failed}
                  </div>
                )}

                <button
                  onClick={sendBulkEmail}
                  disabled={bulkSending || bulkPreview.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors">
                  {bulkSending ? 'Sending...' : `Send to ${bulkPreview.length} brands with emails`}
                </button>
              </div>

              {/* Recipients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-slate-300">Recipients ({bulkPreview.length})</h3>
                  <button onClick={loadBulkPreview} className="text-xs text-purple-400 hover:text-purple-300">Refresh</button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden max-h-[480px] overflow-y-auto">
                  {bulkPreview.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No brands with emails yet</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="border-b border-white/10">
                        <tr className="text-slate-400 text-xs">
                          <th className="text-left px-4 py-2 font-medium">Brand</th>
                          <th className="text-left px-4 py-2 font-medium">Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkPreview.map(b => (
                          <tr key={b.id} className="border-b border-white/5">
                            <td className="px-4 py-2 text-white">{b.name}</td>
                            <td className="px-4 py-2 text-slate-400 text-xs">{b.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && <>
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'sent', 'installed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* DM Template modal */}
        {dmBrand && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">DM Template — {dmBrand.name}</h2>
                <button onClick={() => setDmBrand(null)} className="text-slate-400 hover:text-white text-xl">×</button>
              </div>
              <div className="text-xs text-purple-300 mb-2">Send to: {dmBrand.instagram}</div>
              <pre className="bg-black/40 rounded-xl p-4 text-sm text-slate-300 whitespace-pre-wrap mb-4 leading-relaxed">
                {instagramDMTemplate(dmBrand.name, dmBrand.slug)}
              </pre>
              <div className="flex gap-3">
                <button onClick={() => copyDM(dmBrand.name, dmBrand.slug)}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-medium text-sm transition-colors">
                  {copied ? '✓ Copied!' : 'Copy message'}
                </button>
                <button
                  onClick={async () => {
                    const brand = brands.find(b => b.slug === dmBrand.slug);
                    if (brand) { await markOutreachSent(brand.id); }
                    setDmBrand(null);
                  }}
                  className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-medium text-sm transition-colors">
                  Mark as sent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Brands table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-left px-4 py-3 font-medium">Brand</th>
                <th className="text-left px-4 py-3 font-medium">Instagram</th>
                <th className="text-left px-4 py-3 font-medium">Outreach</th>
                <th className="text-left px-4 py-3 font-medium">Embed</th>
                <th className="text-left px-4 py-3 font-medium">Domain</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(brand => {
                const contact = contactMap[brand.slug];
                return (
                  <tr key={brand.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-4 py-3">
                      <div className="font-medium">{brand.name}</div>
                      {contact?.type === 'local' && (
                        <div className="text-xs text-purple-400">Local brand</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {contact?.instagram || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {brand.outreach_sent ? (
                        <span className="text-blue-400 text-xs">
                          ✓ Sent {brand.outreach_sent_at ? new Date(brand.outreach_sent_at).toLocaleDateString() : ''}
                        </span>
                      ) : (
                        <span className="text-yellow-400 text-xs">⏳ Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {brand.embed_installed ? (
                        <span className="text-green-400 text-xs">
                          ✓ Installed {brand.embed_last_seen ? new Date(brand.embed_last_seen).toLocaleDateString() : ''}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Not installed</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {brand.embed_domain || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {contact && (
                          <button
                            onClick={() => setDmBrand({ name: brand.name, slug: brand.slug, instagram: contact.instagram })}
                            className="text-xs bg-purple-600/30 hover:bg-purple-600/60 text-purple-300 px-2 py-1 rounded transition-colors">
                            View DM
                          </button>
                        )}
                        {!brand.outreach_sent && (
                          <button onClick={() => markOutreachSent(brand.id)}
                            className="text-xs bg-blue-600/30 hover:bg-blue-600/60 text-blue-300 px-2 py-1 rounded transition-colors">
                            Mark sent
                          </button>
                        )}
                        <Link href={`/biz/${brand.slug}`}
                          className="text-xs bg-white/5 hover:bg-white/10 text-slate-400 px-2 py-1 rounded transition-colors">
                          Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">No brands in this filter.</div>
          )}
        </div>
        </>}
      </div>
    </main>
  );
}
