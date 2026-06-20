'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FashionBrand } from '@/lib/fashion-brands';

const STYLE_OPTIONS = ['Sustainable', 'Streetwear', 'Luxury', 'Minimalist', 'Activewear', 'Avant-garde', 'Contemporary', 'Bohemian', 'Vintage', 'Athleisure'];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const ADMIN_USER = 'aivisible';
const ADMIN_PASS = 'AIVisible2025!';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [brands, setBrands] = useState<FashionBrand[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('aivisible_admin') === 'true') {
      setAuthed(true); localStorage.setItem('aivisible_admin', 'true');
    }
  }, []);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    instagram: '',
    style: [] as string[],
    description: '',
    targetAudience: '',
    priceRange: '$$' as '$' | '$$' | '$$$' | '$$$$',
    website: '',
    city: '',
    shipsTo: '',
    specialties: '',
    certifications: '',
    plan: 'free' as 'free' | 'starter' | 'pro',
  });

  useEffect(() => {
    if (authed) loadBrands();
  }, [authed]);

  async function loadBrands() {
    setLoading(true);
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setBrands(data.map(b => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        style: b.style,
        description: b.description,
        targetAudience: b.target_audience,
        priceRange: b.price_range,
        website: b.website,
        city: b.city,
        shipsTo: b.ships_to,
        specialties: b.specialties,
        certifications: b.certifications,
        plan: b.plan,
        aiSearches: b.ai_searches,
        topQueries: b.top_queries,
      })));
    }
    setLoading(false);
  }

  const update = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleStyle = (s: string) => {
    setForm(f => ({
      ...f,
      style: f.style.includes(s) ? f.style.filter(x => x !== s) : [...f.style, s],
    }));
  };

  const handleAdd = async () => {
    setSaving(true);
    setError('');
    const { error } = await supabase.from('brands').insert({
      slug: slugify(form.name),
      name: form.name,
      email: form.email || null,
      instagram: form.instagram || null,
      style: form.style,
      description: form.description,
      target_audience: form.targetAudience,
      price_range: form.priceRange,
      website: form.website,
      city: form.city,
      ships_to: form.shipsTo,
      specialties: form.specialties.split('\n').filter(Boolean),
      certifications: form.certifications.split('\n').filter(Boolean),
      plan: form.plan,
      ai_searches: Math.floor(Math.random() * 500) + 100,
      top_queries: [],
    });

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setShowForm(false);
      setForm({ name: '', email: '', instagram: '', style: [], description: '', targetAudience: '', priceRange: '$$', website: '', city: '', shipsTo: '', specialties: '', certifications: '', plan: 'free' });
      setTimeout(() => setSaved(false), 3000);
      loadBrands();
    }
    setSaving(false);
  };

  const planColor: Record<string, string> = {
    pro: 'bg-purple-900 text-purple-300',
    starter: 'bg-blue-900 text-blue-300',
    free: 'bg-white/10 text-slate-400',
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
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
                      setAuthed(true); localStorage.setItem('aivisible_admin', 'true');
                    } else {
                      setLoginError('Invalid username or password');
                    }
                  }
                }}
              />
            </div>
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button
              onClick={() => {
                if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
                  setAuthed(true); localStorage.setItem('aivisible_admin', 'true');
                } else {
                  setLoginError('Invalid username or password');
                }
              }}
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
        <div className="flex items-center gap-4">
          <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded-full font-semibold">Admin Only</span>
          <Link href="/outreach" className="text-sm text-slate-400 hover:text-white transition-colors">Outreach</Link>
          <Link href="/directory" className="text-sm text-slate-400 hover:text-white transition-colors">View Directory</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Brand Admin Panel</h1>
            <p className="text-slate-400 text-sm">{brands.length} brands in database · Add and manage fashion brands</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            + Add brand
          </button>
        </div>

        {saved && (
          <div className="bg-green-900/40 border border-green-700/50 rounded-xl px-5 py-3 text-green-300 text-sm mb-6">
            ✓ Brand saved to database successfully
          </div>
        )}

        {error && (
          <div className="bg-red-900/40 border border-red-700/50 rounded-xl px-5 py-3 text-red-300 text-sm mb-6">
            ✗ Error: {error}
          </div>
        )}

        {/* Add brand form */}
        {showForm && (
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add new fashion brand</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Brand name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Stella Nova" />
                <Field label="Website URL *" value={form.website} onChange={v => update('website', v)} placeholder="https://stellanova.com" />
              </div>
              <Field label="Contact email" value={form.email} onChange={v => update('email', v)} placeholder="hello@stellanova.com" />
              <Field label="Instagram handle" value={form.instagram} onChange={v => update('instagram', v)} placeholder="@stellanova" />
              <Field label="Description *" value={form.description} onChange={v => update('description', v)} placeholder="What makes this brand unique? Materials, values, origin story..." textarea />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Target audience" value={form.targetAudience} onChange={v => update('targetAudience', v)} placeholder="e.g. Women 25-40, eco-conscious" />
                <Field label="HQ City" value={form.city} onChange={v => update('city', v)} placeholder="e.g. Paris" />
              </div>
              <Field label="Ships to" value={form.shipsTo} onChange={v => update('shipsTo', v)} placeholder="e.g. Worldwide, US & Europe" />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Style / category *</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map(s => (
                    <button key={s} onClick={() => toggleStyle(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${form.style.includes(s) ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/20 text-slate-400 hover:border-white/40'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price range</label>
                <div className="flex gap-3">
                  {(['$', '$$', '$$$', '$$$$'] as const).map(p => (
                    <button key={p} onClick={() => update('priceRange', p)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${form.priceRange === p ? 'bg-purple-600 border-purple-500' : 'border-white/20 hover:border-white/40'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Signature products (one per line)" value={form.specialties} onChange={v => update('specialties', v)} placeholder="The Classic Linen Blazer&#10;Summer 2025 Collection" textarea />
              <Field label="Certifications (one per line)" value={form.certifications} onChange={v => update('certifications', v)} placeholder="GOTS Certified&#10;B Corp" textarea />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plan</label>
                <div className="flex gap-3">
                  {(['free', 'starter', 'pro'] as const).map(p => (
                    <button key={p} onClick={() => update('plan', p)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold capitalize transition-colors ${form.plan === p ? 'bg-purple-600 border-purple-500' : 'border-white/20 hover:border-white/40'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:border-white/40 transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={!form.name || !form.website || !form.description || form.style.length === 0 || saving}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors">
                {saving ? 'Saving...' : 'Save to database'}
              </button>
            </div>
          </div>
        )}

        {/* Brand list */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading brands from database...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg mb-2">No brands yet</p>
            <p className="text-sm">Click &quot;+ Add brand&quot; to add your first fashion brand</p>
          </div>
        ) : (
          <div className="space-y-4">
            {brands.map(brand => (
              <div key={brand.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{brand.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${planColor[brand.plan]}`}>{brand.plan}</span>
                  </div>
                  <p className="text-sm text-slate-500">{brand.city} · {brand.website} · {brand.style.join(', ')}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-300">{brand.aiSearches?.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">AI searches/mo</div>
                  </div>
                  <Link href={`/biz/${brand.slug}`} target="_blank"
                    className="text-xs border border-white/20 hover:border-white/40 px-3 py-2 rounded-lg transition-colors">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; textarea?: boolean;
}) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors text-sm";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {textarea
        ? <textarea className={`${cls} min-h-20 resize-y`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}
