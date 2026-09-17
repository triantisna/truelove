import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'DATABASE_NOT_CONFIGURED' },
        { status: 503 },
      );
    }

    const music = await prisma.music.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(music);
  } catch (error) {
    console.error('[MUSIC_LIST_ERROR]', error);
    return NextResponse.json({ error: 'MUSIC_LIST_FAILED' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'DATABASE_NOT_CONFIGURED' },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const title = formData.get('title');
    const file = formData.get('file');

    if (typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'TITLE_REQUIRED' }, { status: 400 });
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: 'AUDIO_FILE_REQUIRED' },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cloudinaryResult = await uploadToCloudinary(buffer, {
      folder: 'truelove/music',
      resourceType: 'auto',
    });

    const music = await prisma.music.create({
      data: {
        title: title.trim(),
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
      },
    });

    return NextResponse.json(music, { status: 201 });
  } catch (error) {
    console.error('[MUSIC_CREATE_ERROR]', error);
    return NextResponse.json({ error: 'MUSIC_CREATE_FAILED' }, { status: 500 });
  }
}
