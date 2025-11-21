//app/(auth)/signup/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import * as z from "zod";
import StepSelector from "@/components/RegisterComponent/StepSelector";
import ProfileSelector from "@/components/RegisterComponent/ProfileSelector";
import BasicInfoFields from "@/components/RegisterComponent/BasicInfoFields";
import AvatarUpload from "@/components/RegisterComponent/AvatarUpload";
import EtablissementFields from "@/components/RegisterComponent/EtablissementFields";
import EnseignantFields from "@/components/RegisterComponent/EnseignantFields";
import DonateurFields from "@/components/RegisterComponent/DonateurFields";
import { useRouter } from "next/navigation";
import { Rocket, AlertCircle, CheckCircle2, Loader2, X, Building2, GraduationCap, Heart, ArrowUp } from "lucide-react";

// ========== VALIDATION ZOD ==========

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
  adminType: z.string().min(1, "Type requis"),
  level: z.string().min(1, "Niveau requis"),
  studentCount: z.coerce.number().min(1, "Nombre d'élèves requis"),
  foundedYear: z.coerce.number().min(1900, "Année invalide"),
});

const enseignantFields = z.object({
  etablissementId: z.string().optional(),
  position: z.string().optional(),
  experience: z.string().optional(),
  degree: z.string().optional(),
  startYear: z.coerce.number().optional(),
  endYear: z.coerce.number().optional(),
  isCurrentTeacher: z.boolean().optional(),
}).refine((data) => {
  if (data.etablissementId && !data.startYear) {
    return false;
  }
  if (data.etablissementId && data.startYear && data.isCurrentTeacher === false && !data.endYear) {
    return false;
  }
  if (data.startYear && data.endYear && data.endYear < data.startYear) {
    return false;
  }
  return true;
}, {
  message: "Veuillez remplir correctement les informations de période d'enseignement",
  path: ["startYear"],
});

const donateurFields = z.object({
  donorType: z.string().min(1, "Type de donateur requis"),
  sector: z.string().min(1, "Secteur requis"),
});

const formSchema = z.discriminatedUnion("profileType", [
  z.object({ profileType: z.literal("etablissement") }).merge(baseFields).merge(etablissementFields),
  z.object({ profileType: z.literal("enseignant") }).merge(baseFields).merge(enseignantFields),
  z.object({ profileType: z.literal("donateur") }).merge(baseFields).merge(donateurFields),
]);

// ========== COMPOSANT MODAL ==========

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  profileType?: string;
}

const SuccessModal = ({ isOpen, onClose, type, title, message, profileType }: ModalProps) => {
  if (!isOpen) return null;

  const getProfileIcon = () => {
    switch (profileType) {
      case "etablissement":
        return <Building2 className="w-16 h-16 text-blue-500" />;
      case "enseignant":
        return <GraduationCap className="w-16 h-16 text-purple-500" />;
      case "donateur":
        return <Heart className="w-16 h-16 text-pink-500" />;
      default:
        return <CheckCircle2 className="w-16 h-16 text-green-500" />;
    }
  };

  const getProfileLabel = () => {
    switch (profileType) {
      case "etablissement":
        return "Compte Établissement";
      case "enseignant":
        return "Compte Enseignant";
      case "donateur":
        return "Compte Donateur";
      default:
        return "Nouveau Compte";
    }
  };

  const getProfileColor = () => {
    switch (profileType) {
      case "etablissement":
        return "from-blue-500 to-cyan-500";
      case "enseignant":
        return "from-purple-500 to-indigo-500";
      case "donateur":
        return "from-pink-500 to-rose-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${getProfileColor()} rounded-full blur-xl opacity-50 animate-pulse`} />
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                {type === "success" ? getProfileIcon() : <AlertCircle className="w-16 h-16 text-red-500" />}
              </div>
            </div>
          </div>

          {profileType && type === "success" && (
            <div className="mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getProfileColor()} shadow-lg`}>
                <CheckCircle2 className="w-4 h-4" />
                {getProfileLabel()}
              </span>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            {title}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {message}
          </p>

          {profileType === "enseignant" && type === "success" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left text-sm text-amber-800">
                  <p className="font-semibold mb-1">Validation requise</p>
                  <p>Votre établissement doit valider votre compte avant que vous puissiez accéder à toutes les fonctionnalités.</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              type === "success"
                ? `bg-gradient-to-r ${getProfileColor()} hover:shadow-xl`
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            }`}
          >
            {type === "success" ? "Continuer" : "Réessayer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MODAL D'ERREURS DE VALIDATION ==========

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: { field: string; message: string }[];
  onScrollToField: (field: string) => void;
}

const ErrorValidationModal = ({ isOpen, onClose, errors, onScrollToField }: ErrorModalProps) => {
  if (!isOpen) return null;

  const fieldLabels: Record<string, string> = {
    email: "Adresse email",
    country: "Pays",
    password: "Mot de passe",
    confirmPassword: "Confirmation mot de passe",
    fullName: "Nom complet",
    phone: "Numéro de téléphone",
    adminType: "Type administratif",
    level: "Niveau d'enseignement",
    studentCount: "Nombre d'élèves",
    foundedYear: "Année de création",
    donorType: "Type de donateur",
    sector: "Secteur d'activité",
    etablissementId: "Établissement",
    startYear: "Année de début",
    endYear: "Année de fin",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div>
          {/* Header */}
          <div className="mb-6 flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Informations manquantes
              </h2>
              <p className="text-gray-600 text-sm">
                Veuillez corriger les {errors.length} erreur{errors.length > 1 ? 's' : ''} suivante{errors.length > 1 ? 's' : ''} :
              </p>
            </div>
          </div>

          {/* Liste des erreurs */}
          <div className="space-y-3 mb-6">
            {errors.map((error, index) => (
              <button
                key={index}
                onClick={() => {
                  onScrollToField(error.field);
                  onClose();
                }}
                className="w-full text-left p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                      {fieldLabels[error.field] || error.field}
                      <ArrowUp className="w-4 h-4 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-sm text-red-700">{error.message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            Compris, je corrige
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT PRINCIPAL ==========

export default function RegisterPage() {
  const [profileType, setProfileType] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    profileType?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
  
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

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

  // Fonction pour scroller vers un champ avec erreur
  const scrollToField = (fieldName: string) => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus sur le champ
      setTimeout(() => {
        (element as HTMLElement).focus();
      }, 500);
    }
  };

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
      if (data.etablissementId) {
        payload.etablissementId = data.etablissementId;
        
        if (data.startYear) {
          payload.scolarityHistory = {
            startYear: data.startYear,
            endYear: data.isCurrentTeacher ? null : data.endYear,
            isCurrentTeacher: data.isCurrentTeacher ?? true,
          };
        }
      }
      
      payload.enseignant = {
        position: data.position || "",
        experience: data.experience || "",
        degree: data.degree || "",
      };
    }
    
    if (data.profileType === "donateur") {
      payload.donateur = {
        donorType: data.donorType,
        sector: data.sector,
      };
    }

    try {
      setRegistering(true);
      console.log("📤 Payload envoyé:", payload);
      
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
      console.log("✅ Résultat:", result);
      
      if (data.profileType === "enseignant") {
        if (data.etablissementId) {
          showSuccessModal(
            "Compte créé avec succès !",
            "Vous recevrez une notification une fois votre compte validé par votre établissement.",
            data.profileType
          );
        } else {
          showSuccessModal(
            "Compte créé !",
            "Votre compte a été créé. Vous pourrez le lier à un établissement plus tard.",
            data.profileType
          );
        }
      } else {
        showSuccessModal(
          "Bienvenue !",
          "Votre compte a été créé avec succès. Redirection vers la page de connexion...",
          data.profileType
        );
      }
      
      setTimeout(() => {
        reset();
        setProfileType(null);
        setAvatarUrl(null);
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      showErrorModal("Erreur", err.message);
    } finally {
      setRegistering(false);
    }
  };

  const showSuccessModal = (title: string, message: string, profile?: string) => {
    setModalState({
      isOpen: true,
      type: "success",
      title,
      message,
      profileType: profile,
    });
  };

  const showErrorModal = (title: string, message: string) => {
    setModalState({
      isOpen: true,
      type: "error",
      title,
      message,
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Gérer les erreurs de validation
  const handleFormError = () => {
    if (!profileType) {
      showErrorModal("Attention", "Veuillez choisir un type de profil");
      return;
    }

    // Collecter toutes les erreurs
    const errorList: { field: string; message: string }[] = [];
    Object.entries(errors).forEach(([field, error]: [string, any]) => {
      if (error && error.message) {
        errorList.push({ field, message: error.message });
      }
    });

    if (errorList.length > 0) {
      setValidationErrors(errorList);
      setErrorModalOpen(true);
    }
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

          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit, handleFormError)}
            className="space-y-8"
          >
            <BasicInfoFields register={register} errors={errors} />

            {profileType === "etablissement" && (
              <EtablissementFields register={register} errors={errors} />
            )}
            {profileType === "enseignant" && (
              <EnseignantFields register={register} errors={errors} setValue={setValue} />
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

      {/* Modals */}
      <SuccessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        profileType={modalState.profileType}
      />

      <ErrorValidationModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        errors={validationErrors}
        onScrollToField={scrollToField}
      />
    </div>
  );
}