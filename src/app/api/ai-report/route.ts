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
  website: string;
  instagram: string;
  embed_installed: boolean;
  target_audience: string;
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
  if (lower.includes(name)) return true;
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

// Score how complete and optimized the brand profile is (0–40 pts)
function profileScore(brand: BrandData): { score: number; breakdown: Record<string, number> } {
  const checks: Record<string, number> = {
    'Brand description': brand.description?.length > 50 ? 10 : brand.description?.length > 0 ? 5 : 0,
    'Signature products / specialties': (brand.specialties?.length ?? 0) >= 3 ? 10 : (brand.specialties?.length ?? 0) > 0 ? 5 : 0,
    'Website linked': brand.website ? 8 : 0,
    'Instagram connected': brand.instagram ? 6 : 0,
    'Target audience defined': brand.target_audience ? 6 : 0,
  };
  const score = Object.values(checks).reduce((a, b) => a + b, 0);
  return { score, breakdown: checks };
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const brandRes = await fetch(
    `${url}/rest/v1/brands?slug=eq.${slug}&select=id,name,slug,city,business_type,style,description,specialties,price_range,ships_to,website,instagram,embed_installed,target_audience&limit=1`,
    { headers: { apikey: key!, Authorization: `Bearer ${key}` } }
  );
  const brands = await brandRes.json();
  const brand: BrandData = brands?.[0];
  if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  // --- Component 1: Profile completeness (0–40 pts) ---
  const profile = profileScore(brand);

  // --- Component 2: Embed installed (0–20 pts) ---
  const embedScore = brand.embed_installed ? 20 : 0;

  // --- Component 3: AI mention score (0–40 pts) ---
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
    await new Promise(r => setTimeout(r, 300));
  }

  const mentionCount = results.filter(r => r.mentioned).length;
  const positiveCount = results.filter(r => r.sentiment === 'positive').length;
  const aiMentionScore = Math.round((mentionCount / results.length) * 24 + (positiveCount / results.length) * 16);

  // --- Final composite score ---
  const score = profile.score + embedScore + aiMentionScore;

  // Grade thresholds
  let grade: string;
  if (score >= 75) grade = 'A';
  else if (score >= 55) grade = 'B';
  else if (score >= 35) grade = 'C';
  else grade = 'D';

  // Context-aware summary
  const mentionedIn = results.filter(r => r.mentioned).map(r => r.query);
  const missedIn = results.filter(r => !r.mentioned).map(r => r.query);

  let aiVisibilityContext: string;
  if (mentionCount === 0) {
    aiVisibilityContext = 'ChatGPT does not mention your brand yet — this is normal for most Egyptian businesses today. Installing the embed code is the first step to changing that.';
  } else if (mentionCount <= 2) {
    aiVisibilityContext = `ChatGPT mentions your brand in ${mentionCount} of ${results.length} relevant searches. You\'re ahead of most Egyptian brands — keep building.`;
  } else {
    aiVisibilityContext = `Strong AI presence — ChatGPT mentions you in ${mentionCount} of ${results.length} relevant searches.`;
  }

  // What's missing (actionable gaps)
  const gaps: string[] = [];
  if (!brand.embed_installed) gaps.push('Install the embed code on your website (+20 pts)');
  if (!brand.description || brand.description.length < 50) gaps.push('Add a detailed brand description (+10 pts)');
  if ((brand.specialties?.length ?? 0) < 3) gaps.push('Add at least 3 signature products or specialties (+10 pts)');
  if (!brand.website) gaps.push('Add your website URL (+8 pts)');
  if (!brand.instagram) gaps.push('Connect your Instagram handle (+6 pts)');
  if (!brand.target_audience) gaps.push('Define your target audience (+6 pts)');

  const sampleResult = results.find(r => r.mentioned) ?? results[0];

  const report = {
    score,
    grade,
    aiVisibilityContext,
    // Score breakdown
    profileScore: profile.score,
    profileMax: 40,
    profileBreakdown: profile.breakdown,
    embedScore,
    embedMax: 20,
    aiMentionScore,
    aiMentionMax: 40,
    // AI mention details
    mentionCount,
    totalQueries: results.length,
    mentionRate: `${mentionCount}/${results.length}`,
    mentionedIn,
    missedIn,
    gaps,
    sampleQuery: sampleResult?.query,
    sampleResponse: sampleResult?.response?.slice(0, 500),
    generatedAt: new Date().toISOString(),
  };

  await saveReport(brand.id, report);
  return NextResponse.json({ report });
}
