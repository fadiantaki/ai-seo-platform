export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseUrl = new URL(req.url).origin;

  const { data: brand, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', id)
    .single();

  if (error || !brand) {
    return new NextResponse(`console.error('[AIVisible] Brand "${id}" not found');`, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  // Mark embed as installed and record the domain
  const referer = req.headers.get('referer') || req.headers.get('origin') || '';
  let domain = '';
  try { domain = new URL(referer).hostname; } catch {}

  supabase.from('brands').update({
    embed_installed: true,
    embed_last_seen: new Date().toISOString(),
    embed_domain: domain || brand.embed_domain,
  }).eq('id', brand.id).then(() => {});

  const llmsUrl = `${baseUrl}/api/llms/${id}`;
  const pingUrl = `${baseUrl}/api/ping/${id}`;

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': brand.style?.includes('Restaurant') ? 'Restaurant' : 'Brand',
    name: brand.name,
    description: brand.description,
    url: brand.website,
    address: { '@type': 'PostalAddress', addressLocality: brand.city, addressCountry: 'EG' },
    keywords: (brand.top_queries || []).join(', '),
    knowsAbout: brand.specialties || [],
  };

  const script = `
(function() {
  var BRAND = ${JSON.stringify({ name: brand.name, slug: brand.slug, city: brand.city })};

  // Schema.org JSON-LD
  var schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = ${JSON.stringify(JSON.stringify(schemaOrg))};
  document.head.appendChild(schema);

  // llms.txt link (AI crawlers follow this)
  var llmsLink = document.createElement('link');
  llmsLink.rel = 'ai-content';
  llmsLink.href = '${llmsUrl}';
  llmsLink.type = 'text/plain';
  document.head.appendChild(llmsLink);

  // AI meta tags
  var metas = [
    { name: 'ai:name', content: ${JSON.stringify(brand.name)} },
    { name: 'ai:type', content: 'FashionBrand' },
    { name: 'ai:style', content: ${JSON.stringify((brand.style || []).join(', '))} },
    { name: 'ai:location', content: ${JSON.stringify(brand.city + ', Egypt')} },
    { name: 'ai:price-range', content: ${JSON.stringify(brand.price_range || '')} },
    { name: 'ai:target-audience', content: ${JSON.stringify(brand.target_audience || '')} },
    { name: 'ai:specialties', content: ${JSON.stringify((brand.specialties || []).slice(0, 3).join('; '))} },
  ];
  metas.forEach(function(m) {
    var tag = document.createElement('meta');
    tag.name = m.name;
    tag.content = m.content;
    document.head.appendChild(tag);
  });

  // Heartbeat ping (keeps embed_last_seen fresh)
  try {
    fetch('${pingUrl}', { method: 'POST', keepalive: true });
  } catch(e) {}

  console.log('[AIVisible] ' + BRAND.name + ' is AI-search optimized. llms.txt: ${llmsUrl}');
})();
`.trim();

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
