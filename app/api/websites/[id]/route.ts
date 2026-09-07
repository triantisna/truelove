import { NextResponse } from 'next/server';

import { getWebsiteById, updateWebsite } from '@/lib/websites';

import { websiteInputSchema } from '@/lib/validation';

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
