"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import * as z from "zod";
import StepSelector from "@/components/RegisterComponent/StepSelector";
import ProfileSelector from "@/components/RegisterComponent/ProfileSelector";
import BasicInfoFields from "@/components/RegisterComponent/BasicInfoFields";
import AvatarUpload from "@/components/RegisterComponent/AvatarUpload";
import EtablissementFields from "@/components/RegisterComponent/EtablissementFields";
import EnseignantFields from "@/components/RegisterComponent/EnseignantFields";
import DonateurFields from "@/components/RegisterComponent/DonateurFields";
import { useRouter } from "next/navigation";
import { Rocket, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const baseFields = z.object({
  email: z.string().email("Email invalide"),
  country: z.string().min(2, "Pays requis"),
  password: z.string().min(8, "Mot de passe trop court (min 8 caractères)"),
  confirmPassword: z.string().min(8, "Confirmation requise"),
  fullName: z.string().min(3, "Nom complet requis"),
  phone: z.string().min(10, "Téléphone invalide"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const etablissementFields = z.object({
  adminType: z.string(),
  level: z.string(),
  studentCount: z.coerce.number().min(1, "Nombre d'élèves requis"),
  foundedYear: z.coerce.number().min(1900, "Année invalide"),
});

const enseignantFields = z.object({
  etablissementId: z.string().min(1, "Veuillez sélectionner votre établissement"),
  position: z.string().optional(),
  experience: z.string().optional(),
  degree: z.string().optional(),
});

const donateurFields = z.object({
  donorType: z.string(),
  sector: z.string(),
});

const formSchema = z.discriminatedUnion("profileType", [
  z.object({ profileType: z.literal("etablissement") }).merge(baseFields).merge(etablissementFields),
  z.object({ profileType: z.literal("enseignant") }).merge(baseFields).merge(enseignantFields),
  z.object({ profileType: z.literal("donateur") }).merge(baseFields).merge(donateurFields),
]);

export default function RegisterPage() {
  const [profileType, setProfileType] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (profileType) {
      setValue("profileType", profileType);
    }
  }, [profileType, setValue]);

  const onSubmit = async (data: any) => {
    console.log("📦 Données soumises:", data);
    
    const payload: any = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      telephone: data.phone,
      type: data.profileType?.toUpperCase(),
      country: data.country,
      avatar: avatarUrl,
    };

    if (data.profileType === "etablissement") {
      payload.etablissement = {
        nom: data.fullName,
        type: data.adminType.toUpperCase(),
        niveau: data.level.toUpperCase(),
        adresse: "",
        anneeCreation: data.foundedYear,
        nbEleves: data.studentCount,
      };
    }
    
    if (data.profileType === "enseignant") {
      payload.etablissementId = data.etablissementId;
      payload.enseignant = {
        position: data.position || "",
        experience: data.experience || "",
        degree: data.degree || "",
        validated: false,
      };
      payload.needsValidation = true;
    }
    
    if (data.profileType === "donateur") {
      payload.donateur = {
        donorType: data.donorType,
        sector: data.sector,
      };
    }

    try {
      setRegistering(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erreur lors de la création du compte");
      }

      const result = await res.json();
      
      if (data.profileType === "enseignant") {
        // Modal de succès pour enseignant
        showSuccessModal(
          "Compte créé avec succès !",
          "Votre profil est en attente de validation par votre établissement. Vous recevrez une notification une fois validé."
        );
      } else {
        showSuccessModal(
          "Bienvenue !",
          "Votre compte a été créé avec succès. Redirection vers la page de connexion..."
        );
      }
      
      setTimeout(() => {
        reset();
        setProfileType(null);
        setAvatarUrl(null);
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      showErrorModal("Erreur", err.message);
    } finally {
      setRegistering(false);
    }
  };

  const showSuccessModal = (title: string, message: string) => {
    // Vous pouvez remplacer ceci par votre système de notification
    alert(`✅ ${title}\n\n${message}`);
  };

  const showErrorModal = (title: string, message: string) => {
    alert(`❌ ${title}\n\n${message}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-3">
            Rejoignez notre communauté
          </h1>
          <p className="text-gray-600 text-lg">
            Créez votre compte en quelques étapes simples
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <StepSelector current={profileType ? 1 : 0} />

          <ProfileSelector selected={profileType} onSelect={setProfileType} />

          {/* Alerte d'erreurs */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold">Veuillez corriger les erreurs suivantes :</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {Object.values(errors).map((error: any, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              if (!profileType) {
                showErrorModal("Attention", "Veuillez choisir un type de profil");
                e.preventDefault();
                return;
              }
              handleSubmit(onSubmit)(e);
            }}
            className="space-y-8"
          >
            <BasicInfoFields register={register} errors={errors} />

            {profileType === "etablissement" && (
              <EtablissementFields register={register} errors={errors} />
            )}
            {profileType === "enseignant" && (
              <EnseignantFields register={register} errors={errors} />
            )}
            {profileType === "donateur" && (
              <DonateurFields register={register} errors={errors} />
            )}

            <AvatarUpload onAvatarChange={setAvatarUrl} isPublic={true} />

            {/* Bouton de soumission */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={registering || !profileType}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] font-semibold text-lg flex items-center justify-center gap-3"
              >
                {registering ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6" />
                    Créer mon compte
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Vous avez déjà un compte ?{" "}
                <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                  Connectez-vous
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>En créant un compte, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  );
}