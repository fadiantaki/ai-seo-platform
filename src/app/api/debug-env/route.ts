export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    openAIPrefix: process.env.OPENAI_API_KEY?.slice(0, 7) ?? 'NOT SET',
    hasResend: !!process.env.RESEND_API_KEY,
    hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  });
}
