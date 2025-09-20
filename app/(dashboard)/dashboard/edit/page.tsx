"use client";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
type FormValues = any;

export default function EditProfilePage() {
  const { user, loading } = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // Initialiser l'état de l'avatar avant la logique conditionnelle
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Message de succès
  const router = useRouter(); // Pour la redirection après la modification


  const { register, handleSubmit, reset } = useForm<FormValues>({ values: toFormDefaults(user) });

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);  // Initialiser l'aperçu si l'utilisateur a déjà un avatar
    }
  }, [user]);  // Revenir à l'avatar de l'utilisateur lors du changement de données utilisateur

  if (loading) return <p className="p-10">Chargement…</p>;
  if (!user) return <p className="p-10 text-red-500">Non autorisé</p>;

  const onSubmit = async (values: FormValues) => {
    console.log("donees ampidirina ilay vao nomodifiena", values);
    setSaving(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizeForType(user.typeProfil, values)),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      reset(toFormDefaults(data.user));
      setSuccessMessage("Profil mis à jour ✅");
      setTimeout(() => {
        router.push("/dashboard"); // Rediriger vers le tableau de bord après 2 secondes
      }, 2000); // Délai pour afficher le message avant la redirection
    } catch (e: any) {
      alert(e.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour gérer l'aperçu de l'image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string); // Mettre à jour l'aperçu avec l'image choisie
      };
      reader.readAsDataURL(file); // Lire le fichier comme URL pour l'aperçu
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6">Modifier mon profil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Champs communs */}
        <div>
          <label className="block text-sm font-medium">Nom complet</label>
          <input className="w-full border rounded px-3 py-2" {...register("fullName")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            <input className="w-full border rounded px-3 py-2" {...register("telephone")} />
          </div>
          <div>
            <label className="block text-sm font-medium">Avatar (Cliquez pour choisir un fichier)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded px-3 py-2"
              onChange={handleAvatarChange}
            />
            {/* Afficher un aperçu de l'avatar choisi */}
            {avatarPreview && <img src={avatarPreview} alt="Aperçu de l'avatar" className="mt-4 w-32 h-32 object-cover rounded-full" />}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Adresse</label>
          <input className="w-full border rounded px-3 py-2" {...register("etablissement.adresse")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Facebook</label>
            <input className="w-full border rounded px-3 py-2" {...register("facebook")} />
          </div>
          <div>
            <label className="block text-sm font-medium">Twitter</label>
            <input className="w-full border rounded px-3 py-2" {...register("twitter")} />
          </div>
          <div>
            <label className="block text-sm font-medium">WhatsApp</label>
            <input className="w-full border rounded px-3 py-2" {...register("whatsapp")} />
          </div>
        </div>

        {/* Spécifique par type */}
        {user.typeProfil === "ETABLISSEMENT" && (
          <fieldset className="border rounded p-4">
            <legend className="px-2 text-sm font-semibold text-gray-600">Établissement</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input className="w-full border rounded px-3 py-2" {...register("etablissement.nom")} />
              </div>
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select className="w-full border rounded px-3 py-2" {...register("etablissement.type")}>
                  <option value="">—</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVE">Privé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Niveau</label>
                <select className="w-full border rounded px-3 py-2" {...register("etablissement.niveau")}>
                  <option value="">—</option>
                  <option value="EPP">EPP</option>
                  <option value="CEG">CEG</option>
                  <option value="LYCEE">LYCÉE</option>
                  <option value="COLLEGE">COLLÈGE</option>
                  <option value="UNIVERSITE">UNIVERSITÉ</option>
                  <option value="ORGANISME">ORGANISME</option>
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-medium">Adresse</label>
                <input className="w-full border rounded px-3 py-2" {...register("etablissement.adresse")} />
              </div> */}
            </div>
          </fieldset>
        )}

        {user.typeProfil === "ENSEIGNANT" && (
          <fieldset className="border rounded p-4">
            <legend className="px-2 text-sm font-semibold text-gray-600">Enseignant</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Matière</label>
                <input className="w-full border rounded px-3 py-2" {...register("enseignant.matiere")} />
              </div>
              <div>
                <label className="block text-sm font-medium">Expérience</label>
                <input className="w-full border rounded px-3 py-2" {...register("enseignant.experience")} />
              </div>
              <div>
                <label className="block text-sm font-medium">Diplôme</label>
                <input className="w-full border rounded px-3 py-2" {...register("enseignant.degree")} />
              </div>
            </div>
          </fieldset>
        )}

        {user.typeProfil === "DONATEUR" && (
          <fieldset className="border rounded p-4">
            <legend className="px-2 text-sm font-semibold text-gray-600">Donateur</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Organisation</label>
                <input className="w-full border rounded px-3 py-2" {...register("donateur.organisation")} />
              </div>
              <div>
                <label className="block text-sm font-medium">Secteur</label>
                <input className="w-full border rounded px-3 py-2" {...register("donateur.secteur")} />
              </div>
            </div>
          </fieldset>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow cursor-pointer"
          >
            {saving ? "Sauvegarde…" : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Helpers pour pré-remplir / nettoyer
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
    etablissement: u.etablissement ?? {},
    enseignant: u.enseignant ?? {},
    donateur: u.donateur ?? {},
  };
}

function sanitizeForType(type: "ETABLISSEMENT"|"ENSEIGNANT"|"DONATEUR", v: any) {
  // on enlève les champs vides pour éviter d’écraser en null
  const clean = (obj: any) => {
    const o: any = {};
    for (const k in obj) {
      const val = (obj as any)[k];
      if (val === "" || val === undefined) continue;
      if(k==="isPublic"){
        o[k]=val;
      }
      o[k] = typeof val === "object" && val !== null ? clean(val) : val;
    }
    return o;
  };
  return clean(v);
}
