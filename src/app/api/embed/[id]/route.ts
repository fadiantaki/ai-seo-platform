import { NextRequest, NextResponse } from 'next/server';
import { demoRestaurant } from '@/lib/demo-restaurant';
import { buildSchemaOrg } from '@/lib/schema';

const restaurants: Record<string, typeof demoRestaurant> = {
  'demo-001': demoRestaurant,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = restaurants[id];
  if (!restaurant) {
    return new NextResponse(`console.error('AI SEO: restaurant ${id} not found');`, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  const schema = buildSchemaOrg(restaurant);
  const baseUrl = new URL(req.url).origin;
  const llmsUrl = `${baseUrl}/api/llms/${id}`;

  const script = `
(function() {
  // Inject Schema.org JSON-LD
  var schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = ${JSON.stringify(JSON.stringify(schema))};
  document.head.appendChild(schema);

  // Inject llms.txt link tag (AI crawlers follow this)
  var llmsLink = document.createElement('link');
  llmsLink.rel = 'ai-content';
  llmsLink.href = '${llmsUrl}';
  llmsLink.type = 'text/plain';
  document.head.appendChild(llmsLink);

  // Inject AI-optimized meta tags
  var metas = [
    { name: 'ai:name', content: ${JSON.stringify(restaurant.name)} },
    { name: 'ai:type', content: 'Restaurant' },
    { name: 'ai:cuisine', content: ${JSON.stringify(restaurant.cuisine.join(', '))} },
    { name: 'ai:location', content: ${JSON.stringify(`${restaurant.city}, ${restaurant.state}`)} },
    { name: 'ai:rating', content: ${JSON.stringify(`${restaurant.rating}/5 (${restaurant.reviewCount} reviews)`)} },
    { name: 'ai:price', content: ${JSON.stringify(restaurant.priceRange)} },
    { name: 'ai:specialties', content: ${JSON.stringify(restaurant.specialties.slice(0, 3).join('; '))} },
    { name: 'ai:hours-summary', content: 'Mon-Thu 11:30am-9:30pm, Fri-Sat 11:30am-11pm, Sun 12pm-9pm' },
  ];
  metas.forEach(function(m) {
    var tag = document.createElement('meta');
    tag.name = m.name;
    tag.content = m.content;
    document.head.appendChild(tag);
  });

  // Add llms.txt route at /llms.txt via a service worker hint (optional)
  // Restaurants can also manually add /llms.txt to their server pointing to: ${llmsUrl}
  console.log('[AI SEO] ${restaurant.name} is AI-search optimized. llms.txt: ${llmsUrl}');
})();
`.trim();

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
