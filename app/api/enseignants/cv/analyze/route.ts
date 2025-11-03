
// app/api/enseignants/cv/analyze/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!);

interface CVAnalysis {
  experiences: Array<{
    poste: string;
    etablissement: string;
    debut: string;
    fin?: string;
    enCours: boolean;
    description: string;
  }>;
  formations: Array<{
    diplome: string;
    etablissement: string;
    annee: string;
    description?: string;
  }>;
  certifications: Array<{
    titre: string;
    organisme: string;
    date: string;
    lien?: string;
  }>;
}

export async function POST(req: Request) {
  try {
    console.log("🚀 Début analyse CV avec Gemini");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
    };

    console.log(`👤 Utilisateur: ${payload.userId}, Type: ${payload.type}`);

    if (payload.type !== "ENSEIGNANT") {
      return NextResponse.json(
        { error: "Cette fonctionnalité est réservée aux enseignants." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("cv") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    console.log(`📄 Fichier reçu: ${file.name} (${file.size} bytes, ${file.type})`);

    // Accepter uniquement les PDF pour cette méthode
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Pour l'instant, seuls les fichiers PDF sont supportés." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Taille max : 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Créer le dossier si nécessaire
    const uploadDir = join(process.cwd(), "public", "uploads", "cvs");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const filename = `cv_${payload.userId}_${timestamp}.pdf`;
    const filepath = join(uploadDir, filename);
    
    // Sauvegarder le fichier localement
    await writeFile(filepath, buffer);
    console.log(`💾 Fichier sauvegardé: ${filename}`);

    console.log(`🤖 Upload du PDF vers Gemini...`);

    let analysis: CVAnalysis;
    
    try {
      // Upload du fichier vers Gemini
      const uploadResult = await fileManager.uploadFile(filepath, {
        mimeType: "application/pdf",
        displayName: filename,
      });

      console.log(`📤 Fichier uploadé sur Gemini: ${uploadResult.file.uri}`);

      // Utiliser Gemini 1.5 Flash avec le fichier
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Tu es un expert en analyse de CV pour le système éducatif malgache.
Analyse ce CV PDF et extrait UNIQUEMENT les informations présentes au format JSON strict:

{
  "experiences": [
    {
      "poste": "titre exact du poste",
      "etablissement": "nom exact de l'établissement",
      "debut": "YYYY-MM (format obligatoire, estime si nécessaire)",
      "fin": "YYYY-MM ou null si poste actuel",
      "enCours": true si poste actuel, false sinon,
      "description": "résumé des responsabilités en 150 caractères max"
    }
  ],
  "formations": [
    {
      "diplome": "nom exact du diplôme",
      "etablissement": "nom exact de l'établissement",
      "annee": "YYYY (année d'obtention)",
      "description": "mention ou spécialisation si mentionnée"
    }
  ],
  "certifications": [
    {
      "titre": "nom exact de la certification",
      "organisme": "organisme délivrant",
      "date": "YYYY-MM (estime si nécessaire)",
      "lien": "URL si présente dans le CV"
    }
  ]
}

RÈGLES IMPORTANTES:
- Retourne UNIQUEMENT le JSON, sans aucun texte avant ou après
- N'invente AUCUNE information
- Si une date est floue, estime raisonnablement (ex: "2020" → "2020-01")
- Trie par ordre chronologique décroissant (plus récent en premier)
- Description max 150 caractères
- Si aucune information d'un type, retourne tableau vide []`;

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResult.file.mimeType,
            fileUri: uploadResult.file.uri
          }
        },
        { text: prompt }
      ]);

      const response = await result.response;
      let text = response.text();
      
      console.log("📥 Réponse Gemini reçue");
      
      // Nettoyer la réponse
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }
      
      analysis = JSON.parse(text);
      console.log("✅ JSON parsé avec succès");

      // Supprimer le fichier de Gemini après analyse
      try {
        await fileManager.deleteFile(uploadResult.file.name);
        console.log("🗑️ Fichier supprimé de Gemini");
      } catch (deleteError) {
        console.log("⚠️ Impossible de supprimer le fichier de Gemini:", deleteError);
      }

    } catch (aiError: any) {
      console.error("❌ Erreur Gemini:", aiError);
      
      if (aiError.message?.includes('API_KEY')) {
        return NextResponse.json(
          { error: "Clé API Google non configurée. Contactez l'administrateur." },
          { status: 500 }
        );
      }
      
      if (aiError.message?.includes('quota')) {
        return NextResponse.json(
          { error: "Limite quotidienne atteinte. Réessayez demain." },
          { status: 429 }
        );
      }
      
      if (aiError.message?.includes('not found')) {
        return NextResponse.json(
          { error: "Modèle IA non disponible. Contactez l'administrateur." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Erreur lors de l'analyse du CV: ${aiError.message}` },
        { status: 500 }
      );
    }

    const validatedAnalysis: CVAnalysis = {
      experiences: (analysis.experiences || [])
        .filter(exp => exp.poste && exp.etablissement && exp.debut)
        .map(exp => ({
          poste: exp.poste.trim().slice(0, 200),
          etablissement: exp.etablissement.trim().slice(0, 200),
          debut: exp.debut.trim(),
          fin: exp.fin ? exp.fin.trim() : undefined,
          enCours: Boolean(exp.enCours),
          description: (exp.description || "").trim().slice(0, 500)
        }))
        .slice(0, 20),
      
      formations: (analysis.formations || [])
        .filter(form => form.diplome && form.etablissement && form.annee)
        .map(form => ({
          diplome: form.diplome.trim().slice(0, 200),
          etablissement: form.etablissement.trim().slice(0, 200),
          annee: form.annee.toString().trim(),
          description: form.description?.trim().slice(0, 500)
        }))
        .slice(0, 15),
      
      certifications: (analysis.certifications || [])
        .filter(cert => cert.titre && cert.organisme && cert.date)
        .map(cert => ({
          titre: cert.titre.trim().slice(0, 200),
          organisme: cert.organisme.trim().slice(0, 200),
          date: cert.date.trim(),
          lien: cert.lien?.trim().slice(0, 500)
        }))
        .slice(0, 20)
    };

    const totalItems = 
      validatedAnalysis.experiences.length +
      validatedAnalysis.formations.length +
      validatedAnalysis.certifications.length;

    console.log(`📊 Résultat: ${totalItems} éléments extraits`);
    console.log(`   - Expériences: ${validatedAnalysis.experiences.length}`);
    console.log(`   - Formations: ${validatedAnalysis.formations.length}`);
    console.log(`   - Certifications: ${validatedAnalysis.certifications.length}`);

    if (totalItems === 0) {
      return NextResponse.json(
        { 
          error: "Aucune information exploitable trouvée dans le CV.",
          suggestion: "Assurez-vous que votre CV contient des sections claires (Expérience, Formation, etc.)"
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `✅ CV analysé avec succès ! ${totalItems} éléments détectés.`,
      data: validatedAnalysis,
      stats: {
        experiences: validatedAnalysis.experiences.length,
        formations: validatedAnalysis.formations.length,
        certifications: validatedAnalysis.certifications.length
      },
      filename
    });

  } catch (error: any) {
    console.error("❌ Erreur globale:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Session invalide. Veuillez vous reconnecter." },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({
        configured: false,
        error: "Google API Key non configurée"
      }, { status: 500 });
    }

    return NextResponse.json({
      configured: true,
      service: "Google Gemini 1.5 Flash with File API",
      status: "operational"
    });

  } catch (error) {
    console.error("GET status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}