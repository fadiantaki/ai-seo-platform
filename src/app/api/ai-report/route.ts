export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface BrandData {
  id: string;
  name: string;
  slug: string;
  city: string;
  business_type: string;
  style: string[];
  description: string;
  specialties: string[];
  price_range: string;
  ships_to: string;
  cuisine?: string;
}

function buildQueries(brand: BrandData): string[] {
  const isRestaurant = brand.business_type === 'restaurant';
  const city = brand.city || 'Cairo';
  const category = isRestaurant
    ? (brand.style?.[0] || 'restaurant')
    : (brand.style?.[0] || 'fashion brand');

  return isRestaurant
    ? [
        `What are the best ${category} restaurants in ${city}, Egypt?`,
        `Top places to eat in ${city} Egypt`,
        `Best restaurants in ${city} for a special occasion`,
        `Where should I eat in ${city}?`,
        `Recommend a good restaurant in ${city} Egypt`,
      ]
    : [
        `What are the best ${category} fashion brands in Egypt?`,
        `Top Egyptian fashion brands to shop from`,
        `Best local fashion brands in ${city} Egypt`,
        `Where to shop for ${category} clothing in Egypt?`,
        `Egyptian fashion brands worth knowing`,
      ];
}

function detectMention(response: string, brandName: string): boolean {
  const lower = response.toLowerCase();
  const name = brandName.toLowerCase();
  // Check full name and also abbreviated versions
  if (lower.includes(name)) return true;
  // Check first word of brand name (e.g. "Okhtein" from "Okhtein Cairo")
  const firstWord = name.split(' ')[0];
  if (firstWord.length > 3 && lower.includes(firstWord)) return true;
  return false;
}

function extractSentiment(response: string, brandName: string): 'positive' | 'neutral' | 'not_mentioned' {
  if (!detectMention(response, brandName)) return 'not_mentioned';
  const positiveWords = ['excellent', 'amazing', 'best', 'top', 'great', 'highly', 'recommend', 'popular', 'renowned', 'celebrated', 'must', 'iconic'];
  const lower = response.toLowerCase();
  if (positiveWords.some(w => lower.includes(w))) return 'positive';
  return 'neutral';
}

async function queryOpenAI(question: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: question }],
      max_tokens: 400,
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? '';
}

async function saveReport(brandId: string, report: object) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  await fetch(`${url}/rest/v1/brands?id=eq.${brandId}`, {
    method: 'PATCH',
    headers: {
      apikey: key!,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      ai_report: report,
      ai_report_generated_at: new Date().toISOString(),
    }),
  });
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI reports not configured' }, { status: 503 });
  }

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  // Fetch brand from Supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const brandRes = await fetch(
    `${url}/rest/v1/brands?slug=eq.${slug}&select=id,name,slug,city,business_type,style,description,specialties,price_range,ships_to&limit=1`,
    { headers: { apikey: key!, Authorization: `Bearer ${key}` } }
  );
  const brands = await brandRes.json();
  const brand: BrandData = brands?.[0];
  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  const queries = buildQueries(brand);
  const results: { query: string; response: string; mentioned: boolean; sentiment: string }[] = [];

  for (const query of queries) {
    try {
      const response = await queryOpenAI(query);
      results.push({
        query,
        response,
        mentioned: detectMention(response, brand.name),
        sentiment: extractSentiment(response, brand.name),
      });
    } catch {
      results.push({ query, response: '', mentioned: false, sentiment: 'not_mentioned' });
    }
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  const mentionCount = results.filter(r => r.mentioned).length;
  const positiveCount = results.filter(r => r.sentiment === 'positive').length;
  const score = Math.round((mentionCount / results.length) * 60 + (positiveCount / results.length) * 40);

  let grade: string;
  let summary: string;
  if (score >= 70) { grade = 'A'; summary = 'Excellent AI visibility — AI platforms know and recommend your brand.'; }
  else if (score >= 45) { grade = 'B'; summary = 'Good visibility but room to grow. You appear in some AI answers.'; }
  else if (score >= 20) { grade = 'C'; summary = 'Limited visibility. AI platforms rarely mention your brand.'; }
  else { grade = 'D'; summary = 'Low visibility. Your brand is largely invisible to AI search.'; }

  const mentionedIn = results.filter(r => r.mentioned).map(r => r.query);
  const missedIn = results.filter(r => !r.mentioned).map(r => r.query);
  // Find a sample response where brand is mentioned, or first response
  const sampleResult = results.find(r => r.mentioned) ?? results[0];

  const report = {
    score,
    grade,
    summary,
    mentionCount,
    totalQueries: results.length,
    mentionRate: `${mentionCount}/${results.length}`,
    mentionedIn,
    missedIn,
    sampleQuery: sampleResult?.query,
    sampleResponse: sampleResult?.response?.slice(0, 500),
    generatedAt: new Date().toISOString(),
  };

  await saveReport(brand.id, report);

  return NextResponse.json({ report });
}
