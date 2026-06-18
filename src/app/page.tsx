import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AIVisible
          </span>
          <span className="text-xs bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <div className="flex gap-6 items-center text-sm text-slate-300">
          <Link href="/directory" className="hover:text-white transition-colors">Directory</Link>
          <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-900/50 border border-purple-700/50 rounded-full px-4 py-2 text-sm text-purple-300 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Now optimizing for Claude, ChatGPT &amp; Perplexity
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Make your business
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            visible to AI search
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
          When someone asks Claude or ChatGPT for the best restaurant or fashion brand,
          your business shows up. One script tag. No technical knowledge needed.
        </p>
        <div className="flex justify-center gap-4 mb-10">
          <span className="bg-white/10 text-slate-300 px-4 py-2 rounded-full text-sm">🍽️ Restaurants</span>
          <span className="bg-white/10 text-slate-300 px-4 py-2 rounded-full text-sm">👗 Fashion Brands</span>
          <span className="bg-white/10 text-slate-300 px-4 py-2 rounded-full text-sm">more coming soon</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Register your restaurant free
          </Link>
          <Link href="/demo" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            See live demo
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
        <p className="text-slate-400 text-center mb-14">Three steps to AI search visibility</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Register & fill your profile', desc: 'Add your restaurant details: menu, hours, specialties, location. Takes 5 minutes.' },
            { step: '02', title: 'Get your embed script', desc: 'Copy one script tag and paste it into your website head. Your webmaster can do it in 30 seconds.' },
            { step: '03', title: 'Appear in AI answers', desc: 'Claude, ChatGPT, and Perplexity start surfacing your restaurant when locals search for your cuisine.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-4xl font-black text-purple-500/40 mb-4">{step}</div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What gets injected */}
      <section className="max-w-5xl mx-auto px-8 py-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">What the script injects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🏷️', title: 'Schema.org JSON-LD', desc: 'Full Restaurant schema with menu, hours, ratings, location — the standard AI crawlers read.' },
              { icon: '🤖', title: 'llms.txt file', desc: 'A human-readable AI content file (like robots.txt but for LLMs) that summarizes your restaurant in AI-friendly format.' },
              { icon: '📋', title: 'AI meta tags', desc: 'Custom meta tags that give AI systems quick structured access to your key info.' },
              { icon: '📍', title: 'Geo coordinates', desc: 'Precise lat/lng so AI systems can answer "best pizza near [location]" queries accurately.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">Simple pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Free', price: '$0', features: ['Schema.org injection', 'llms.txt generation', '1 location', 'Basic AI meta tags'], cta: 'Start free', highlight: false },
            { name: 'Starter', price: '$29/mo', features: ['Everything in Free', 'AI search analytics', 'Priority listing', 'Monthly AI visibility report', '3 locations'], cta: 'Start trial', highlight: true },
            { name: 'Pro', price: '$79/mo', features: ['Everything in Starter', 'MCP server endpoint', 'Direct Claude tool integration', 'Competitor analysis', 'Unlimited locations'], cta: 'Contact us', highlight: false },
          ].map(({ name, price, features, cta, highlight }) => (
            <div key={name} className={`rounded-2xl p-6 border ${highlight ? 'bg-purple-900/40 border-purple-500' : 'bg-white/5 border-white/10'}`}>
              {highlight && <div className="text-xs text-purple-300 font-semibold mb-3 uppercase tracking-wider">Most popular</div>}
              <div className="text-xl font-bold mb-1">{name}</div>
              <div className="text-3xl font-black mb-6">{price}</div>
              <ul className="space-y-2 mb-8">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-green-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className={`block text-center py-3 rounded-xl font-semibold transition-colors ${highlight ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'border border-white/20 hover:border-white/40'}`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-8 text-center text-slate-500 text-sm">
        © 2026 AIVisible · Making local businesses findable by AI
      </footer>
    </main>
  );
}
