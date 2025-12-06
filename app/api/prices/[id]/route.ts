import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single price
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const price = await prisma.price.findUnique({
      where: { id },
      include: {
        item: true,
        market: true,
      },
    });

    if (!price) {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }

    return NextResponse.json(price);
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 });
  }
}

// PUT update price
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price: priceValue } = body;

    if (priceValue === undefined || priceValue === null) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }

    const price = await prisma.price.update({
      where: { id },
      data: { price: parseFloat(priceValue) },
      include: {
        item: true,
        market: true,
      },
    });

    return NextResponse.json(price);
  } catch (error) {
    console.error('Error updating price:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}

// DELETE price
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.price.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Price deleted successfully' });
  } catch (error) {
    console.error('Error deleting price:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete price' }, { status: 500 });
  }
}

