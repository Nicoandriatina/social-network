// app/api/enseignant/cv/confirm/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

// ================================================================
// POST - Confirmer et sauvegarder les données du CV analysé
// ================================================================
export async function POST(req: Request) {
  try {
    console.log("💾 Début de la sauvegarde des données CV");

    // 1. Authentification
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
    };

    if (payload.type !== "ENSEIGNANT") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    console.log(`👤 Sauvegarde pour utilisateur: ${payload.userId}`);

    // 2. Récupérer les données validées
    const body = await req.json();
    const { 
      experiences = [], 
      formations = [], 
      certifications = [],
      replaceExisting = false // Option pour remplacer ou ajouter
    } = body;

    console.log(`📊 Données reçues:`, {
      experiences: experiences.length,
      formations: formations.length,
      certifications: certifications.length,
      replaceExisting
    });

    // 3. Sauvegarder dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Optionnel: Supprimer les données existantes
      if (replaceExisting) {
        console.log("🗑️ Suppression des données existantes...");
        await tx.experience.deleteMany({
          where: { enseignantId: payload.userId }
        });
        await tx.formation.deleteMany({
          where: { enseignantId: payload.userId }
        });
        await tx.certification.deleteMany({
          where: { enseignantId: payload.userId }
        });
      }

      // Créer les expériences
      console.log(`➕ Création de ${experiences.length} expériences...`);
      const createdExperiences = await Promise.all(
        experiences.map((exp: any) =>
          tx.experience.create({
            data: {
              enseignantId: payload.userId,
              poste: exp.poste,
              etablissement: exp.etablissement,
              debut: new Date(exp.debut + "-01"),
              fin: exp.fin ? new Date(exp.fin + "-01") : null,
              enCours: exp.enCours || false,
              description: exp.description || ""
            }
          })
        )
      );

      // Créer les formations
      console.log(`➕ Création de ${formations.length} formations...`);
      const createdFormations = await Promise.all(
        formations.map((form: any) =>
          tx.formation.create({
            data: {
              enseignantId: payload.userId,
              diplome: form.diplome,
              etablissement: form.etablissement,
              annee: form.annee,
              description: form.description || null
            }
          })
        )
      );

      // Créer les certifications
      console.log(`➕ Création de ${certifications.length} certifications...`);
      const createdCertifications = await Promise.all(
        certifications.map((cert: any) =>
          tx.certification.create({
            data: {
              enseignantId: payload.userId,
              titre: cert.titre,
              organisme: cert.organisme,
              date: new Date(cert.date + "-01"),
              lien: cert.lien || null
            }
          })
        )
      );

      return {
        experiences: createdExperiences,
        formations: createdFormations,
        certifications: createdCertifications
      };
    });

    console.log(`✅ Sauvegarde réussie:`, {
      experiences: result.experiences.length,
      formations: result.formations.length,
      certifications: result.certifications.length
    });

    return NextResponse.json({
      success: true,
      message: "✅ Profil mis à jour avec succès !",
      data: result,
      stats: {
        experiences: result.experiences.length,
        formations: result.formations.length,
        certifications: result.certifications.length,
        total: result.experiences.length + result.formations.length + result.certifications.length
      }
    });

  } catch (error: any) {
    console.error("❌ Erreur confirmation CV:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Session invalide" },
        { status: 401 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Cette entrée existe déjà" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde des données" },
      { status: 500 }
    );
  }
}