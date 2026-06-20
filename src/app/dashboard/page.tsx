'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type BusinessType = 'restaurant' | 'fashion' | null;

interface Product {
  name: string;
  category: string;
  description: string;
  price: string;
}

interface FormData {
  name: string;
  email: string;
  instagram: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  priceRange: string;
  specialties: string;
  cuisine: string;
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

const PRODUCT_CATEGORIES = [
  'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Suits & Blazers',
  'Activewear', 'Swimwear', 'Accessories', 'Bags', 'Shoes',
  'Jewellery', 'Scarves & Wraps', 'Modest Wear', 'Bridal', 'Kids',
];

const emptyProduct = (): Product => ({ name: '', category: '', description: '', price: '' });

export default function DashboardPage() {
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: '', email: '', instagram: '', description: '', address: '', city: '', state: '',
    phone: '', website: '', priceRange: '$$', specialties: '',
    cuisine: '', style: '', targetAudience: '', shipsTo: '',
  });
  const [products, setProducts] = useState<Product[]>([emptyProduct()]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatedSlug, setGeneratedSlug] = useState('');

  const update = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));
  const totalSteps = 4;

  const embedCode = `<script src="https://beaivisible.io/api/embed/${generatedSlug}" async></script>`;

  function slugify(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
  }

  function updateProduct(i: number, field: keyof Product, value: string) {
    setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  function addProduct() {
    setProducts(prev => [...prev, emptyProduct()]);
  }

  function removeProduct(i: number) {
    setProducts(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    setSaving(true);
    setError('');
    const slug = slugify(form.name);
    const cleanProducts = products.filter(p => p.name.trim());

    const { data, error } = await supabase.from('brands').insert({
      slug,
      name: form.name,
      email: form.email || null,
      instagram: form.instagram || null,
      business_type: businessType,
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
      products: cleanProducts,
    }).select('slug').single();

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    setGeneratedSlug(data.slug);
    if (form.email) {
      await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, brandName: form.name, slug: data.slug }),
      });
    }
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

          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 mb-8">
            <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Your embed code</div>
            <pre className="text-green-400 text-sm overflow-x-auto"><code>{embedCode}</code></pre>
          </div>

          <h2 className="text-xl font-bold mb-4">How to install on your platform</h2>
          <div className="space-y-4 mb-10">
            {[
              { icon: '🛍️', title: 'Shopify', steps: ['Go to Shopify Admin → Online Store → Themes', 'Click "..." next to your active theme → Edit code', 'Open theme.liquid', 'Find </head> and paste your script just before it', 'Click Save'] },
              { icon: '🔵', title: 'WordPress / WooCommerce', steps: ['Install the free plugin "Insert Headers and Footers"', 'Go to Settings → Insert Headers and Footers', 'Paste your script in the Scripts in Header box → Save'] },
              { icon: '⬛', title: 'Squarespace', steps: ['Go to Settings → Advanced → Code Injection', 'Paste your script in the Header field', 'Click Save', 'Note: requires Business plan or higher'] },
              { icon: '🌐', title: 'Wix', steps: ['Go to Settings → Custom Code', 'Click + Add Custom Code', 'Paste your script, set location to Head', 'Apply to All Pages → click Apply'] },
              { icon: '💻', title: 'Custom HTML', steps: ['Open your index.html', 'Find the closing </head> tag', 'Paste your script just before it', 'Save and re-upload to your hosting'] },
            ].map(platform => (
              <details key={platform.title} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden group">
                <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                  <span className="text-xl">{platform.icon}</span>
                  <span className="font-semibold">{platform.title}</span>
                  <span className="ml-auto text-slate-500 text-sm group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-400 space-y-2 border-t border-white/10 pt-4">
                  {platform.steps.map((s, i) => <p key={i}>{i + 1}. {s}</p>)}
                </div>
              </details>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Link href={`/biz/${generatedSlug}`} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              View your brand profile
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
        <div className="flex items-center gap-4">
          {step > 0 && <div className="text-sm text-slate-400">Step {step} of {totalSteps}</div>}
          <a href="https://instagram.com/aivisible_eg" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-400 transition-colors" title="@aivisible_eg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">

        {/* Step 0 */}
        {step === 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">What type of business are you?</h1>
            <p className="text-slate-400 mb-8">We&apos;ll tailor your AI profile to your industry</p>
            <div className="grid gap-4">
              {BUSINESS_TYPES.map(bt => {
                const isDisabled = false;
                return isDisabled ? (
                  <div key={bt.id} className="text-left p-6 rounded-2xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{bt.icon}</span>
                      <span className="text-lg font-semibold">{bt.title}</span>
                      <span className="ml-auto text-xs text-slate-500">Coming soon</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{bt.desc}</p>
                    <p className="text-slate-500 text-xs italic">{bt.examples}</p>
                  </div>
                ) : (
                  <button key={bt.id} onClick={() => setBusinessType(bt.id)}
                    className={`text-left p-6 rounded-2xl border transition-all ${businessType === bt.id ? 'bg-purple-900/40 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{bt.icon}</span>
                      <span className="text-lg font-semibold">{bt.title}</span>
                      {businessType === bt.id && <span className="ml-auto text-purple-400 text-xl">✓</span>}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{bt.desc}</p>
                    <p className="text-slate-500 text-xs italic">{bt.examples}</p>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(1)} disabled={!businessType}
              className="mt-8 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
              Continue
            </button>
          </div>
        )}

        {/* Progress bar */}
        {step > 0 && (
          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`} />
            ))}
          </div>
        )}

        {/* Step 1 — Basic info */}
        {step === 1 && businessType === 'restaurant' && (
          <div>
            <div className="flex items-center gap-2 mb-6"><span className="text-2xl">🍽️</span><h1 className="text-3xl font-bold">Basic info</h1></div>
            <p className="text-slate-400 mb-8">Tell AI search engines who you are</p>
            <div className="space-y-4">
              <Field label="Restaurant name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Bella Napoli" />
              <Field label="Your email *" value={form.email} onChange={v => update('email', v)} placeholder="hello@yourrestaurant.com" />
              <Field label="Cuisine type(s) *" value={form.cuisine} onChange={v => update('cuisine', v)} placeholder="e.g. Italian, Pizza, Pasta" />
              <Field label="Short description *" value={form.description} onChange={v => update('description', v)} placeholder="What makes your restaurant unique?" textarea />
              <PriceRange value={form.priceRange} onChange={v => update('priceRange', v)} />
            </div>
            <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} disabled={!form.name || !form.cuisine || !form.description} />
          </div>
        )}

        {step === 1 && businessType === 'fashion' && (
          <div>
            <div className="flex items-center gap-2 mb-6"><span className="text-2xl">👗</span><h1 className="text-3xl font-bold">Basic info</h1></div>
            <p className="text-slate-400 mb-8">Tell AI search engines who you are</p>
            <div className="space-y-4">
              <Field label="Brand name *" value={form.name} onChange={v => update('name', v)} placeholder="e.g. Okhtein" />
              <Field label="Your email *" value={form.email} onChange={v => update('email', v)} placeholder="hello@yourbrand.com" />
              <Field label="Style / category *" value={form.style} onChange={v => update('style', v)} placeholder="e.g. Sustainable, Luxury, Streetwear" />
              <Field label="Target audience *" value={form.targetAudience} onChange={v => update('targetAudience', v)} placeholder="e.g. Women 25-40, eco-conscious" />
              <Field label="Brand description *" value={form.description} onChange={v => update('description', v)} placeholder="What makes your brand unique? Story, materials, values..." textarea />
              <PriceRange value={form.priceRange} onChange={v => update('priceRange', v)} />
            </div>
            <StepNav onBack={() => setStep(0)} onNext={() => setStep(2)} disabled={!form.name || !form.style || !form.description} />
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
                <Field label="City *" value={form.city} onChange={v => update('city', v)} placeholder="e.g. Cairo" />
                <Field label="Country" value={form.state} onChange={v => update('state', v)} placeholder="e.g. Egypt" />
              </div>
              <Field label="Phone" value={form.phone} onChange={v => update('phone', v)} placeholder="+20 2 1234 5678" />
              <Field label="Website URL" value={form.website} onChange={v => update('website', v)} placeholder="https://yourrestaurant.com" />
              <Field label="Instagram handle" value={form.instagram} onChange={v => update('instagram', v)} placeholder="@yourrestaurant" />
            </div>
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} disabled={!form.address || !form.city} />
          </div>
        )}

        {step === 2 && businessType === 'fashion' && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Contact & shipping</h1>
            <p className="text-slate-400 mb-8">So AI can tell shoppers where to find you</p>
            <div className="space-y-4">
              <Field label="Website / shop URL *" value={form.website} onChange={v => update('website', v)} placeholder="https://yourbrand.com" />
              <Field label="Instagram handle" value={form.instagram} onChange={v => update('instagram', v)} placeholder="@yourbrand" />
              <Field label="Ships to *" value={form.shipsTo} onChange={v => update('shipsTo', v)} placeholder="e.g. Egypt, Middle East, Worldwide" />
              <Field label="HQ city *" value={form.city} onChange={v => update('city', v)} placeholder="e.g. Cairo" />
              <Field label="Phone / contact" value={form.phone} onChange={v => update('phone', v)} placeholder="+20 2 1234 5678" />
            </div>
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} disabled={!form.website || !form.shipsTo || !form.city} />
          </div>
        )}

        {/* Step 3 — Specialties */}
        {step === 3 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">{businessType === 'fashion' ? 'Signature pieces' : 'Specialties'}</h1>
            <p className="text-slate-400 mb-8">What should AI highlight about you?</p>
            <div className="space-y-4">
              <Field
                label={businessType === 'fashion' ? 'Signature products & collections' : 'Signature dishes & specialties'}
                value={form.specialties}
                onChange={v => update('specialties', v)}
                placeholder={businessType === 'fashion'
                  ? 'e.g. The Baguette Bag, Summer Linen Collection, Handcrafted Abayas\nOne per line'
                  : 'e.g. Wood-fired Margherita, House-made Tiramisu\nOne per line'}
                textarea
              />
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 text-sm text-purple-300">
                <strong>Tip:</strong> Be specific — &ldquo;handcrafted leather bags using Egyptian artisans&rdquo; beats &ldquo;nice bags&rdquo;. AI cites specifics.
              </div>
            </div>
            <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Continue" />
          </div>
        )}

        {/* Step 4 — Product catalogue */}
        {step === 4 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Product catalogue</h1>
            <p className="text-slate-400 mb-2">Add your key products so AI can surface them in specific searches.</p>
            <p className="text-xs text-slate-500 mb-8">e.g. someone searches &ldquo;black evening dress Cairo&rdquo; — your product appears. You can skip this and add later.</p>

            <div className="space-y-4 mb-6">
              {products.map((p, i) => (
                <div key={i} className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-300">Product {i + 1}</span>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(i)} className="text-slate-500 hover:text-red-400 text-sm transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Field label="Product name *" value={p.name} onChange={v => updateProduct(i, 'name', v)} placeholder="e.g. Black Linen Evening Dress" />
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <select
                        value={p.category}
                        onChange={e => updateProduct(i, 'category', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors">
                        <option value="">Select category</option>
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <Field label="Description" value={p.description} onChange={v => updateProduct(i, 'description', v)} placeholder="e.g. Flowing black linen dress with hand-embroidered neckline, perfect for weddings and occasions" />
                    <Field label="Price (e.g. EGP 1,200 or $45)" value={p.price} onChange={v => updateProduct(i, 'price', v)} placeholder="e.g. EGP 1,200" />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addProduct}
              className="w-full border border-dashed border-white/20 hover:border-purple-500/50 text-slate-400 hover:text-white py-3 rounded-xl text-sm transition-colors mb-6">
              + Add another product
            </button>

            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white py-4 rounded-xl font-semibold transition-colors">
                {saving ? 'Saving...' : 'Generate my AI script'}
              </button>
            </div>
            <button onClick={handleSubmit} disabled={saving} className="w-full mt-3 text-slate-500 hover:text-slate-400 text-sm transition-colors">
              Skip for now →
            </button>
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
        : <input className={cls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function PriceRange({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Price range</label>
      <div className="flex gap-3">
        {['$', '$$', '$$$', '$$$$'].map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${value === p ? 'bg-purple-600 border-purple-500' : 'border-white/20 hover:border-white/40'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepNav({ onBack, onNext, disabled, nextLabel }: { onBack: () => void; onNext: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    <div className="flex gap-4 mt-8">
      <button onClick={onBack} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">Back</button>
      <button onClick={onNext} disabled={disabled}
        className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
        {nextLabel ?? 'Continue'}
      </button>
    </div>
  );
}
