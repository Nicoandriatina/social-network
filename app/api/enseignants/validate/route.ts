import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";

export async function POST(req: Request) {
  const gate = await requirePermission("enseignant:validate");
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: gate.status });

  // ... logique de validation
  return NextResponse.json({ ok: true });
}
