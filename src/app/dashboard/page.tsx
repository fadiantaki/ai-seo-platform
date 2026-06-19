'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type BusinessType = 'restaurant' | 'fashion' | null;

interface FormData {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  priceRange: string;
  specialties: string;
  // Restaurant-specific
  cuisine: string;
  // Fashion-specific
  style: string;
  targetAudience: string;
  shipsTo: string;
}

const BUSINESS_TYPES = [
  {
    id: 'restaurant' as BusinessType,
    icon: '🍽️',
    title: 'Restaurant',
    desc: 'Appear when people ask AI for the best places to eat near them',
    examples: '"best Italian near me", "top sushi spots downtown"',
  },
  {
    id: 'fashion' as BusinessType,
    icon: '👗',
    title: 'Fashion Brand',
    desc: 'Appear when people ask AI to recommend clothing and style',
    examples: '"best sustainable fashion brands", "minimalist streetwear"',
  },
];

export default function DashboardPage() {
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [step, setStep] = useState(0); // 0 = type selection
  const [form, setForm] = useState<FormData>({
    name: '', description: '', address: '', city: '', state: '',
    phone: '', website: '', priceRange: '$$', specialties: '',
    cuisine: '', style: '', targetAudience: '', shipsTo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  const update = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const totalSteps = 3;

  const embedCode = `<script src="https://ai-seo-platform-dun.vercel.app/api/embed/${generatedId}" async></script>`;

  function slugify(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }

  async function handleSubmit() {
    setSaving(true);
    setError('');
    const slug = slugify(form.name);
    const { data, error } = await supabase.from('brands').insert({
      slug,
      name: form.name,
      style: businessType === 'fashion' ? form.style.split(',').map(s => s.trim()).filter(Boolean) : [form.cuisine],
      description: form.description,
      target_audience: form.targetAudience || '',
      price_range: form.priceRange,
      website: form.website,
      city: form.city,
      ships_to: businessType === 'fashion' ? form.shipsTo : form.state,
      specialties: form.specialties.split('\n').filter(Boolean),
      certifications: [],
      plan: 'free',
      ai_searches: Math.floor(Math.random() * 300) + 50,
      top_queries: [],
    }).select('id').single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    setGeneratedId(data.id);
    setSubmitted(true);
    setSaving(false);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">You&apos;re AI-ready!</h1>
            <p className="text-slate-400">{form.name} is registered. Now paste your script on your website.</p>
          </div>

          {/* Embed code */}
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 mb-8">
            <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Your embed code</div>
            <pre className="text-green-400 text-sm overflow-x-auto"><code>{embedCode}</code></pre>
          </div>

          {/* Installation instructions */}
          <h2 className="text-xl font-bold mb-4">How to install on your platform</h2>
          <div className="space-y-4 mb-10">

            {/* Shopify */}
            <details className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xl">🛍️</span>
                <span className="font-semibold">Shopify</span>
                <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                <p>1. Go to <strong className="text-white">Shopify Admin</strong> → <strong className="text-white">Online Store</strong> → <strong className="text-white">Themes</strong></p>
                <p>2. Click <strong className="text-white">&quot;...&quot;</strong> next to your active theme → <strong className="text-white">Edit code</strong></p>
                <p>3. Open the file <strong className="text-white">theme.liquid</strong></p>
                <p>4. Find the closing <strong className="text-white">&lt;/head&gt;</strong> tag and paste your script just before it</p>
                <p>5. Click <strong className="text-white">Save</strong></p>
              </div>
            </details>

            {/* WordPress */}
            <details className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xl">🔵</span>
                <span className="font-semibold">WordPress / WooCommerce</span>
                <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                <p><strong className="text-white">Option A — Plugin (easiest):</strong></p>
                <p>1. Install the free plugin <strong className="text-white">&quot;Insert Headers and Footers&quot;</strong></p>
                <p>2. Go to <strong className="text-white">Settings → Insert Headers and Footers</strong></p>
                <p>3. Paste your script in the <strong className="text-white">Scripts in Header</strong> box → Save</p>
                <p className="pt-2"><strong className="text-white">Option B — Theme file:</strong></p>
                <p>1. Go to <strong className="text-white">Appearance → Theme File Editor</strong></p>
                <p>2. Open <strong className="text-white">header.php</strong> and paste before <strong className="text-white">&lt;/head&gt;</strong></p>
              </div>
            </details>

            {/* Squarespace */}
            <details className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xl">⬛</span>
                <span className="font-semibold">Squarespace</span>
                <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                <p>1. Go to <strong className="text-white">Settings → Advanced → Code Injection</strong></p>
                <p>2. Paste your script in the <strong className="text-white">Header</strong> field</p>
                <p>3. Click <strong className="text-white">Save</strong></p>
                <p className="text-xs text-slate-500 pt-1">Note: Code Injection requires a Business plan or higher.</p>
              </div>
            </details>

            {/* Wix */}
            <details className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xl">🌐</span>
                <span className="font-semibold">Wix</span>
                <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                <p>1. Go to <strong className="text-white">Settings → Custom Code</strong></p>
                <p>2. Click <strong className="text-white">+ Add Custom Code</strong></p>
                <p>3. Paste your script, set location to <strong className="text-white">Head</strong></p>
                <p>4. Apply to <strong className="text-white">All Pages</strong> → click <strong className="text-white">Apply</strong></p>
              </div>
            </details>

            {/* Custom HTML */}
            <details className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
              <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-xl">💻</span>
                <span className="font-semibold">Custom HTML website</span>
                <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                <p>1. Open your <strong className="text-white">index.html</strong> (and any other HTML files)</p>
                <p>2. Find the closing <strong className="text-white">&lt;/head&gt;</strong> tag</p>
                <p>3. Paste your script just before it</p>
                <p>4. Save and re-upload to your hosting</p>
              </div>
            </details>

          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/demo" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Preview your AI data
            </Link>
            <Link href="/" className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              Back to home
            </Link>
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
        {step > 0 && <div className="text-sm text-slate-400">Step {step} of {totalSteps}</div>}
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">

        {/* Step 0 — Business type selection */}
        {step === 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">What type of business are you?</h1>
            <p className="text-slate-400 mb-8">We&apos;ll tailor your AI profile to your industry</p>
            <div className="grid gap-4">
              {BUSINESS_TYPES.map(bt => (
                <button
                  key={bt.id}
                  onClick={() => setBusinessType(bt.id)}
                  className={`text-left p-6 rounded-2xl border transition-all ${
                    businessType === bt.id
                      ? 'bg-purple-900/40 border-purple-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{bt.icon}</span>
                    <span className="text-lg font-semibold">{bt.title}</span>
                    {businessType === bt.id && (
                      <span className="ml-auto text-purple-400 text-xl">✓</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{bt.desc}</p>
                  <p className="text-slate-500 text-xs italic">{bt.examples}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!businessType}
              className="mt-8 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Progress bar for steps 1-3 */}
        {step > 0 && (
          <div className="flex gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`} />
            ))}
          </div>
        )}

        {/* Step 1 — Basic info */}
        {step === 1 && businessType === 'restaurant' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🍽️</span>
              <h1 className="text-3xl font-bold">Basic info</h1>
            </div>
            <p className="text-slate-400 mb-8">Tell AI search engines who you are</p>
            <div className="space-y-4">
              <Field label="Restaurant name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Bella Napoli" />
              <Field label="Cuisine type(s) *" value={form.cuisine} onChange={v => update('cuisine', v)} placeholder="e.g. Italian, Pizza, Pasta" />
              <Field label="Short description *" value={form.description} onChange={v => update('description', v)} placeholder="What makes your restaurant unique? (2-3 sentences)" textarea />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price range</label>
                <div className="flex gap-3">
                  {['$', '$$', '$$$', '$$$$'].map(p => (
                    <button key={p} onClick={() => update('priceRange', p)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${form.priceRange === p ? 'bg-purple-600 border-purple-500' : 'border-white/20 hover:border-white/40'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(0)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={() => setStep(2)} disabled={!form.name || !form.cuisine || !form.description}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 1 && businessType === 'fashion' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">👗</span>
              <h1 className="text-3xl font-bold">Basic info</h1>
            </div>
            <p className="text-slate-400 mb-8">Tell AI search engines who you are</p>
            <div className="space-y-4">
              <Field label="Brand name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Maison Éclat" />
              <Field label="Style / category *" value={form.style} onChange={v => update('style', v)} placeholder="e.g. Sustainable, Streetwear, Luxury, Minimalist" />
              <Field label="Target audience *" value={form.targetAudience} onChange={v => update('targetAudience', v)} placeholder="e.g. Women 25-40, eco-conscious, urban professionals" />
              <Field label="Brand description *" value={form.description} onChange={v => update('description', v)} placeholder="What makes your brand unique? Story, materials, values... (2-3 sentences)" textarea />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Price range</label>
                <div className="flex gap-3">
                  {['$', '$$', '$$$', '$$$$'].map(p => (
                    <button key={p} onClick={() => update('priceRange', p)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${form.priceRange === p ? 'bg-purple-600 border-purple-500' : 'border-white/20 hover:border-white/40'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(0)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={() => setStep(2)} disabled={!form.name || !form.style || !form.description}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Location & contact */}
        {step === 2 && businessType === 'restaurant' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Location & contact</h1>
            <p className="text-slate-400 mb-8">So AI can answer &ldquo;near me&rdquo; queries</p>
            <div className="space-y-4">
              <Field label="Street address *" value={form.address} onChange={v => update('address', v)} placeholder="e.g. 142 Vine Street" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City *" value={form.city} onChange={v => update('city', v)} placeholder="e.g. San Francisco" />
                <Field label="State" value={form.state} onChange={v => update('state', v)} placeholder="e.g. CA" />
              </div>
              <Field label="Phone" value={form.phone} onChange={v => update('phone', v)} placeholder="+1 (415) 555-0192" />
              <Field label="Website URL" value={form.website} onChange={v => update('website', v)} placeholder="https://yourrestaurant.com" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={() => setStep(3)} disabled={!form.address || !form.city}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && businessType === 'fashion' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Contact & shipping</h1>
            <p className="text-slate-400 mb-8">So AI can tell shoppers where to find you</p>
            <div className="space-y-4">
              <Field label="Website / shop URL *" value={form.website} onChange={v => update('website', v)} placeholder="https://yourbrand.com" />
              <Field label="Ships to *" value={form.shipsTo} onChange={v => update('shipsTo', v)} placeholder="e.g. Worldwide, US & Canada, Europe" />
              <Field label="HQ city" value={form.city} onChange={v => update('city', v)} placeholder="e.g. New York" />
              <Field label="Phone / contact" value={form.phone} onChange={v => update('phone', v)} placeholder="+1 (212) 555-0100" />
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={() => setStep(3)} disabled={!form.website || !form.shipsTo}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Specialties */}
        {step === 3 && businessType === 'restaurant' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Specialties</h1>
            <p className="text-slate-400 mb-8">What should AI recommend about you?</p>
            <div className="space-y-4">
              <Field
                label="Signature dishes & specialties"
                value={form.specialties}
                onChange={v => update('specialties', v)}
                placeholder="e.g. Wood-fired Margherita, House-made Tiramisu, 24hr Osso Buco&#10;One per line"
                textarea
              />
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 text-sm text-purple-300">
                <strong>Tip:</strong> Be specific. &ldquo;Wood-fired Neapolitan pizza with 48-hour fermented dough&rdquo; beats &ldquo;great pizza&rdquo;. AI cites specifics.
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white py-4 rounded-xl font-semibold transition-colors">
                {saving ? 'Saving...' : 'Generate my AI script'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && businessType === 'fashion' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Signature pieces</h1>
            <p className="text-slate-400 mb-8">What should AI recommend about your brand?</p>
            <div className="space-y-4">
              <Field
                label="Signature products & collections"
                value={form.specialties}
                onChange={v => update('specialties', v)}
                placeholder="e.g. The Classic Linen Blazer, Summer 2025 Collection, Recycled Denim Line&#10;One per line"
                textarea
              />
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 text-sm text-purple-300">
                <strong>Tip:</strong> Be specific about materials, certifications, and values. &ldquo;GOTS-certified organic cotton, made in Portugal&rdquo; beats &ldquo;sustainable clothing&rdquo;.
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white py-4 rounded-xl font-semibold transition-colors">
                {saving ? 'Saving...' : 'Generate my AI script'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        )}

      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; textarea?: boolean;
}) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors";
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {textarea
        ? <textarea className={`${cls} min-h-24 resize-y`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      }
    </div>
  );
}
