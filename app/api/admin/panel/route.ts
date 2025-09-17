import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";

export async function GET() {
  const gate = await requirePermission("admin:panel");
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: gate.status });

  // ... stats globales sensibles
  return NextResponse.json({ data: "..." });
}
