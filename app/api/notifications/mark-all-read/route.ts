// ==========================================
// API NOTIFICATIONS - app/api/notifications/mark-all-read/route.ts
// ==========================================
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST - Marquer toutes les notifications comme lues
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const result = await prisma.notification.updateMany({
      where: {
        userId: payload.userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });

    return NextResponse.json({ 
      message: "Toutes les notifications ont été marquées comme lues",
      count: result.count
    });
  } catch (error) {
    console.error("POST /api/notifications/mark-all-read error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}