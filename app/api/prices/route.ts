import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all prices
export async function GET() {
  try {
    const prices = await prisma.price.findMany({
      include: {
        item: true,
        market: true,
      },
      orderBy: [
        { item: { name: 'asc' } },
        { market: { name: 'asc' } },
      ],
    });
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

// POST create or update price
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemId, marketId, price } = body;

    if (!itemId || !marketId || price === undefined || price === null) {
      return NextResponse.json({ error: 'itemId, marketId, and price are required' }, { status: 400 });
    }

    // Check if price already exists
    const existingPrice = await prisma.price.findUnique({
      where: {
        itemId_marketId: {
          itemId,
          marketId,
        },
      },
    });

    let result;
    if (existingPrice) {
      // Update existing price
      result = await prisma.price.update({
        where: { id: existingPrice.id },
        data: { price: parseFloat(price) },
        include: {
          item: true,
          market: true,
        },
      });
    } else {
      // Create new price
      result = await prisma.price.create({
        data: {
          itemId,
          marketId,
          price: parseFloat(price),
        },
        include: {
          item: true,
          market: true,
        },
      });
    }

    return NextResponse.json(result, { status: existingPrice ? 200 : 201 });
  } catch (error) {
    console.error('Error creating/updating price:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid itemId or marketId' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create/update price' }, { status: 500 });
  }
}

