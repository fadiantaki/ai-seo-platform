export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

function buildHtmlBody(personalizedBody: string, slug: string): string {
  return personalizedBody
    .split('\n\n')
    .map((para: string) => {
      const trimmed = para.trim();
      if (trimmed === '---') return '<hr style="border:none;border-top:1px solid #1e293b;margin:28px 0;" />';
      if (trimmed.includes('<script')) {
        return `<div style="background:#000;border-radius:10px;padding:16px;font-family:monospace;font-size:13px;color:#4ade80;word-break:break-all;margin:8px 0;">${trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
      }
      if (trimmed.startsWith('👉')) {
        return `<p style="margin:16px 0;font-size:16px;font-weight:700;">${trimmed.replace(/(https?:\/\/\S+)/, '<a href="$1" style="color:#a78bfa;">$1</a>')}</p>`;
      }
      if (trimmed.startsWith('TO APPEAR IN AI SEARCH')) {
        return `<p style="margin:16px 0;font-weight:800;font-size:15px;color:#a78bfa;">${trimmed}</p>`;
      }
      return `<p style="margin:16px 0;line-height:1.75;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
}

function wrapHtml(htmlBody: string): string {
  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:0;margin:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 32px;">
    <div style="margin-bottom:36px;padding-bottom:20px;border-bottom:1px solid #1e293b;">
      <span style="font-size:22px;font-weight:900;color:#a78bfa;">AIVisible</span>
      <span style="font-size:13px;color:#475569;margin-left:10px;">Egypt's AI Search Directory</span>
    </div>
    ${htmlBody}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1e293b;color:#475569;font-size:12px;">
      AIVisible &middot; <a href="mailto:hello@beaivisible.io" style="color:#a78bfa;">hello@beaivisible.io</a> &middot; <a href="https://instagram.com/aivisible_eg" style="color:#a78bfa;">@aivisible_eg</a>
    </div>
  </div>
</body>
</html>`;
}

async function getSupabaseBrands() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(
    `${url}/rest/v1/brands?select=id,name,email,slug&email=not.is.null&order=name`,
    { headers: { apikey: key!, Authorization: `Bearer ${key}` } }
  );
  return res.json() as Promise<{ id: string; name: string; email: string; slug: string }[]>;
}

async function markOutreachSent(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  await fetch(`${url}/rest/v1/brands?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ outreach_sent: true, outreach_sent_at: new Date().toISOString() }),
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }

  const { subject, body, preview, ids, testEmail } = await req.json();
  if (!subject || !body) {
    return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 });
  }

  const allBrands = await getSupabaseBrands();

  if (preview) {
    return NextResponse.json({ recipients: allBrands });
  }

  // Test mode — send to a single address using dummy brand data
  if (testEmail) {
    const testBrand = { id: 'test', name: 'Your Brand', email: testEmail, slug: 'your-brand' };
    const personalizedBody = body
      .replace(/\{name\}/g, testBrand.name)
      .replace(/\{slug\}/g, testBrand.slug)
      .replace(/\{profile_url\}/g, `https://beaivisible.io/biz/${testBrand.slug}`)
      .replace(/\{embed_code\}/g, `<script src="https://beaivisible.io/api/embed/${testBrand.slug}" async></script>`);
    const htmlBody = buildHtmlBody(personalizedBody, testBrand.slug);
    const html = wrapHtml(htmlBody);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'AIVisible <hello@beaivisible.io>', to: testEmail, subject: `[TEST] ${subject.replace(/\{name\}/g, testBrand.name)}`, html }),
    });
    return NextResponse.json(res.ok ? { sent: 1, failed: 0 } : { sent: 0, error: await res.text() });
  }

  // If specific IDs provided, filter to those only
  const brands = ids?.length ? allBrands.filter((b: { id: string }) => ids.includes(b.id)) : allBrands;

  if (!brands || brands.length === 0) {
    return NextResponse.json({ error: 'No brands with emails found' }, { status: 404 });
  }

  const results: { name: string; email: string; ok: boolean; error?: string }[] = [];

  for (const brand of brands) {
    const personalizedBody = body
      .replace(/\{name\}/g, brand.name)
      .replace(/\{slug\}/g, brand.slug)
      .replace(/\{profile_url\}/g, `https://beaivisible.io/biz/${brand.slug}`)
      .replace(/\{embed_code\}/g, `<script src="https://beaivisible.io/api/embed/${brand.slug}" async></script>`);

    const html = wrapHtml(buildHtmlBody(personalizedBody, brand.slug));

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIVisible <hello@beaivisible.io>',
        to: brand.email,
        subject: subject.replace(/\{name\}/g, brand.name),
        html,
      }),
    });

    if (res.ok) {
      results.push({ name: brand.name, email: brand.email, ok: true });
      await markOutreachSent(brand.id);
    } else {
      const err = await res.text();
      results.push({ name: brand.name, email: brand.email, ok: false, error: err });
    }

    await new Promise(r => setTimeout(r, 100));
  }

  const sent = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;

  return NextResponse.json({ sent, failed, results });
}
