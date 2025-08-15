// // app/dashboard/ui/DashboardClient.tsx
// "use client";

// import { initials, roleLabel } from "@/lib/profile/privacy";
// import { UserDTO } from "@/lib/profile/type";
// import Image from "next/image";
// import Link from "next/link";
// import { useMemo } from "react";

// export default function DashboardClient({ user }: { user: UserDTO }) {
//   // 🧠 plus tard, branche ici un vrai “isFriend(userId)” depuis l’API
//   const isFriend = false;

//   const avatar = useMemo(() => {
//     return (
//       user.avatarUrl ??
//       `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
//         user.nom ?? user.email
//       )}`
//     );
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800">
//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-teal-400 flex items-center justify-center text-white font-bold">
//               MSN
//             </div>
//             <h1 className="text-lg font-bold">Mada Social Network</h1>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100"
//               aria-label="Notifications"
//             >
//               🔔
//               <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs grid place-items-center">
//                 3
//               </span>
//             </button>

//             <div className="flex items-center gap-3 rounded-xl px-2 hover:bg-slate-50">
//               <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200">
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <Image src={avatar} alt="Avatar" className="w-full h-full object-cover" />
//               </div>
//               <div className="leading-tight">
//                 <h3 className="text-sm font-semibold">
//                   {user.etablissement?.nom ?? user.nom ?? user.email}
//                 </h3>
//                 <p className="text-xs text-slate-500">
//                   {user.typeProfil === "ETABLISSEMENT"
//                     ? `${user.etablissement?.type ?? ""} • ${
//                         user.etablissement ? "Établissement" : "Profil"
//                       }`
//                     : roleLabel[user.role] ?? "Utilisateur"}
//                 </p>
//               </div>
//               <span aria-hidden>⚙️</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* 3 columns layout */}
//       <div className="mx-auto max-w-[1600px] px-6 py-6 grid gap-6 grid-cols-1 xl:grid-cols-[280px_1fr_320px]">
//         {/* Left sidebar */}
//         <aside className="hidden xl:flex flex-col gap-5">
//           {/* Profile card */}
//           <section className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
//             <div className="w-20 h-20 rounded-2xl mx-auto mb-4 grid place-items-center text-white font-bold text-2xl"
//                  style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
//               {initials(user.etablissement?.nom ?? user.nom ?? user.email)}
//             </div>

//             <h3 className="font-bold">
//               {user.etablissement?.nom ?? user.nom ?? user.email}
//             </h3>
//             <p className="text-sm text-slate-500">
//               {user.typeProfil === "ETABLISSEMENT"
//                 ? `${user.etablissement?.type ?? "—"}`
//                 : roleLabel[user.role] ?? "Utilisateur"}
//             </p>

//             {/* Stats mock – branche sur tes vraies données plus tard */}
//             <div className="grid grid-cols-3 gap-4 mt-5">
//               <div>
//                 <div className="text-xl font-bold">8</div>
//                 <div className="text-xs text-slate-500">Projets</div>
//               </div>
//               <div>
//                 <div className="text-xl font-bold">24</div>
//                 <div className="text-xs text-slate-500">Donateurs</div>
//               </div>
//               <div>
//                 <div className="text-xl font-bold">1,200</div>
//                 <div className="text-xs text-slate-500">Élèves</div>
//               </div>
//             </div>
//           </section>

//           {/* Navigation */}
//           <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
//             {[
//               { key: "projects", icon: "📝", label: "Mes Projets" },
//               { key: "donations", icon: "💰", label: "Donations Reçues" },
//               { key: "team", icon: "👥", label: "Mon Équipe", visible: user.typeProfil === "ETABLISSEMENT" },
//               { key: "messages", icon: "💬", label: "Messages" },
//               { key: "stats", icon: "📊", label: "Statistiques" },
//               { key: "settings", icon: "⚙️", label: "Paramètres" },
//             ]
//               .filter(i => i.visible === undefined ? true : i.visible)
//               .map(item => (
//                 <button
//                   key={item.key}
//                   className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-white hover:translate-x-1 transition
//                              hover:bg-gradient-to-br from-indigo-500 to-violet-600"
//                 >
//                   <span>{item.icon}</span> {item.label}
//                 </button>
//               ))}
//           </nav>
//         </aside>

//         {/* Main feed */}
//         <main className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
//           <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-violet-50">
//             <h2 className="text-xl font-bold">Tableau de bord</h2>
//             <p className="text-sm text-slate-600">
//               Gérez vos projets et suivez vos donations en temps réel
//             </p>

//             {/* Tabs (stateless – tu pourras mettre un état plus tard) */}
//             <div className="mt-4 flex gap-2">
//               {["📝 Projets", "💰 Donations", "📈 Activité"].map((t, i) => (
//                 <button
//                   key={t}
//                   className={`px-4 py-2 rounded-lg font-medium ${i === 0
//                     ? "text-white bg-gradient-to-br from-indigo-500 to-violet-600"
//                     : "text-slate-600 hover:bg-slate-100"}`}
//                 >
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Contenu (mock) */}
//           <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-300px)]">
//             {/* New project form CTA – visible seulement pour établissement + admin */}
//             {user.typeProfil === "ETABLISSEMENT" && user.role !== "SIMPLE" && (
//               <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-gradient-to-br from-indigo-50/40 to-violet-50/40">
//                 <div className="text-5xl mb-3">📝</div>
//                 <h4 className="font-bold mb-1">Publier un nouveau projet</h4>
//                 <p className="text-sm text-slate-600 mb-4">
//                   Partagez vos projets avec la communauté pour trouver des donateurs
//                 </p>
//                 <Link
//                   href="/projects/new"
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold
//                              bg-gradient-to-br from-indigo-500 to-violet-600 hover:shadow-md"
//                 >
//                   Créer un projet
//                 </Link>
//               </div>
//             )}

//             {/* Cards projets – data mock */}
//             {[
//               { title: "Rénovation de la bibliothèque", cat: "Réhabilitation", donors: 5, amount: "2,500,000 Ar", date: "15 Mars 2024" },
//               { title: "Construction salle informatique", cat: "Construction", donors: 3, amount: "1,800,000 Ar", date: "8 Mars 2024" },
//               { title: "Programme de bourses d'excellence", cat: "Formation", donors: 8, amount: "4,200,000 Ar", date: "1 Mars 2024" },
//             ].map(p => (
//               <article key={p.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <h3 className="font-bold">{p.title}</h3>
//                     <p className="text-slate-700 text-sm mt-1">
//                       {/* description courte dummy */}
//                       Projet visant à améliorer l’environnement d’apprentissage.
//                     </p>
//                   </div>
//                   <span className="text-xs text-white px-3 py-1 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600">
//                     {p.cat}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-sm">
//                   <span>📅 Publié le {p.date}</span>
//                   <div className="flex items-center gap-4">
//                     <span className="font-semibold text-indigo-600">👥 {p.donors} donateurs</span>
//                     <span className="font-semibold text-indigo-600">💰 {p.amount}</span>
//                     <button className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50">
//                       Voir détails
//                     </button>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </main>

//         {/* Right sidebar */}
//         <aside className="hidden xl:flex flex-col gap-5">
//           {/* Stats */}
//           <section className="rounded-2xl p-6 text-white shadow-sm"
//                    style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
//             <h3 className="font-semibold mb-4">📊 Statistiques du mois</h3>
//             <div className="grid grid-cols-2 gap-4 text-center">
//               {[
//                 ["8", "Projets actifs"],
//                 ["16", "Nouvelles donations"],
//                 ["8.5M", "Ar collectés"],
//                 ["24", "Donateurs uniques"],
//               ].map(([n, l]) => (
//                 <div key={l}>
//                   <div className="text-2xl font-bold">{n}</div>
//                   <div className="text-xs opacity-90 mt-1">{l}</div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Donateurs récents (mock) */}
//           <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//             <h3 className="font-semibold mb-4">💝 Donateurs récents</h3>
//             {[
//               ["JR", "Jean Rakoto", "Tables et chaises", "18 Mars"],
//               ["MR", "Marie Rasoamalala", "500,000 Ar", "20 Mars"],
//               ["SA", "SARL TechMada", "15 ordinateurs", "12 Mars"],
//             ].map(([ini, name, contrib, date]) => (
//               <div key={name} className="flex items-center gap-3 py-3 border-b last:border-b-0">
//                 <div className="w-10 h-10 rounded-lg grid place-items-center text-white font-semibold"
//                      style={{ background: "linear-gradient(135deg,#48bb78,#38a169)" }}>
//                   {ini}
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium text-sm">{name}</div>
//                   <div className="text-xs text-slate-500">{contrib}</div>
//                 </div>
//                 <div className="text-xs text-slate-400">{date}</div>
//               </div>
//             ))}
//           </section>

//           {/* Actions rapides */}
//           <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//             <h3 className="font-semibold mb-4">⚡ Actions rapides</h3>
//             <div className="flex flex-col gap-3">
//               <button className="btn-primary">📝 Nouveau projet</button>
//               <button className="btn-secondary">👥 Inviter un enseignant</button>
//               <button className="btn-secondary">📊 Voir rapports</button>
//               <button className="btn-secondary">💬 Contacter support</button>
//             </div>
//           </section>
//         </aside>
//       </div>

//       <style jsx global>{`
//         .btn-primary {
//           @apply w-full justify-center px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 hover:shadow-md;
//         }
//         .btn-secondary {
//           @apply w-full justify-center px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50;
//         }
//       `}</style>
//     </div>
//   );
// }

// modules/dashboard/EtabDashboard.tsx
"use client";
import type { FrontUser } from "@/lib/hooks/useCurrentUser";

export default function EtabDashboard({ user }: { user: FrontUser }) {
  const etab = user.etablissement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
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
              🔔 <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">3</span>
            </button>
            <div className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white grid place-items-center font-semibold">
                {etab?.nom?.slice(0,2).toUpperCase() ?? user.nom.slice(0,2).toUpperCase()}
              </div>
              <div className="text-sm">
                <div className="font-semibold truncate max-w-[180px]">
                  {etab?.nom ?? user.nom}
                </div>
                <div className="text-xs text-slate-500">
                  {etab ? `${etab.type ?? ""}` : user.typeProfil}
                </div>
              </div>
              <span>⚙️</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3 colonnes */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Colonne gauche */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white grid place-items-center text-2xl font-bold shadow-md">
              {etab?.nom?.slice(0,2).toUpperCase() ?? user.nom.slice(0,2).toUpperCase()}
            </div>
            <div className="mt-3 font-semibold">{etab?.nom ?? user.nom}</div>
            <div className="text-sm text-slate-500">
              {etab ? `${etab.isPublic ? "Établissement Public" : "Établissement Privé"}${etab.niveau ? " • " + etab.niveau : ""}` : user.typeProfil}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div>
                <div className="text-lg font-bold">8</div>
                <div className="text-xs text-slate-500">Projets</div>
              </div>
              <div>
                <div className="text-lg font-bold">24</div>
                <div className="text-xs text-slate-500">Donateurs</div>
              </div>
              <div>
                <div className="text-lg font-bold">1,200</div>
                <div className="text-xs text-slate-500">Élèves</div>
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-2xl border border-slate-200 p-2">
            {[
              ["📝", "Mes Projets"],
              ["💰", "Donations Reçues"],
              ["👥", "Mon Équipe"],
              ["💬", "Messages"],
              ["📊", "Statistiques"],
              ["⚙️", "Paramètres"],
            ].map(([icon, label], i) => (
              <a key={i} href="#" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700`}>
                <span>{icon}</span><span className="text-sm font-medium">{label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Centre */}
        <main className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="text-xl font-bold">Tableau de bord</div>
            <div className="text-sm text-slate-600">Gérez vos projets et suivez vos donations en temps réel</div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm">📝 Projets</button>
              <button className="px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100">💰 Donations</button>
              <button className="px-3 py-1.5 rounded-lg text-sm hover:bg-slate-100">📈 Activité</button>
            </div>
          </div>

          <div className="p-6">
            {/* Formulaire nouveau projet (placeholder) */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-indigo-50/30 p-6 text-center hover:border-indigo-400 cursor-pointer">
              <div className="text-4xl mb-2">📝</div>
              <div className="font-semibold">Publier un nouveau projet</div>
              <div className="text-sm text-slate-600">Partagez vos projets pour trouver des donateurs</div>
            </div>

            {/* Liste projets (placeholder) */}
            <div className="mt-6 space-y-4">
              {[
                ["Rénovation de la bibliothèque", "Réhabilitation", "2,500,000 Ar", "5 donateurs"],
                ["Construction salle informatique", "Construction", "1,800,000 Ar", "3 donateurs"],
                ["Programme de bourses d'excellence", "Formation", "4,200,000 Ar", "8 donateurs"],
              ].map(([title, cat, amount, donors], i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{title}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Projet {cat.toString().toLowerCase()} — description courte…
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                      {cat}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-sm">
                    <span className="text-slate-600">📅 Publié récemment</span>
                    <div className="flex items-center gap-3 font-semibold text-indigo-600">
                      <span>👥 {donors}</span>
                      <span>💰 {amount}</span>
                      <button className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs">Voir détails</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Colonne droite */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6">
            <div className="font-semibold">📊 Statistiques du mois</div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                ["8", "Projets actifs"],
                ["16", "Nouvelles donations"],
                ["8.5M", "Ar collectés"],
                ["24", "Donateurs uniques"],
              ].map(([n, l], i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">{n}</div>
                  <div className="text-xs opacity-90">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="font-semibold mb-3">💝 Donateurs récents</div>
            {["Jean Rakoto", "Marie Rasoamalala", "SARL TechMada", "Anna Fotsy"].map((n, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white grid place-items-center text-xs font-semibold">
                    {n.split(" ").map(s=>s[0]).join("").slice(0,2)}
                  </div>
                  <div className="text-sm">{n}</div>
                </div>
                <div className="text-xs text-slate-500">récemment</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="font-semibold mb-3">⚡ Actions rapides</div>
            <div className="flex flex-col gap-2">
              <button className="btn-primary px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">📝 Nouveau projet</button>
              <button className="px-4 py-2 rounded-xl border border-slate-300">👥 Inviter un enseignant</button>
              <button className="px-4 py-2 rounded-xl border border-slate-300">📊 Voir rapports</button>
              <button className="px-4 py-2 rounded-xl border border-slate-300">💬 Contacter support</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
