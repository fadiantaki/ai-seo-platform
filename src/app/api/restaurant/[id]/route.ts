import { NextRequest, NextResponse } from 'next/server';
import { demoRestaurant } from '@/lib/demo-restaurant';

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
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(restaurant, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
