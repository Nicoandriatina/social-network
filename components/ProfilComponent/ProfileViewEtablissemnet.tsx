

// components/ProfilComponent/ProfileViewEtablissemnet.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AvatarDisplay } from "@/components/AvatarDisplay";

type ProfileViewProps = {
  profile: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
    telephone?: string;
    facebook?: string;
    twitter?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    etablissement?: {
      nom: string;
      type: string;
      niveau: string;
      adresse?: string;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewEtablissement({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState<"projets" | "donations">("projets");

  useEffect(() => {
    fetchEtablissementData();
  }, [profile.id]);

  const fetchEtablissementData = async () => {
    try {
      const resProjects = await fetch(`/api/etablissements/${profile.id}/projects`, {
        credentials: "include",
      });
      if (resProjects.ok) {
        const data = await resProjects.json();
        setProjects(data.projects || []);
      }

      const resDonations = await fetch(`/api/etablissements/${profile.id}/donations`, {
        credentials: "include",
      });
      if (resDonations.ok) {
        const data = await resDonations.json();
        setDonations(data.donations || []);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header du profil */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Image de couverture */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />

          {/* Info utilisateur */}
          <div className="relative px-8 pb-8">
            <div className="flex items-end gap-6 -mt-24 mb-6">
              {/* ✅ UTILISER AvatarDisplay */}
              <AvatarDisplay
                name={profile.nom}
                avatar={profile.avatar}
                size="xl"
                showBorder={true}
              />

              <div className="flex-1 pb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {profile.nom}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  🏫 {profile.etablissement?.type === "PUBLIC" ? "Établissement Public" : "Établissement Privé"}{" "}
                  • {profile.etablissement?.niveau}
                </p>
                <p className="text-gray-500 mt-1">
                  {profile.etablissement?.adresse}
                </p>
              </div>

              {/* Bouton ami */}
              <div className="pb-2">
                {profile.isFriend ? (
                  <span className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold">
                    ✓ Vous êtes amis
                  </span>
                ) : profile.friendRequestPending ? (
                  <span className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
                    ⏳ Demande en attente
                  </span>
                ) : (
                  <button
                    onClick={onSendFriendRequest}
                    disabled={isSending}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isSending ? "..." : "+ Ajouter en ami"}
                  </button>
                )}
              </div>
            </div>

            {/* Infos de contact masquées */}
            {!profile.isFriend && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  💡 Les coordonnées personnelles sont masquées. Acceptez notre demande d'ami pour les voir.
                </p>
              </div>
            )}

            {/* Réseaux sociaux */}
            <div className="flex gap-4 mb-6">
              {profile.facebook && (
                <a href={`https://facebook.com/${profile.facebook}`} target="_blank" className="text-blue-600 hover:underline">
                  📘 Facebook
                </a>
              )}
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" className="text-blue-400 hover:underline">
                  𝕏 Twitter
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 px-8 py-4 flex gap-4">
            <button
              onClick={() => setActiveTab("projets")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === "projets"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              📝 Projets ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === "donations"
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              💰 Donations ({donations.length})
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {loadingProjects ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : activeTab === "projets" ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Projets de {profile.nom}</h2>
              {projects.length === 0 ? (
                <p className="text-center text-gray-500">Aucun projet publié</p>
              ) : (
                projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-lg mb-2">{project.titre}</h3>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Voir le projet →
                    </Link>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Donations reçues par {profile.nom}</h2>
              {donations.length === 0 ? (
                <p className="text-center text-gray-500">Aucune donation</p>
              ) : (
                donations.map((don: any) => (
                  <div
                    key={don.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{don.libelle}</h3>
                        <p className="text-gray-600 text-sm">
                          Type: {don.type} • Statut: {don.statut}
                        </p>
                      </div>
                      {don.type === "MONETAIRE" && (
                        <span className="text-green-600 font-bold">
                          {don.montant} Ar
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}