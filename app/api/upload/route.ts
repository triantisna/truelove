import { NextResponse } from 'next/server';

import { uploadToCloudinary } from '@/lib/upload';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get('file');

    const fieldKey = formData.get('fieldKey');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'FILE_REQUIRED',
        },
        {
          status: 400,
        },
      );
    }

    if (typeof fieldKey !== 'string' || !fieldKey) {
      return NextResponse.json(
        {
          error: 'FIELD_KEY_REQUIRED',
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'UNSUPPORTED_FILE_TYPE',
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'FILE_TOO_LARGE',
        },
        {
          status: 400,
        },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToCloudinary(buffer, {
      folder: `truelove/${fieldKey}`,
      resourceType: 'image',
    });

    return NextResponse.json(
      {
        success: true,
        file: {
          url: result.url,
          publicId: result.publicId,
          resourceType: result.resourceType,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    const message = error instanceof Error ? error.message : 'UPLOAD_FAILED';

    if (message === 'CLOUDINARY_NOT_CONFIGURED') {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 503,
        },
      );
    }

    return NextResponse.json(
      {
        error: 'UPLOAD_FAILED',
      },
      {
        status: 500,
      },
    );
  }
}
