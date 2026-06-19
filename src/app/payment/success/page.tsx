import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-8">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-3">Payment successful!</h1>
        <p className="text-slate-400 mb-8">
          Welcome to AIVisible. Your plan is now active and your brand is being prioritized in AI search results.
        </p>
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 mb-8 text-left text-sm text-slate-400 space-y-2">
          <p className="font-semibold text-white">What happens next:</p>
          <p>✓ Your brand moves to priority ranking in the directory</p>
          <p>✓ AI search analytics start tracking within 24 hours</p>
          <p>✓ You&apos;ll receive your first AI visibility report next month</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/directory" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            View directory
          </Link>
          <Link href="/analytics" className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            View analytics
          </Link>
        </div>
      </div>
    </main>
  );
}
