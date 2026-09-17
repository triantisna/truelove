import { NextResponse } from 'next/server';

import type { OrderStatus, PaymentStatus } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

type OrderStatusUpdate = {
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
};

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return (
    value === 'UNPAID' ||
    value === 'PARTIAL' ||
    value === 'PAID' ||
    value === 'REFUNDED'
  );
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    value === 'NEW' ||
    value === 'WAITING_PAYMENT' ||
    value === 'PAID' ||
    value === 'PROCESSING' ||
    value === 'REVISION' ||
    value === 'COMPLETED' ||
    value === 'CANCELLED'
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!prisma) {
      throw new Error('DATABASE_NOT_CONFIGURED');
    }

    const { id } = await params;
    const payload: unknown = await request.json();
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('INVALID_ORDER_PAYLOAD');
    }

    const input = payload as Record<string, unknown>;
    const data: OrderStatusUpdate = {};

    if (input.paymentStatus !== undefined) {
      if (!isPaymentStatus(input.paymentStatus)) {
        throw new Error('INVALID_PAYMENT_STATUS');
      }
      data.paymentStatus = input.paymentStatus;
    }

    if (input.orderStatus !== undefined) {
      if (!isOrderStatus(input.orderStatus)) {
        throw new Error('INVALID_ORDER_STATUS');
      }
      data.orderStatus = input.orderStatus;
    }

    const order = await prisma.order.update({
      where: { id },
      data,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[PRISMA_ORDER_UPDATE_ERROR]', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'ORDER_UPDATE_FAILED',
      },
      { status: 500 },
    );
  }
}