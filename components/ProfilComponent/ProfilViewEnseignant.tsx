

// components/ProfilComponent/ProfilViewEnseignant.tsx
"use client";

import Link from "next/link";
import { AvatarDisplay } from "@/components/AvatarDisplay";

type ProfileViewProps = {
  profile: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
    facebook?: string;
    twitter?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    enseignant?: {
      school?: string;
      position?: string;
      experience?: string;
      degree?: string;
      validated: boolean;
    };
    etablissement?: {
      nom: string;
      type: string;
      niveau: string;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewEnseignant({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600" />

          <div className="relative px-8 pb-8">
            <div className="flex items-end gap-6 -mt-20 mb-6">
              {/* ✅ UTILISER AvatarDisplay */}
              <AvatarDisplay
                name={profile.nom}
                avatar={profile.avatar}
                size="xl"
                showBorder={true}
              />

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.nom}
                </h1>
                <p className="text-lg text-gray-600">
                  👨‍🏫 {profile.enseignant?.position || "Enseignant"}
                </p>
                <p className="text-gray-500">
                  🏫 {profile.etablissement?.nom}
                </p>
                <div
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    profile.enseignant?.validated
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {profile.enseignant?.validated
                    ? "✓ Validé"
                    : "⏳ En attente de validation"}
                </div>
              </div>

              <div>
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

            {/* Info professionnelle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {profile.enseignant?.school && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">École</p>
                  <p className="font-semibold">{profile.enseignant.school}</p>
                </div>
              )}
              {profile.enseignant?.experience && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Expérience</p>
                  <p className="font-semibold">{profile.enseignant.experience}</p>
                </div>
              )}
              {profile.enseignant?.degree && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Diplôme</p>
                  <p className="font-semibold">{profile.enseignant.degree}</p>
                </div>
              )}
            </div>

            {!profile.isFriend && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  💡 Certaines informations sont masquées. Acceptez notre demande d'ami pour plus de détails.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}