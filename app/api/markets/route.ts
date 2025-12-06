import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all markets
export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}

// POST create new market
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rating, verified } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const market = await prisma.market.create({
      data: { 
        name, 
        rating: rating ? parseFloat(rating) : null,
        verified: verified ?? false,
      },
    });

    return NextResponse.json(market, { status: 201 });
  } catch (error) {
    console.error('Error creating market:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Market with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create market' }, { status: 500 });
  }
}

