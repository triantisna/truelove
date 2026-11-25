import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database belum terkonfigurasi' },
        { status: 503 },
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: 'Website ID wajib diisi' },
        { status: 400 },
      );
    }

    const body = (await req.json()) as unknown;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Payload harus berupa objek JSON' },
        { status: 400 },
      );
    }

    const existing = await prisma.website.findUnique({
      where: { id },
      select: { id: true, status: true, receiverResponse: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Website tidak ditemukan' },
        { status: 404 },
      );
    }

    // Tolak jika masih draft / preview / live demo
    if (existing.status !== 'PUBLISHED') {
      return NextResponse.json(
        { ok: false, skipped: true, reason: 'Website belum published' },
        { status: 200 },
      );
    }

    const currentResponse =
      existing.receiverResponse &&
      typeof existing.receiverResponse === 'object' &&
      !Array.isArray(existing.receiverResponse)
        ? (existing.receiverResponse as Record<string, unknown>)
        : {};

    const mergedResponse = {
      ...currentResponse,
      ...(body as Record<string, unknown>),
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.website.update({
      where: { id },
      data: { receiverResponse: mergedResponse },
      select: { id: true, receiverResponse: true },
    });

    return NextResponse.json({
      ok: true,
      receiverResponse: updated.receiverResponse,
    });
  } catch (error) {
    console.error('[POST /api/websites/[id]/response] Error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan respons' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database belum terkonfigurasi' },
        { status: 503 },
      );
    }

    const { id } = await context.params;

    await prisma.website.update({
      where: { id },
      data: { receiverResponse: Prisma.DbNull },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/websites/[id]/response] Error:', error);
    return NextResponse.json(
      { error: 'Gagal mereset respons' },
      { status: 500 },
    );
  }
}
