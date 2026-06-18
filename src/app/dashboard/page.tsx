'use client';
import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  name: string;
  cuisine: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  priceRange: string;
  specialties: string;
}

export default function DashboardPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: '', cuisine: '', description: '', address: '',
    city: '', state: '', phone: '', website: '', priceRange: '$$', specialties: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const generatedId = 'demo-001'; // In production, this would be a real ID from Supabase

  const update = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const embedCode = `<script src="https://aivisible.io/api/embed/${generatedId}" async></script>`;
  const localEmbedCode = `<script src="http://localhost:3000/api/embed/${generatedId}" async></script>`;

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-8">
        <div className="max-w-2xl w-full text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-3">You&apos;re AI-ready!</h1>
          <p className="text-slate-400 mb-8">{form.name} is now registered. Add this script to your website&apos;s &lt;head&gt;:</p>
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 mb-6 text-left">
            <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Production embed code</div>
            <pre className="text-green-400 text-sm overflow-x-auto"><code>{embedCode}</code></pre>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Local dev (test right now)</div>
            <pre className="text-blue-400 text-sm overflow-x-auto"><code>{localEmbedCode}</code></pre>
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
        <div className="text-sm text-slate-400">Step {step} of 3</div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-purple-500' : 'bg-white/10'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="text-3xl font-bold mb-2">Basic info</h1>
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
            <button onClick={() => setStep(2)} disabled={!form.name || !form.cuisine || !form.description}
              className="mt-8 w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
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
              <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">
                Back
              </button>
              <button onClick={() => setStep(3)} disabled={!form.address || !form.city}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
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
                <strong>Tip:</strong> Be specific. &ldquo;Wood-fired Neapolitan pizza with 48-hour fermented dough&rdquo; is better than &ldquo;great pizza&rdquo;. AI cites specifics.
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white py-4 rounded-xl font-semibold hover:border-white/40 transition-colors">
                Back
              </button>
              <button onClick={() => setSubmitted(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-semibold transition-colors">
                Generate my AI script
              </button>
            </div>
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
