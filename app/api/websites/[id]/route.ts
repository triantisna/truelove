import { NextResponse } from 'next/server';
import { getWebsiteById, updateWebsite, deleteWebsite } from '@/lib/websites';
import { websiteInputSchema } from '@/lib/validation';
import { cloudinary, cloudinaryReady } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const website = await getWebsiteById(id);

    if (!website) {
      return NextResponse.json(
        {
          error: 'WEBSITE_NOT_FOUND',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      website,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';

    if (message === 'DATABASE_NOT_CONFIGURED') {
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
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const input = websiteInputSchema.parse(payload);
    const website = await updateWebsite(id, input);

    if (website && website.slug) {
      revalidatePath(`/${website.slug}`);
    }

    return NextResponse.json({
      website,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';

    if (message === 'DATABASE_NOT_CONFIGURED') {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 503,
        },
      );
    }

    if (message === 'WEBSITE_NOT_FOUND') {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 404,
        },
      );
    }

    if (message === 'TEMPLATE_NOT_SEEDED' || message === 'PACKAGE_NOT_SEEDED') {
      return NextResponse.json(
        {
          error: message,
        },
        {
          status: 409,
        },
      );
    }

    if (message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'SLUG_ALREADY_EXISTS',
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    // 1. Dapatkan data website (termasuk media) sebelum dihapus
    const website = await getWebsiteById(id);

    if (!website) {
      return NextResponse.json({ error: 'WEBSITE_NOT_FOUND' }, { status: 404 });
    }

    // 2. Bersihkan file fisik di Cloudinary (HANYA media, bukan musik)
    if (cloudinaryReady() && website.media && website.media.length > 0) {
      // Kita pakai Promise.all biar ngehapusnya jalan paralel (lebih cepat)
      const deletePromises = website.media.map(async (mediaItem) => {
        if (mediaItem.publicId) {
          try {
            await cloudinary.uploader.destroy(mediaItem.publicId);
          } catch (err) {
            console.error(
              `Failed to delete Cloudinary file: ${mediaItem.publicId}`,
              err,
            );
          }
        }
      });
      await Promise.all(deletePromises);
    }

    // 3. Hapus data secara permanen dari Database
    await deleteWebsite(id);

    return NextResponse.json({
      success: true,
      message: 'Website and media deleted successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
