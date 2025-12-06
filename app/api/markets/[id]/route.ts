import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single market
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const market = await prisma.market.findUnique({
      where: { id },
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
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, rating, verified } = body;

    const market = await prisma.market.update({
      where: { id },
      data: { 
        name, 
        rating: rating ? parseFloat(rating) : null,
        verified: verified ?? false,
      },
    });

    return NextResponse.json(market);
  } catch (error) {
    console.error('Error updating market:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Market not found' }, { status: 404 });
      }
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Market with this name already exists' }, { status: 409 });
      }
    }
    return NextResponse.json({ error: 'Failed to update market' }, { status: 500 });
  }
}

// DELETE market
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.market.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Market deleted successfully' });
  } catch (error) {
    console.error('Error deleting market:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete market' }, { status: 500 });
  }
}

