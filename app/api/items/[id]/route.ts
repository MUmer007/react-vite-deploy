import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single item
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: { prices: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

// PUT update item
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, unit, emoji } = body;

    const item = await prisma.item.update({
      where: { id: params.id },
      data: { name, unit, emoji },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Error updating item:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Item with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE item
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.item.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

