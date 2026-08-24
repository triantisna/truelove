import { NextResponse } from "next/server";
import { integrationsReady } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "truelove-platform",
    phase: 2,
    mode: integrationsReady.prisma ? "database" : "mock",
    integrations: integrationsReady,
    timestamp: new Date().toISOString()
  });
}
