// import { NextResponse } from "next/server";
// import { requirePermission } from "@/lib/auth";

// export async function POST(req: Request) {
//   const gate = await requirePermission("projet:create");
//   if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: gate.status });

//   // ... créer le projet pour l’établissement du user gate.auth.id si besoin
//   return NextResponse.json({ ok: true });
// }

// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

// Schéma de validation pour la création de projet
const createProjectSchema = z.object({
  reference: z.string().min(1, "La référence est obligatoire"),
  category: z.enum(["CONSTRUCTION", "REHABILITATION", "AUTRES"], {
    required_error: "La catégorie est obligatoire"
  }),
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().optional(),
  photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
}).refine((data) => {
  // Validation des dates
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["endDate"]
});

// GET - Récupérer les projets
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // Récupérer les projets avec leurs relations
    const projects = await prisma.project.findMany({
      include: {
        auteur: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            etablissement: {
              select: {
                nom: true,
                type: true,
                niveau: true
              }
            }
          }
        },
        etablissement: {
          select: {
            nom: true,
            type: true,
            niveau: true,
            adresse: true
          }
        },
        dons: {
          select: {
            id: true,
            type: true,
            statut: true
          }
        },
        _count: {
          select: {
            dons: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Créer un nouveau projet
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    // Vérifier que l'utilisateur est de type ETABLISSEMENT
    if (payload.type !== "ETABLISSEMENT") {
      return NextResponse.json({ 
        error: "Seuls les profils ÉTABLISSEMENT peuvent publier des projets" 
      }, { status: 403 });
    }

    // Récupérer l'utilisateur pour vérifier son établissement
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        etablissement: true
      }
    });

    if (!user || !user.etablissement) {
      return NextResponse.json({ 
        error: "Aucun établissement associé à votre profil" 
      }, { status: 400 });
    }

    const body = await req.json();
    
    // Validation des données
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const data = validation.data;

    // Vérifier l'unicité de la référence
    const existingProject = await prisma.project.findUnique({
      where: { reference: data.reference }
    });

    if (existingProject) {
      return NextResponse.json({ 
        error: "Cette référence existe déjà" 
      }, { status: 400 });
    }

    // Créer le projet
    const project = await prisma.project.create({
      data: {
        reference: data.reference,
        titre: data.title,
        description: data.description,
        photos: data.photos,
        categorie: data.category as any,
        datePublication: new Date(),
        dateDebut: data.startDate ? new Date(data.startDate) : null,
        dateFin: data.endDate ? new Date(data.endDate) : null,
        auteurId: user.id,
        etablissementId: user.etablissement.id
      },
      include: {
        auteur: {
          select: {
            fullName: true,
            avatar: true
          }
        },
        etablissement: {
          select: {
            nom: true,
            type: true,
            niveau: true
          }
        }
      }
    });

    return NextResponse.json({ 
      message: "Projet créé avec succès",
      project 
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}