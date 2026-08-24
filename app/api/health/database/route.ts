import { NextResponse } from "next/server";
import { databaseDiagnostics } from "@/lib/db-health";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics = await databaseDiagnostics();
  return NextResponse.json(diagnostics, {
    status: diagnostics.configured && !diagnostics.connected ? 503 : 200
  });
}
