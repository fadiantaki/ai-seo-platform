import Link from 'next/link';
import { demoRestaurant } from '@/lib/demo-restaurant';
import { buildSchemaOrg, buildLlmsTxt } from '@/lib/schema';

export default function DemoPage() {
  const r = demoRestaurant;
  const schema = buildSchemaOrg(r);
  const llmsTxt = buildLlmsTxt(r);
  const embedCode = `<script src="https://aivisible.io/api/embed/${r.id}" async></script>`;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AIVisible
        </Link>
        <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Register your restaurant
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-10">
          <div className="text-sm text-purple-400 font-semibold mb-2 uppercase tracking-wider">Live Demo</div>
          <h1 className="text-4xl font-bold mb-3">{r.name}</h1>
          <p className="text-slate-400">{r.address}, {r.city}, {r.state} · {r.cuisine.join(', ')} · {r.priceRange} · {r.rating}★ ({r.reviewCount} reviews)</p>
        </div>

        {/* Embed snippet */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-1">Embed snippet</h2>
          <p className="text-sm text-slate-400 mb-4">This one line goes in the restaurant website &lt;head&gt;</p>
          <pre className="bg-black/50 rounded-xl p-4 text-sm text-green-400 overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* llms.txt preview */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold">llms.txt</h2>
              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">AI reads this</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">Auto-generated at /api/llms/{r.id}</p>
            <pre className="bg-black/50 rounded-xl p-4 text-xs text-slate-300 overflow-auto max-h-80 whitespace-pre-wrap">
              {llmsTxt}
            </pre>
          </div>

          {/* Schema.org preview */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold">Schema.org JSON-LD</h2>
              <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full">Injected in head</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">Structured data AI crawlers parse</p>
            <pre className="bg-black/50 rounded-xl p-4 text-xs text-slate-300 overflow-auto max-h-80">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </div>
        </div>

        {/* Menu */}
        <div className="mt-8 bg-slate-900 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Menu items (included in AI data)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {r.menu.map(item => (
              <div key={item.name} className="flex justify-between items-start bg-white/5 rounded-xl p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.isSignature && <span className="text-xs bg-orange-900/50 text-orange-300 px-1.5 py-0.5 rounded">Signature</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  <div className="flex gap-1 mt-1">
                    {item.isVegetarian && <span className="text-xs text-green-400">Vegetarian</span>}
                    {item.isGlutenFree && <span className="text-xs text-yellow-400">GF</span>}
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-300 ml-4">${item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-400 mb-4">Ready to make your restaurant AI-visible?</p>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
            Register your restaurant
          </Link>
        </div>
      </div>
    </main>
  );
}
