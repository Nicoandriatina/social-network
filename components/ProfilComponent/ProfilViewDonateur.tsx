"use client";

import Link from "next/link";

type ProfileViewProps = {
  profile: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
    facebook?: string;
    twitter?: string;
    profession?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    donateur?: {
      donorType?: string;
      sector?: string;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewDonateur({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-emerald-500 to-teal-600" />

          <div className="relative px-8 pb-8">
            <div className="flex items-end gap-6 -mt-20 mb-6">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.nom}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                  {profile.nom[0]}
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.nom}
                </h1>
                <p className="text-lg text-gray-600">
                  🤝 {profile.profession || "Ami de l'éducation"}
                </p>
                {profile.donateur?.sector && (
                  <p className="text-gray-500">
                    Secteur: {profile.donateur.sector}
                  </p>
                )}
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
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {isSending ? "..." : "+ Ajouter en ami"}
                  </button>
                )}
              </div>
            </div>

            {/* Info donateur */}
            {profile.donateur && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Type de donateur</p>
                  <p className="font-semibold">
                    {profile.donateur.donorType || "Non spécifié"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Secteur</p>
                  <p className="font-semibold">
                    {profile.donateur.sector || "Non spécifié"}
                  </p>
                </div>
              </div>
            )}

            {!profile.isFriend && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  💡 Certaines informations sont masquées. Acceptez notre demande d'ami pour plus de détails.
                </p>
              </div>
            )}

            {/* Réseaux sociaux */}
            {(profile.facebook || profile.twitter) && (
              <div className="mt-6 flex gap-4">
                {profile.facebook && (
                  <a
                    href={`https://facebook.com/${profile.facebook}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    📘 Facebook
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={`https://twitter.com/${profile.twitter}`}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    𝕏 Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}