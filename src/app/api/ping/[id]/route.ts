export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const referer = req.headers.get('referer') || req.headers.get('origin') || '';
  let domain = '';
  try { domain = new URL(referer).hostname; } catch {}

  await supabase.from('brands').update({
    embed_installed: true,
    embed_last_seen: new Date().toISOString(),
    ...(domain && { embed_domain: domain }),
  }).eq('slug', id);

  return new NextResponse(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' },
  });
}
