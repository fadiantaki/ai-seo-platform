import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }

  const { email, brandName, slug } = await req.json();
  if (!email || !brandName || !slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const embedCode = `<script src="https://beaivisible.io/api/embed/${slug}" async></script>`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; max-width: 600px; margin: 0 auto;">
  <div style="margin-bottom: 32px;">
    <span style="font-size: 24px; font-weight: 900; background: linear-gradient(to right, #a78bfa, #f472b6); -webkit-background-clip: text; color: transparent;">AIVisible</span>
  </div>

  <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">Welcome to AIVisible, ${brandName}! 🎉</h1>
  <p style="color: #94a3b8; margin-bottom: 32px;">Your brand is now set up to appear in AI search results on Claude, ChatGPT, and Perplexity.</p>

  <p style="margin-bottom: 8px; font-weight: 600;">Your embed code:</p>
  <div style="background: #000; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 13px; color: #4ade80; word-break: break-all; margin-bottom: 32px;">
    ${embedCode}
  </div>

  <p style="color: #94a3b8; margin-bottom: 24px;">Paste this in your website's &lt;head&gt; tag to activate AI search optimization. It takes 2 minutes.</p>

  <a href="https://beaivisible.io/biz/${slug}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; margin-bottom: 32px;">
    View your brand profile →
  </a>

  <p style="color: #475569; font-size: 13px;">Questions? Reply to this email — we're here to help.</p>
  <p style="color: #475569; font-size: 13px;">— The AIVisible team</p>
</body>
</html>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AIVisible <hello@beaivisible.io>',
      to: email,
      subject: `${brandName} is now visible in AI search results`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
