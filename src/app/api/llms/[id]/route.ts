import { NextRequest, NextResponse } from 'next/server';
import { demoRestaurant } from '@/lib/demo-restaurant';
import { buildLlmsTxt } from '@/lib/schema';

const restaurants: Record<string, typeof demoRestaurant> = {
  'demo-001': demoRestaurant,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurant = restaurants[id];
  if (!restaurant) {
    return new NextResponse('Not found', { status: 404 });
  }
  return new NextResponse(buildLlmsTxt(restaurant), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
