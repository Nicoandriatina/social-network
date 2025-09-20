// "use client";

// import Link from "next/link";
// import React from "react";

// type DonateurDashboardProps = {
//   user: {
//     fullName?: string | null;
//     avatar?: string | null;
//     profession?: string | null;
//     // stats pour la démo
//     _stats?: {
//       totalDons: number;
//       projetsSoutenus: number;
//       impactVal: string; // ex: "8.5M Ar"
//     };
//   };
// };

// export default function DonateurDashboard({ user }: DonateurDashboardProps) {
//   const avatarLetters =
//     (user.fullName || "Donateur")
//       .split(" ")
//       .map((n) => n[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase() || "DN";

//   const stats = user._stats || {
//     totalDons: 12,
//     projetsSoutenus: 7,
//     impactVal: "8.5M Ar",
//   };

//   return (
//     <div className="container mx-auto px-4 md:px-6 py-6">
//       <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-6">
//         {/* LEFT SIDEBAR */}
//         <aside className="flex flex-col gap-5">
//           {/* Profil donateur */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//             <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
//               {avatarLetters}
//             </div>
//             <div className="text-center mt-3">
//               <h3 className="font-semibold text-slate-800">
//                 {user.fullName || "Donateur(trice)"}
//               </h3>
//               <p className="text-sm text-slate-500">
//                 {user.profession || "Ami de l’éducation"}
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-3 mt-5">
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {stats.totalDons}
//                 </div>
//                 <div className="text-xs text-slate-500">Dons</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {stats.projetsSoutenus}
//                 </div>
//                 <div className="text-xs text-slate-500">Projets</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {stats.impactVal}
//                 </div>
//                 <div className="text-xs text-slate-500">Impact</div>
//               </div>
//             </div>
//           </div>

//           {/* Menu */}
//           <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
//             <ul className="space-y-1 text-sm">
//               <li>
//                 <button className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
//                   💝 Mes dons
//                 </button>
//               </li>
//               <li>
//                 <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                   🧩 Projets suivis
//                 </button>
//               </li>
//               <li>
//                 <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                   ⭐ Favoris
//                 </button>
//               </li>
//               <li>
//                 <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                   💬 Messages
//                 </button>
//               </li>
//               <li>
//                 <Link 
//                 href="dashboard/edit"
//                 >
//                 <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                   ⚙️ Paramètres
//                 </button>
//                 </Link>
                
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* MAIN FEED */}
//         <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//           {/* Header / Tabs */}
//           <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
//             <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
//             <p className="text-sm text-slate-500">
//               Suivez vos contributions et l’impact de vos actions
//             </p>

//             <div className="flex gap-2 mt-4">
//               <button className="px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white">
//                 💝 Dons
//               </button>
//               <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
//                 🧩 Projets suivis
//               </button>
//               <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
//                 📈 Activité
//               </button>
//             </div>
//           </div>

//           {/* Content (placeholders) */}
//           <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
//             {/* Liste des dons */}
//             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
//               <h3 className="font-semibold text-slate-800 mb-2">Dons récents</h3>
//               <div className="text-sm text-slate-600">
//                 500 000 Ar → “Salle informatique” — statut : 📤 Envoyé — 20/06/2025
//               </div>
//               <div className="text-sm text-slate-600">
//                 15 ordinateurs → “Salle informatique” — statut : ✅ Réceptionné — 12/06/2025
//               </div>
//             </div>

//             {/* Projets suivis */}
//             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
//               <h3 className="font-semibold text-slate-800 mb-2">Projets suivis</h3>
//               <ul className="text-sm text-slate-600 list-disc pl-5">
//                 <li>Rénovation de la bibliothèque (Avancement 60%)</li>
//                 <li>Programme de bourses (Avancement 35%)</li>
//               </ul>
//             </div>

//             {/* Activité */}
//             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
//               <h3 className="font-semibold text-slate-800 mb-2">Historique d’activité</h3>
//               <p className="text-sm text-slate-600">
//                 Nouveau message de “Lycée Antananarivo” — 10:42
//               </p>
//             </div>
//           </div>
//         </main>

//         {/* RIGHT SIDEBAR */}
//         <aside className="flex flex-col gap-5">
//           <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-500">
//             <h3 className="font-semibold">📊 Impact global</h3>
//             <div className="grid grid-cols-2 gap-4 mt-4 text-center">
//               <div>
//                 <div className="text-lg font-bold">{stats.impactVal}</div>
//                 <div className="text-xs opacity-90">Contributions</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">{stats.projetsSoutenus}</div>
//                 <div className="text-xs opacity-90">Projets soutenus</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">{stats.totalDons}</div>
//                 <div className="text-xs opacity-90">Dons</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">4</div>
//                 <div className="text-xs opacity-90">Établissements</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//             <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
//             <div className="flex flex-col gap-2">
//               <button className="btn btn-primary bg-emerald-600 text-white rounded-xl py-2">
//                 ➕ Faire un don
//               </button>
//               <button className="btn btn-secondary border rounded-xl py-2">
//                 🧩 Découvrir des projets
//               </button>
//               <button className="btn btn-secondary border rounded-xl py-2">
//                 💬 Contacter un établissement
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import React from "react";
import HeaderWithDropdown from "../Header";

type DonateurDashboardProps = {
  user: {
    fullName?: string | null;
    avatar?: string | null;
    profession?: string | null;
    // stats pour la démo
    _stats?: {
      totalDons: number;
      projetsSoutenus: number;
      impactVal: string; // ex: "8.5M Ar"
    };
  };
};

export default function DonateurDashboard({ user }: DonateurDashboardProps) {
  const avatarLetters =
    (user.fullName || "Donateur")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DN";

  const stats = user._stats || {
    totalDons: 12,
    projetsSoutenus: 7,
    impactVal: "8.5M Ar",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      {/* <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-400 to-teal-400 text-white font-bold grid place-items-center">
              MSN
            </div>
            <div>
              <div className="font-semibold">Mada Social Network</div>
              <div className="text-xs text-slate-500">Tableau de bord</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              🔔 <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">2</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 text-white grid place-items-center font-semibold">
                {avatarLetters}
              </div>
              <div className="text-sm">
                <div className="font-semibold truncate max-w-[180px]">
                  {user.fullName || "Donateur"}
                </div>
                <div className="text-xs text-slate-500">
                  {user.profession || "Donateur"}
                </div>
              </div>
              <Link href="dashboard/edit">
                <span>⚙️</span>
              </Link>
            </div>
          </div>
        </div>
      </header> */}
           <HeaderWithDropdown user={user} userType="donateur"/>
      {/* 3 colonnes */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Profil donateur */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {avatarLetters}
            </div>
            <div className="text-center mt-3">
              <h3 className="font-semibold text-slate-800">
                {user.fullName || "Donateur(trice)"}
              </h3>
              <p className="text-sm text-slate-500">
                {user.profession || "Ami de l'éducation"}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.totalDons}
                </div>
                <div className="text-xs text-slate-500">Dons</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.projetsSoutenus}
                </div>
                <div className="text-xs text-slate-500">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {stats.impactVal}
                </div>
                <div className="text-xs text-slate-500">Impact</div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  💝 Mes dons
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  🧩 Projets suivis
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  ⭐ Favoris
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  💬 Messages
                </button>
              </li>
              <li>
                <Link href="dashboard/edit">
                  <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                    ⚙️ Paramètres
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header / Tabs */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
            <p className="text-sm text-slate-500">
              Suivez vos contributions et l'impact de vos actions
            </p>

            <div className="flex gap-2 mt-4">
              <button className="px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white">
                💝 Dons
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                🧩 Projets suivis
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                📈 Activité
              </button>
            </div>
          </div>

          {/* Content (placeholders) */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            {/* Liste des dons */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Dons récents</h3>
              <div className="text-sm text-slate-600">
                500 000 Ar → "Salle informatique" — statut : 📤 Envoyé — 20/06/2025
              </div>
              <div className="text-sm text-slate-600">
                15 ordinateurs → "Salle informatique" — statut : ✅ Réceptionné — 12/06/2025
              </div>
            </div>

            {/* Projets suivis */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Projets suivis</h3>
              <ul className="text-sm text-slate-600 list-disc pl-5">
                <li>Rénovation de la bibliothèque (Avancement 60%)</li>
                <li>Programme de bourses (Avancement 35%)</li>
              </ul>
            </div>

            {/* Activité */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-800 mb-2">Historique d'activité</h3>
              <p className="text-sm text-slate-600">
                Nouveau message de "Lycée Antananarivo" — 10:42
              </p>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-500">
            <h3 className="font-semibold">📊 Impact global</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div>
                <div className="text-lg font-bold">{stats.impactVal}</div>
                <div className="text-xs opacity-90">Contributions</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.projetsSoutenus}</div>
                <div className="text-xs opacity-90">Projets soutenus</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.totalDons}</div>
                <div className="text-xs opacity-90">Dons</div>
              </div>
              <div>
                <div className="text-lg font-bold">4</div>
                <div className="text-xs opacity-90">Établissements</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary bg-emerald-600 text-white rounded-xl py-2">
                ➕ Faire un don
              </button>
              <button className="btn btn-secondary border rounded-xl py-2">
                🧩 Découvrir des projets
              </button>
              <button className="btn btn-secondary border rounded-xl py-2">
                💬 Contacter un établissement
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}