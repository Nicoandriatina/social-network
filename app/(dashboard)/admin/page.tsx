// // app/(dashboard)/admin/page.tsx
// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import SuperAdminDashboard from "@/components/admin/superAdminDashboard";
// import TopDonorsSection from "@/components/admin/TopDonorSection";
// import ActivityFeed from "@/components/admin/ActivityFeed";
// // import SuperAdminDashboard from "@/components/admin/SuperAdminDashboard";
// // import TopDonorsSection from "@/components/admin/TopDonorsSection";
// // import StatsOverview from "@/components/admin/StatsOverview";
// // import ActivityFeed from "@/components/admin/ActivityFeed";

// export const metadata = {
//   title: "Dashboard Admin - Mada Social Network",
//   description: "Tableau de bord administrateur de la plateforme",
// };

// export default async function AdminDashboardPage() {
//   // Vérification de l'authentification et du rôle
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     redirect("/auth/login");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//       type: string;
//     };

//     if (decoded.role !== "SUPERADMIN") {
//       redirect("/"); // Redirection si pas super admin
//     }

//     // Récupérer les infos de l'admin (optionnel)
//     // const adminUser = await prisma.utilisateur.findUnique({
//     //   where: { id: decoded.userId },
//     //   select: { nom: true, prenom: true, email: true, photoProfil: true }
//     // });

//   } catch (error) {
//     redirect("/auth/login");
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header Sticky */}
      

//       {/* Contenu Principal */}
//       <div className="max-w-[1600px] mx-auto px-6 py-6">
//         {/* Alertes - Utiliser le composant du SuperAdminDashboard */}
        
//         {/* Dashboard Complet avec tous les graphiques */}
//         <SuperAdminDashboard />
        
//         {/* Section Top Donateurs - Mise en avant */}
//         <div className="my-8">
//           <TopDonorsSection />
//         </div>

//         {/* Sections Supplémentaires */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
//           {/* Activité récente */}
//           <div className="lg:col-span-1">
//             <ActivityFeed />
//           </div>

//           {/* Statistiques rapides */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Utilisateurs en attente de validation */}
//             <div className="bg-white rounded-xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-slate-800 mb-4">
//                 Actions Requises
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
//                   <div>
//                     <p className="font-medium text-amber-900">
//                       Utilisateurs en attente
//                     </p>
//                     <p className="text-sm text-amber-700">
//                       8 profils à valider
//                     </p>
//                   </div>
//                   <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">
//                     Voir
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
//                   <div>
//                     <p className="font-medium text-red-900">
//                       Dons bloqués
//                     </p>
//                     <p className="text-sm text-red-700">
//                       3 dons en attente +de 14 jours
//                     </p>
//                   </div>
//                   <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
//                     Gérer
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   <div>
//                     <p className="font-medium text-blue-900">
//                       Projets inactifs
//                     </p>
//                     <p className="text-sm text-blue-700">
//                       12 projets sans activité
//                     </p>
//                   </div>
//                   <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
//                     Voir
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Métriques rapides */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
//                 <p className="text-green-100 text-sm mb-2">Taux de réussite</p>
//                 <p className="text-4xl font-bold mb-1">73.5%</p>
//                 <p className="text-green-100 text-sm">
//                   Projets avec dons reçus
//                 </p>
//               </div>

//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
//                 <p className="text-purple-100 text-sm mb-2">Temps moyen</p>
//                 <p className="text-4xl font-bold mb-1">4.2j</p>
//                 <p className="text-purple-100 text-sm">
//                   Traitement des dons
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/(dashboard)/admin/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import TopDonorsSection from "@/components/admin/TopDonorSection";
import SuperAdminDashboard from "@/components/admin/superAdminDashboard";

export const metadata = {
  title: "Dashboard Admin - Mada Social Network",
  description: "Tableau de bord administrateur de la plateforme",
};

export default async function AdminDashboardPage() {
  // Vérification de l'authentification et du rôle
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    if (decoded.role !== "SUPERADMIN") {
      redirect("/"); // Redirection si pas super admin
    }

  } catch (error) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Complet avec tous les graphiques et stats */}
      <SuperAdminDashboard />
      
      {/* Section Top Donateurs - Mise en avant */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6">
        <TopDonorsSection />
      </div>
    </div>
  );
}