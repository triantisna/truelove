import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type CreateOrderPayload = {
  customerName: string;
  customerWhatsapp: string;
  occasion: string;
  packageId: string;
  price: number;
  notes?: string | null;
};

function isCreateOrderPayload(value: unknown): value is CreateOrderPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.customerName === 'string' &&
    payload.customerName.trim().length > 0 &&
    typeof payload.customerWhatsapp === 'string' &&
    typeof payload.occasion === 'string' &&
    payload.occasion.trim().length > 0 &&
    typeof payload.packageId === 'string' &&
    typeof payload.price === 'number' &&
    Number.isFinite(payload.price) &&
    (payload.notes === undefined ||
      payload.notes === null ||
      typeof payload.notes === 'string')
  );
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'DATABASE_NOT_CONFIGURED' },
        { status: 500 },
      );
    }

    const payload: unknown = await request.json();

    if (!isCreateOrderPayload(payload)) {
      return NextResponse.json(
        { error: 'INVALID_ORDER_PAYLOAD' },
        { status: 400 },
      );
    }

    const packageRecord = await prisma.package.findFirst({
      where: {
        OR: [{ id: payload.packageId }, { key: payload.packageId }],
        active: true,
      },
      select: {
        id: true,
      },
    });

    if (!packageRecord) {
      return NextResponse.json({ error: 'PACKAGE_NOT_FOUND' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName: payload.customerName.trim(),
        customerWhatsapp: payload.customerWhatsapp.trim(),
        occasion: payload.occasion.trim(),
        packageId: packageRecord.id,
        price: payload.price,
        notes: payload.notes ?? null,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('[PRISMA_ORDER_ERROR]', error);
    return NextResponse.json(
      {
        error: 'ORDER_CREATE_FAILED',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
