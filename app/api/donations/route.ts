// app/api/donations/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

// Schéma de validation pour créer un don
const createDonationSchema = z.object({
  libelle: z.string().min(1, "Le libellé est obligatoire"),
  type: z.enum(["MONETAIRE", "VIVRES", "NON_VIVRES"], {
    required_error: "Le type de don est obligatoire"
  }),
  quantite: z.number().optional(),
  photos: z.array(z.string()).optional(),
  // Destination du don (un seul requis)
  projectId: z.string().optional(),
  etablissementId: z.string().optional(),
  personnelId: z.string().optional(),
}).refine((data) => {
  // Au moins une destination doit être spécifiée
  const destinations = [data.projectId, data.etablissementId, data.personnelId].filter(Boolean);
  return destinations.length === 1;
}, {
  message: "Vous devez spécifier exactement une destination pour le don",
  path: ["destination"]
});

// POST - Créer un nouveau don
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

    // Vérifier que l'utilisateur est de type DONATEUR
    if (payload.type !== "DONATEUR") {
      return NextResponse.json({ 
        error: "Seuls les donateurs peuvent faire des dons" 
      }, { status: 403 });
    }

    const body = await req.json();
    
    // Validation des données
    const validation = createDonationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Données invalides",
        details: validation.error.flatten()
      }, { status: 400 });
    }

    const data = validation.data;

    // Créer le don
    const don = await prisma.don.create({
      data: {
        libelle: data.libelle,
        type: data.type,
        quantite: data.quantite || null,
        photos: data.photos || [],
        statut: 'EN_ATTENTE',
        donateurId: payload.userId,
        // Définir la destination
        projectId: data.projectId || null,
        etablissementId: data.etablissementId || null,
        personnelId: data.personnelId || null,
      },
      include: {
        project: {
          select: {
            titre: true,
            etablissement: {
              select: { nom: true }
            }
          }
        },
        beneficiaireEtab: {
          select: { nom: true }
        },
        beneficiairePersonnel: {
          select: { fullName: true }
        }
      }
    });

    return NextResponse.json({ 
      message: "Don créé avec succès",
      donation: don 
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/donations error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Récupérer les dons de l'utilisateur connecté
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

    const donations = await prisma.don.findMany({
      where: { donateurId: payload.userId },
      include: {
        project: {
          select: {
            titre: true,
            etablissement: {
              select: { nom: true }
            }
          }
        },
        beneficiaireEtab: {
          select: { nom: true }
        },
        beneficiairePersonnel: {
          select: { fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformedDonations = donations.map(don => ({
      id: don.id,
      libelle: don.libelle,
      type: don.type,
      quantite: don.quantite,
      statut: don.statut,
      photos: don.photos,
      createdAt: don.createdAt.toISOString(),
      dateEnvoi: don.dateEnvoi?.toISOString(),
      dateReception: don.dateReception?.toISOString(),
      destination: {
        type: don.projectId ? 'project' : don.etablissementId ? 'etablissement' : 'personnel',
        name: don.project?.titre || don.beneficiaireEtab?.nom || don.beneficiairePersonnel?.fullName,
        etablissement: don.project?.etablissement?.nom
      }
    }));

    return NextResponse.json({ donations: transformedDonations });

  } catch (error) {
    console.error("GET /api/donations error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}