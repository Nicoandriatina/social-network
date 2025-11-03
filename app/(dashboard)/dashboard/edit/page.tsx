// "use client";

// import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
// import { useForm } from "react-hook-form";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { AvatarDisplay } from "@/components/AvatarDisplay";

// type FormValues = any;

// export default function EditProfilePage() {
//   const { user, loading } = useCurrentUser();
//   const [saving, setSaving] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { register, handleSubmit, reset, setValue } = useForm<FormValues>({ 
//     values: toFormDefaults(user) 
//   });

//   useEffect(() => {
//     if (user?.avatar) {
//       setAvatarPreview(user.avatar);
//       setAvatarUrl(user.avatar);
//     }
//   }, [user]);

//   if (loading) return <div className="p-10 text-center">Chargement…</div>;
//   if (!user) return <div className="p-10 text-red-500 text-center">Non autorisé</div>;

//   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validation
//     if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
//       setErrorMessage("Type de fichier non autorisé. JPG, PNG, GIF ou WebP uniquement.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setErrorMessage("Fichier trop volumineux. Maximum 5MB.");
//       return;
//     }

//     // Aperçu local
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setAvatarPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     // Upload
//     try {
//       setUploading(true);
//       setErrorMessage(null);

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch("/api/upload/avatar", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors de l'upload");
//       }

//       const data = await response.json();
//       setAvatarUrl(data.avatarUrl);
//       setValue("avatar", data.avatarUrl);
      
//       console.log("Avatar uploadé:", data.avatarUrl);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
//       setErrorMessage(errorMessage);
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const onSubmit = async (values: FormValues) => {
//     console.log(" Données à soumettre:", values);
    
//     setSaving(true);
//     setErrorMessage(null);
    
//     try {
//       // Ajouter l'avatar URL si elle a été modifiée
//       if (avatarUrl && avatarUrl !== user.avatar) {
//         values.avatar = avatarUrl;
//       }

//       const payload = sanitizeForType(user.typeProfil, values);
//       console.log("Payload envoyé:", payload);

//       const res = await fetch("/api/user/me", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Échec de la mise à jour");
//       }

//       const data = await res.json();
//       reset(toFormDefaults(data.user));
      
//       setSuccessMessage("Profil mis à jour avec succès !");
      
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 2000);
//     } catch (e: any) {
//       setErrorMessage(e.message || "Erreur lors de la mise à jour");
//       console.error("Erreur:", e);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
//       <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
//         Modifier mon profil
//       </h1>

//       {/* Messages */}
//       {successMessage && (
//         <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
//           {successMessage}
//         </div>
//       )}
      
//       {errorMessage && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//           ⚠️ {errorMessage}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {/* Section Avatar */}
//         <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">Photo de profil</h2>
//           <div className="flex items-center gap-6">
//             <div className="flex-shrink-0">
//               {avatarPreview ? (
//                 <img
//                   src={avatarPreview}
//                   alt="Avatar"
//                   className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
//                 />
//               ) : (
//                 <AvatarDisplay name={user.nom} size="xl" />
//               )}
//             </div>
//             <div className="flex-1">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 accept="image/*"
//                 onChange={handleAvatarUpload}
//                 className="hidden"
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 disabled={uploading}
//                 className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg shadow cursor-pointer transition"
//               >
//                 {uploading ? "⏳ Upload en cours..." : "📷 Changer la photo"}
//               </button>
//               <p className="mt-2 text-sm text-gray-600">
//                 JPG, PNG, GIF ou WebP. Max 5MB.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Informations de base */}
//         <div className="bg-gray-50 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations personnelles</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Nom complet *
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 {...register("fullName")}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Téléphone
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 {...register("telephone")}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email (non modifiable)
//               </label>
//               <input
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
//                 value={user.email}
//                 disabled
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Profession
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 {...register("profession")}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Réseaux sociaux */}
//         <div className="bg-gray-50 rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">Réseaux sociaux</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Facebook
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="https://facebook.com/..."
//                 {...register("facebook")}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Twitter
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="@username"
//                 {...register("twitter")}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 WhatsApp
//               </label>
//               <input
//                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="+261 xx xxx xx xx"
//                 {...register("whatsapp")}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Spécifique ÉTABLISSEMENT */}
//         {user.typeProfil === "ETABLISSEMENT" && (
//           <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
//             <h2 className="text-xl font-semibold mb-4 text-blue-900">
//               Informations de l'établissement
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nom de l'établissement *
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   {...register("etablissement.nom")}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type *
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   {...register("etablissement.type")}
//                 >
//                   <option value="">Sélectionner...</option>
//                   <option value="PUBLIC">Public</option>
//                   <option value="PRIVE">Privé</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Niveau *
//                 </label>
//                 <select
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   {...register("etablissement.niveau")}
//                 >
//                   <option value="">Sélectionner...</option>
//                   <option value="EPP">EPP (École Primaire)</option>
//                   <option value="CEG">CEG (Collège)</option>
//                   <option value="LYCEE">Lycée</option>
//                   <option value="COLLEGE">Collège</option>
//                   <option value="UNIVERSITE">Université</option>
//                   <option value="ORGANISME">Organisme</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Adresse
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Adresse complète"
//                   {...register("etablissement.adresse")}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Spécifique ENSEIGNANT */}
//         {user.typeProfil === "ENSEIGNANT" && (
//           <div className="bg-green-50 rounded-xl p-6 border border-green-200">
//             <h2 className="text-xl font-semibold mb-4 text-green-900">
//               Informations professionnelles
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   École
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   {...register("enseignant.school")}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Poste
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Ex: Professeur de mathématiques"
//                   {...register("enseignant.position")}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expérience
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Ex: 5 ans"
//                   {...register("enseignant.experience")}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Diplôme
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Ex: Licence en Mathématiques"
//                   {...register("enseignant.degree")}
//                 />
//               </div>
//             </div>
            
//             {user.enseignant && (
//               <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
//                 <p className="text-sm text-gray-700">
//                   <strong>Statut de validation:</strong>{" "}
//                   {user.enseignant.valideParEtab ? (
//                     <span className="text-green-600">✓ Validé</span>
//                   ) : (
//                     <span className="text-orange-600">⏳ En attente de validation</span>
//                   )}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Spécifique DONATEUR */}
//         {user.typeProfil === "DONATEUR" && (
//           <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
//             <h2 className="text-xl font-semibold mb-4 text-purple-900">
//               Informations donateur
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Organisation
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Nom de votre organisation"
//                   {...register("donateur.organisation")}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Secteur
//                 </label>
//                 <input
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Ex: Éducation, Technologie..."
//                   {...register("donateur.secteur")}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Boutons d'action */}
//         <div className="flex gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={saving || uploading}
//             className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg transition"
//           >
//             {saving ? "💾 Sauvegarde en cours..." : "✅ Enregistrer les modifications"}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/dashboard")}
//             disabled={saving}
//             className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition"
//           >
//             Annuler
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// // Helpers
// function toFormDefaults(u: any | null) {
//   if (!u) return {};
//   return {
//     fullName: u.nom ?? "",
//     avatar: u.avatar ?? "",
//     telephone: u.telephone ?? "",
//     address: u.address ?? "",
//     facebook: u.facebook ?? "",
//     twitter: u.twitter ?? "",
//     whatsapp: u.whatsapp ?? "",
//     profession: u.profession ?? "",
//     etablissement: {
//       nom: u.etablissement?.nom ?? "",
//       type: u.etablissement?.type ?? "",
//       niveau: u.etablissement?.niveau ?? "",
//       adresse: u.etablissement?.adresse ?? "",
//     },
//     enseignant: {
//       school: u.enseignant?.school ?? "",
//       position: u.enseignant?.position ?? "",
//       experience: u.enseignant?.experience ?? "",
//       degree: u.enseignant?.degree ?? "",
//     },
//     donateur: {
//       organisation: u.donateur?.organisation ?? "",
//       secteur: u.donateur?.secteur ?? "",
//     },
//   };
// }

// function sanitizeForType(type: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR", v: any) {
//   const clean = (obj: any): any => {
//     const o: any = {};
//     for (const k in obj) {
//       const val = obj[k];
//       if (val === "" || val === undefined) continue;
//       if (k === "isPublic" || k === "avatar") {
//         o[k] = val;
//       } else {
//         o[k] = typeof val === "object" && val !== null ? clean(val) : val;
//       }
//     }
//     return o;
//   };

//   const cleaned = clean(v);

//   // Ne garder que les champs pertinents selon le type
//   if (type === "ETABLISSEMENT") {
//     delete cleaned.enseignant;
//     delete cleaned.donateur;
//   } else if (type === "ENSEIGNANT") {
//     delete cleaned.etablissement;
//     delete cleaned.donateur;
//   } else if (type === "DONATEUR") {
//     delete cleaned.etablissement;
//     delete cleaned.enseignant;
//   }

//   return cleaned;
// }
"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { X, AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

type FormValues = any;

// Modal de confirmation de sauvegarde
interface SaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userName: string;
  userAvatar: string | null;
  profileType: string;
}

const SaveConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading, 
  userName, 
  userAvatar,
  profileType 
}: SaveConfirmModalProps) => {
  if (!isOpen) return null;

  const getProfileTypeLabel = () => {
    switch (profileType) {
      case "ETABLISSEMENT": return "Établissement";
      case "ENSEIGNANT": return "Enseignant";
      case "DONATEUR": return "Donateur";
      default: return "Profil";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <Save className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Avatar et nom */}
          <div className="mb-4 flex justify-center">
            <AvatarDisplay
              name={userName}
              avatar={userAvatar}
              size="lg"
              showBorder={true}
            />
          </div>

          {/* Badge type de profil */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
              {getProfileTypeLabel()}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Confirmer les modifications
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Voulez-vous enregistrer les modifications apportées à votre profil ?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Les changements seront visibles immédiatement sur votre compte.
          </p>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de notification (succès/erreur)
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}

const NotificationModal = ({ isOpen, onClose, type, title, message }: NotificationModalProps) => {
  useEffect(() => {
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className={`relative p-3 rounded-full ${
              type === "error" ? "bg-red-100" : "bg-green-100"
            }`}>
              {type === "error" ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default function EditProfilePage() {
  const { user, loading } = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormValues | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États pour les modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: ""
  });

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>({ 
    values: toFormDefaults(user) 
  });

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  if (loading) return <div className="p-10 text-center">Chargement…</div>;
  if (!user) return <div className="p-10 text-red-500 text-center">Non autorisé</div>;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Type de fichier non autorisé",
        message: "Utilisez JPG, PNG, GIF ou WebP uniquement."
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Fichier trop volumineux",
        message: "La taille maximale autorisée est de 5MB."
      });
      return;
    }

    // Aperçu local
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      setAvatarUrl(data.avatarUrl);
      setValue("avatar", data.avatarUrl);
      
      console.log("Avatar uploadé:", data.avatarUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'upload";
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur d'upload",
        message: errorMessage
      });
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Fonction appelée lors de la soumission initiale du formulaire
  const onSubmitForm = (values: FormValues) => {
    console.log("📦 Données à soumettre:", values);
    setPendingFormData(values);
    setIsConfirmModalOpen(true);
  };

  // Fonction appelée après confirmation
  const handleConfirmedSave = async () => {
    if (!pendingFormData) return;

    setSaving(true);
    
    try {
      // Ajouter l'avatar URL si elle a été modifiée
      if (avatarUrl && avatarUrl !== user.avatar) {
        pendingFormData.avatar = avatarUrl;
      }

      const payload = sanitizeForType(user.typeProfil, pendingFormData);
      console.log("Payload envoyé:", payload);

      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Échec de la mise à jour");
      }

      const data = await res.json();
      reset(toFormDefaults(data.user));
      
      setIsConfirmModalOpen(false);
      setNotificationModal({
        isOpen: true,
        type: "success",
        title: "Profil mis à jour !",
        message: "Vos modifications ont été enregistrées avec succès."
      });
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (e: any) {
      setIsConfirmModalOpen(false);
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur de mise à jour",
        message: e.message || "Une erreur est survenue lors de la mise à jour."
      });
      console.error("Erreur:", e);
    } finally {
      setSaving(false);
      setPendingFormData(null);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Modifier mon profil
        </h1>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Section Avatar */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Photo de profil</h2>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <AvatarDisplay name={user.nom} size="xl" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg shadow cursor-pointer transition"
                >
                  {uploading ? "⏳ Upload en cours..." : "📷 Changer la photo"}
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  JPG, PNG, GIF ou WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Informations de base */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  {...register("fullName")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  {...register("telephone")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (non modifiable)
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
                  value={user.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  {...register("profession")}
                />
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Réseaux sociaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://facebook.com/..."
                  {...register("facebook")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="@username"
                  {...register("twitter")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+261 xx xxx xx xx"
                  {...register("whatsapp")}
                />
              </div>
            </div>
          </div>

          {/* Spécifique ÉTABLISSEMENT */}
          {user.typeProfil === "ETABLISSEMENT" && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                Informations de l'établissement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'établissement *
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("etablissement.nom")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("etablissement.type")}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVE">Privé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...register("etablissement.niveau")}
                  >
                    <option value="">Sélectionner...</option>
                    <option value="EPP">EPP (École Primaire)</option>
                    <option value="CEG">CEG (Collège)</option>
                    <option value="LYCEE">Lycée</option>
                    <option value="COLLEGE">Collège</option>
                    <option value="UNIVERSITE">Université</option>
                    <option value="ORGANISME">Organisme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adresse complète"
                    {...register("etablissement.adresse")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Spécifique ENSEIGNANT */}
          {user.typeProfil === "ENSEIGNANT" && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h2 className="text-xl font-semibold mb-4 text-green-900">
                Informations professionnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    École
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    {...register("enseignant.school")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Professeur de mathématiques"
                    {...register("enseignant.position")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expérience
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 5 ans"
                    {...register("enseignant.experience")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diplôme
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Licence en Mathématiques"
                    {...register("enseignant.degree")}
                  />
                </div>
              </div>
              
              {user.enseignant && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>Statut de validation:</strong>{" "}
                    {user.enseignant.valideParEtab ? (
                      <span className="text-green-600">✓ Validé</span>
                    ) : (
                      <span className="text-orange-600">⏳ En attente de validation</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Spécifique DONATEUR */}
          {user.typeProfil === "DONATEUR" && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h2 className="text-xl font-semibold mb-4 text-purple-900">
                Informations donateur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nom de votre organisation"
                    {...register("donateur.organisation")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Éducation, Technologie..."
                    {...register("donateur.secteur")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              disabled={saving}
              className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmation */}
      <SaveConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={handleConfirmedSave}
        isLoading={saving}
        userName={user.nom || user.fullName || "Utilisateur"}
        userAvatar={avatarPreview || user.avatar}
        profileType={user.typeProfil}
      />

      {/* Modal de notification (succès/erreur) */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
      />
    </>
  );
}

// Helpers
function toFormDefaults(u: any | null) {
  if (!u) return {};
  return {
    fullName: u.nom ?? "",
    avatar: u.avatar ?? "",
    telephone: u.telephone ?? "",
    address: u.address ?? "",
    facebook: u.facebook ?? "",
    twitter: u.twitter ?? "",
    whatsapp: u.whatsapp ?? "",
    profession: u.profession ?? "",
    etablissement: {
      nom: u.etablissement?.nom ?? "",
      type: u.etablissement?.type ?? "",
      niveau: u.etablissement?.niveau ?? "",
      adresse: u.etablissement?.adresse ?? "",
    },
    enseignant: {
      school: u.enseignant?.school ?? "",
      position: u.enseignant?.position ?? "",
      experience: u.enseignant?.experience ?? "",
      degree: u.enseignant?.degree ?? "",
    },
    donateur: {
      organisation: u.donateur?.organisation ?? "",
      secteur: u.donateur?.secteur ?? "",
    },
  };
}

function sanitizeForType(type: "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR", v: any) {
  const clean = (obj: any): any => {
    const o: any = {};
    for (const k in obj) {
      const val = obj[k];
      if (val === "" || val === undefined) continue;
      if (k === "isPublic" || k === "avatar") {
        o[k] = val;
      } else {
        o[k] = typeof val === "object" && val !== null ? clean(val) : val;
      }
    }
    return o;
  };

  const cleaned = clean(v);

  // Ne garder que les champs pertinents selon le type
  if (type === "ETABLISSEMENT") {
    delete cleaned.enseignant;
    delete cleaned.donateur;
  } else if (type === "ENSEIGNANT") {
    delete cleaned.etablissement;
    delete cleaned.donateur;
  } else if (type === "DONATEUR") {
    delete cleaned.etablissement;
    delete cleaned.enseignant;
  }

  return cleaned;
}