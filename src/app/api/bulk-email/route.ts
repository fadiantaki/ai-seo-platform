export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 503 });
  }

  const { subject, body, preview } = await req.json();
  if (!subject || !body) {
    return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 });
  }

  // Just preview — return list of recipients without sending
  if (preview) {
    const { data } = await supabaseAdmin.from('brands').select('id, name, email, slug').not('email', 'is', null).order('name');
    return NextResponse.json({ recipients: data || [] });
  }

  const { data: brands } = await supabaseAdmin
    .from('brands')
    .select('id, name, email, slug')
    .not('email', 'is', null)
    .order('name');

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

    // Convert plain text to HTML: paragraphs, --- dividers, 👉 CTA links, embed code block
    const htmlBody = personalizedBody
      .split('\n\n')
      .map((para: string) => {
        const trimmed = para.trim();
        if (trimmed === '---') return '<hr style="border:none;border-top:1px solid #1e293b;margin:28px 0;" />';
        if (trimmed.startsWith('{embed_code}') || trimmed.includes('<script')) {
          return `<div style="background:#000;border-radius:10px;padding:16px;font-family:monospace;font-size:13px;color:#4ade80;word-break:break-all;margin:8px 0;">${trimmed.replace('{embed_code}', `&lt;script src="https://beaivisible.io/api/embed/${brand.slug}" async&gt;&lt;/script&gt;`)}</div>`;
        }
        if (trimmed.startsWith('👉')) {
          return `<p style="margin:16px 0;font-size:16px;font-weight:700;">${trimmed.replace(/👉\s*/, '👉 ').replace(/(https?:\/\/\S+)/, '<a href="$1" style="color:#a78bfa;">$1</a>')}</p>`;
        }
        if (trimmed.startsWith('TO APPEAR IN AI SEARCH')) {
          return `<p style="margin:16px 0;font-weight:800;font-size:15px;color:#a78bfa;">${trimmed}</p>`;
        }
        return `<p style="margin:16px 0;line-height:1.75;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:0;margin:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 32px;">
    <div style="margin-bottom:36px;padding-bottom:20px;border-bottom:1px solid #1e293b;">
      <span style="font-size:22px;font-weight:900;color:#a78bfa;">AIVisible</span>
      <span style="font-size:13px;color:#475569;margin-left:10px;">Egypt&apos;s AI Search Directory</span>
    </div>
    ${htmlBody}
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1e293b;color:#475569;font-size:12px;">
      AIVisible &middot; <a href="mailto:hello@beaivisible.io" style="color:#a78bfa;">hello@beaivisible.io</a> &middot; <a href="https://instagram.com/aivisible_eg" style="color:#a78bfa;">@aivisible_eg</a>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
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
      // Mark outreach as sent
      await supabaseAdmin.from('brands').update({
        outreach_sent: true,
        outreach_sent_at: new Date().toISOString(),
      }).eq('id', brand.id);
    } else {
      const err = await res.text();
      results.push({ name: brand.name, email: brand.email, ok: false, error: err });
    }

    // Small delay to avoid Resend rate limits
    await new Promise(r => setTimeout(r, 100));
  }

  const sent = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;

  return NextResponse.json({ sent, failed, results });
}
