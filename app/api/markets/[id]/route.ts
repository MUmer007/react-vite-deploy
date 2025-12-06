import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single market
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const market = await prisma.market.findUnique({
      where: { id: params.id },
      include: { prices: true },
    });

    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }

    return NextResponse.json(market);
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json({ error: 'Failed to fetch market' }, { status: 500 });
  }
}

// PUT update market
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, rating, verified } = body;

    const market = await prisma.market.update({
      where: { id: params.id },
      data: { 
        name, 
        rating: rating ? parseFloat(rating) : null,
        verified: verified ?? false,
      },
    });

    return NextResponse.json(market);
  } catch (error: any) {
    console.error('Error updating market:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Market with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update market' }, { status: 500 });
  }
}

// DELETE market
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.market.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Market deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting market:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete market' }, { status: 500 });
  }
}

