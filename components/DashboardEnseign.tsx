"use client";

import React from "react";

type EnseignantDashboardProps = {
  user: {
    fullName?: string | null;
    profession?: string | null;
    avatar?: string | null;
    isValidated?: boolean;
    etablissement?: {
      nom: string;
      type?: string | null; // Public/Privé
      niveau?: string | null; // EPP/CEG/LYCÉE/…
    } | null;
    // stats démo – remplacez par vos vraies données
    _stats?: {
      recoCount: number; // reconnaissances
      projetsParticipe: number;
      donsRecus: number;
    };
  };
};

export default function EnseignantDashboard({ user }: EnseignantDashboardProps) {
  const avatarLetters =
    (user.fullName || "Utilisateur")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EN";

  const stats = user._stats || {
    recoCount: 12,
    projetsParticipe: 5,
    donsRecus: 4,
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="flex flex-col gap-5">
          {/* Profil enseignant */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {avatarLetters}
            </div>
            <div className="text-center mt-3">
              <h3 className="font-semibold text-slate-800">
                {user.fullName || "Enseignant(e)"}
              </h3>
              <p className="text-sm text-slate-500">
                {user.profession || "Personnel éducatif"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {user.etablissement
                  ? `${user.etablissement.nom} • ${user.etablissement.type ?? ""} ${user.etablissement.niveau ? `• ${user.etablissement.niveau}` : ""}`
                  : "Établissement non renseigné"}
              </p>

              <div
                className={`inline-flex items-center gap-2 mt-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.isValidated
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {user.isValidated ? "✅ Validé par l’établissement" : "⏳ En attente de validation"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.recoCount}
                </div>
                <div className="text-xs text-slate-500">Reconnaissances</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.projetsParticipe}
                </div>
                <div className="text-xs text-slate-500">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.donsRecus}
                </div>
                <div className="text-xs text-slate-500">Dons reçus</div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  👤 Mon Parcours
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  💝 Dons reçus
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  🧩 Projets participés
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  💬 Messages
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  ⚙️ Paramètres
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header / Tabs */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
            <p className="text-sm text-slate-500">
              Valorisez votre parcours et suivez vos interactions
            </p>

            <div className="flex gap-2 mt-4">
              <button className="px-3 py-2 text-sm rounded-xl bg-indigo-600 text-white">
                🧭 Parcours
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                💝 Dons reçus
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                📈 Activité
              </button>
            </div>
          </div>

          {/* Content (placeholders) */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            {/* Parcours */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Profil professionnel</h3>
              <p className="text-sm text-slate-600">
                Années d’expérience, matières enseignées, certifications, etc.
              </p>
            </div>

            {/* Reconnaissances */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Reconnaissances</h3>
              <ul className="text-sm text-slate-600 list-disc pl-5">
                <li>Attestation de contribution au projet “Salle informatique”</li>
                <li>Mention d’honneur — Semaine de l’éducation</li>
              </ul>
            </div>

            {/* Dons reçus */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Dons reçus (exemple)</h3>
              <div className="text-sm text-slate-600">
                Don de 2 laptops — statut : ✅ Réceptionné — 12/06/2025
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="flex flex-col gap-5">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-500 to-purple-600">
            <h3 className="font-semibold">🌟 Statistiques du mois</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div>
                <div className="text-lg font-bold">3</div>
                <div className="text-xs opacity-90">Projets</div>
              </div>
              <div>
                <div className="text-lg font-bold">2</div>
                <div className="text-xs opacity-90">Dons reçus</div>
              </div>
              <div>
                <div className="text-lg font-bold">5</div>
                <div className="text-xs opacity-90">Messages</div>
              </div>
              <div>
                <div className="text-lg font-bold">12</div>
                <div className="text-xs opacity-90">Reconnaissances</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary bg-indigo-600 text-white rounded-xl py-2">
                ➕ Ajouter une compétence
              </button>
              <button className="btn btn-secondary border rounded-xl py-2">
                🧩 Rejoindre un projet
              </button>
              <button className="btn btn-secondary border rounded-xl py-2">
                💬 Contacter un donateur
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
