import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
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

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px; max-width: 600px; margin: 0 auto;">
  <div style="margin-bottom: 32px;">
    <span style="font-size: 24px; font-weight: 900; color: #a78bfa;">AIVisible</span>
  </div>
  <div style="white-space: pre-wrap; line-height: 1.7; color: #e2e8f0;">${personalizedBody}</div>
  <hr style="border: none; border-top: 1px solid #1e293b; margin: 32px 0;" />
  <p style="color: #475569; font-size: 12px;">AIVisible · hello@beaivisible.io · <a href="https://instagram.com/aivisible_eg" style="color: #a78bfa;">@aivisible_eg</a></p>
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
