import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!prisma) return NextResponse.json({ error: "DATABASE_NOT_CONFIGURED" }, { status: 503 });

  const { id } = await params;
  const website = await prisma.website.findUnique({
    where: { id },
    include: { template: true, package: true, media: { orderBy: { sortOrder: "asc" } } }
  });

  if (!website) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ website });
}
