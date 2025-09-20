// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Supprimer le cookie de session
    cookieStore.delete("token");
    
    // Optionnel : créer une réponse avec un cookie expiré pour être sûr
    const response = NextResponse.json({ 
      message: "Déconnexion réussie" 
    }, { status: 200 });

    // Forcer l'expiration du cookie côté client
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Date passée pour expirer le cookie
      path: "/",
    });

    return response;
    
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" }, 
      { status: 500 }
    );
  }
}