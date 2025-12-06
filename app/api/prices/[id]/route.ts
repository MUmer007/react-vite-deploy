import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single price
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const price = await prisma.price.findUnique({
      where: { id: params.id },
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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { price: priceValue } = body;

    if (priceValue === undefined || priceValue === null) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }

    const price = await prisma.price.update({
      where: { id: params.id },
      data: { price: parseFloat(priceValue) },
      include: {
        item: true,
        market: true,
      },
    });

    return NextResponse.json(price);
  } catch (error: any) {
    console.error('Error updating price:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}

// DELETE price
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.price.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Price deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting price:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Price not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete price' }, { status: 500 });
  }
}

