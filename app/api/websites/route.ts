import { NextResponse } from "next/server";
import { createWebsite, listWebsites } from "@/lib/websites";
import { websiteInputSchema } from "@/lib/validation";

export async function GET() {
  const websites = await listWebsites();
  return NextResponse.json({ websites });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = websiteInputSchema.parse(payload);
    const website = await createWebsite(input);
    return NextResponse.json({ website }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";

    if (message === "DATABASE_NOT_CONFIGURED") {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    if (message === "TEMPLATE_NOT_SEEDED" || message === "PACKAGE_NOT_SEEDED") {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (message.includes("Unique constraint")) {
      return NextResponse.json({ error: "SLUG_ALREADY_EXISTS" }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
