import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST create new item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, unit, emoji } = body;

    if (!name || !unit) {
      return NextResponse.json({ error: 'Name and unit are required' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: { name, unit, emoji },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Item with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

