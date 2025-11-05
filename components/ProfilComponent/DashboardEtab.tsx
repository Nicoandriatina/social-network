// // components/ProfilComponent/DashboardEtab.tsx (Version Modernisée)
// "use client";
// import type { FrontUser } from "@/lib/hooks/useCurrentUser";
// import Link from "next/link";
// import { useUserProjects } from "@/lib/hooks/useUserProjects";
// import { useDonationStats } from "@/lib/hooks/useDonationStats";
// import { useState } from "react";
// import DonationsReceivedPage from "../donations/DonationsReceivedPage";
// import DonationsWidget from "../donations/DonationWidget";
// import { AvatarDisplay } from "@/components/AvatarDisplay";
// import { 
//   FileText, 
//   DollarSign, 
//   Users, 
//   MessageSquare, 
//   BarChart3, 
//   Settings, 
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   RefreshCw,
//   TrendingUp,
//   CheckCircle,
//   Clock,
//   Calendar,
//   Image as ImageIcon,
//   UserPlus,
//   FileBarChart,
//   HelpCircle,
//   FolderOpen,
//   Target
// } from "lucide-react";

// export default function EtabDashboard({ user }: { user: FrontUser }) {
//   const etab = user.etablissement;
//   const { projects, stats, loading, error, refreshProjects } = useUserProjects();
//   const { stats: donationStats, loading: loadingDonations, refreshStats: refreshDonationStats } = useDonationStats();
//   const [deletingProject, setDeletingProject] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"projets" | "donations" | "activite">("projets");

//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('fr-MG', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   const getCategoryLabel = (category: string) => {
//     const labels: Record<string, string> = {
//       'CONSTRUCTION': 'Construction',
//       'REHABILITATION': 'Réhabilitation', 
//       'AUTRES': 'Autres'
//     };
//     return labels[category] || category;
//   };

//   const handleDeleteProject = async (projectId: string) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
//       return;
//     }

//     setDeletingProject(projectId);
//     try {
//       const response = await fetch(`/api/user/projects?id=${projectId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.error || 'Erreur lors de la suppression');
//       }

//       refreshProjects();
//     } catch (error) {
//       alert(error instanceof Error ? error.message : 'Erreur lors de la suppression');
//     } finally {
//       setDeletingProject(null);
//     }
//   };

//   const handleRefresh = () => {
//     if (activeTab === "projets") {
//       refreshProjects();
//     } else if (activeTab === "donations") {
//       refreshDonationStats();
//     }
//   };

//   const renderMainContent = () => {
//     switch (activeTab) {
//       case "donations":
//         return <DonationsReceivedPage user={user} userType="ETABLISSEMENT" />;
//       case "activite":
//         return (
//           <div className="p-6">
//             <div className="text-center py-12">
//               <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <TrendingUp className="w-10 h-10 text-indigo-600" />
//               </div>
//               <h3 className="text-xl font-semibold text-slate-700 mb-2">Activité récente</h3>
//               <p className="text-slate-500">Cette section affichera l'activité récente de votre établissement</p>
//             </div>
//           </div>
//         );
//       default:
//         return (
//           <div className="p-6">
//             {/* Bouton nouveau projet */}
//             <Link href="/projects/new">
//               <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-300">
//                 <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
//                   <Plus className="w-7 h-7 text-indigo-600" />
//                 </div>
//                 <div className="font-semibold text-slate-800 mb-1">Publier un nouveau projet</div>
//                 <div className="text-sm text-slate-600">Partagez vos projets pour trouver des donateurs</div>
//               </div>
//             </Link>

//             {loading && (
//               <div className="mt-6 text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//                 <p className="text-slate-600">Chargement de vos projets...</p>
//               </div>
//             )}

//             {error && (
//               <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <HelpCircle className="w-5 h-5" />
//                   <span className="font-medium">Erreur: {error}</span>
//                 </div>
//               </div>
//             )}

//             {!loading && !error && (
//               <div className="mt-6 space-y-4">
//                 {projects.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FolderOpen className="w-10 h-10 text-slate-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun projet publié</h3>
//                     <p className="text-slate-500 mb-6">Commencez par créer votre premier projet pour attirer des donateurs</p>
//                     <Link 
//                       href="/projects/new"
//                       className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
//                     >
//                       <Plus className="w-5 h-5" />
//                       Créer mon premier projet
//                     </Link>
//                   </div>
//                 ) : (
//                   projects.map((project) => (
//                     <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-all duration-300">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <div className="font-semibold text-lg text-slate-800">{project.titre}</div>
//                             <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold">
//                               {getCategoryLabel(project.categorie)}
//                             </span>
//                           </div>
                          
//                           <div className="text-sm text-slate-600 mb-3 line-clamp-2">
//                             {project.description}
//                           </div>
                          
//                           <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
//                             <span className="flex items-center gap-1">
//                               <FileText className="w-3.5 h-3.5" />
//                               Réf: {project.reference}
//                             </span>
//                             <span className="flex items-center gap-1">
//                               <Calendar className="w-3.5 h-3.5" />
//                               {formatDate(project.datePublication)}
//                             </span>
//                           </div>
                          
//                           {project.photos && project.photos.length > 0 && (
//                             <div className="flex gap-2 mb-3">
//                               {project.photos.slice(0, 3).map((photo, index) => (
//                                 <div key={index} className="relative group">
//                                   <img 
//                                     src={photo} 
//                                     alt="Photo du projet"
//                                     className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
//                                   />
//                                   <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                                     <ImageIcon className="w-5 h-5 text-white" />
//                                   </div>
//                                 </div>
//                               ))}
//                               {project.photos.length > 3 && (
//                                 <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 flex flex-col items-center justify-center text-xs text-slate-600 font-semibold">
//                                   <ImageIcon className="w-4 h-4 mb-1" />
//                                   +{project.photos.length - 3}
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
//                         <div className="flex items-center gap-4 text-sm">
//                           <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
//                             <Users className="w-4 h-4" />
//                             {project.donCount} Don{project.donCount > 1 ? 's' : ''}
//                           </span>
//                           <span className="flex items-center gap-1.5 text-green-600 font-semibold">
//                             <DollarSign className="w-4 h-4" />
//                             {formatAmount(project.totalRaised)} Ar
//                           </span>
//                         </div>
                        
//                         <div className="flex items-center gap-2">
//                           <Link 
//                             href={`/projects/${project.id}`}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-50 transition-colors"
//                           >
//                             <Eye className="w-3.5 h-3.5" />
//                             Détails
//                           </Link>
//                           <Link 
//                             href={`/projects/${project.id}/edit`}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-700 text-xs hover:bg-indigo-100 transition-colors"
//                           >
//                             <Edit className="w-3.5 h-3.5" />
//                             Modifier
//                           </Link>
//                           <button 
//                             onClick={() => handleDeleteProject(project.id)}
//                             disabled={deletingProject === project.id || project.donCount > 0}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             title={project.donCount > 0 ? "Impossible de supprimer un projet avec des dons" : "Supprimer le projet"}
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                             {deletingProject === project.id ? "..." : "Supprimer"}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* 3 colonnes */}
//       <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
//         {/* Colonne gauche */}
//         <aside className="hidden lg:flex flex-col gap-6">
//           <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
//             <div className="flex justify-center mb-3">
//               <AvatarDisplay
//                 name={etab?.nom ?? user.nom}
//                 avatar={user.avatar}
//                 size="lg"
//                 showBorder={true}
//               />
//             </div>
            
//             <div className="mt-3 font-semibold text-slate-800">{etab?.nom ?? user.nom}</div>
//             <div className="text-sm text-slate-500">
//               {etab ? `${etab.type === "PUBLIC" ? "Établissement Public" : "Établissement Privé"}${etab.niveau ? " • " + etab.niveau : ""}` : user.typeProfil}
//             </div>

//             <div className="grid grid-cols-3 gap-3 mt-5">
//               <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
//                 <div className="text-lg font-bold text-indigo-600">{loading ? "..." : stats.totalProjects}</div>
//                 <div className="text-xs text-slate-600">Projets</div>
//               </div>
//               <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
//                 <div className="text-lg font-bold text-green-600">
//                   {loadingDonations ? "..." : donationStats?.donateurUniques || 0}
//                 </div>
//                 <div className="text-xs text-slate-600">Donateurs</div>
//               </div>
//               <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3">
//                 <div className="text-lg font-bold text-amber-600">
//                   {loadingDonations ? "..." : formatAmount(donationStats?.totalMonetaire || 0)}
//                 </div>
//                 <div className="text-xs text-slate-600">Ar collectés</div>
//               </div>
//             </div>
//           </div>

//           <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
//             {[
//               [<FileText className="w-4 h-4" />, "Mes Projets", () => setActiveTab("projets")],
//               [<DollarSign className="w-4 h-4" />, "Donations Reçues", () => setActiveTab("donations")],
//               [<CheckCircle className="w-4 h-4" />, "Valider enseignants", () => window.location.href = "/dashboard/admin/pending-teachers"],
//               [<Users className="w-4 h-4" />, "Mon Équipe", null],
//               [<MessageSquare className="w-4 h-4" />, "Messages", () => window.location.href = "/dashboard/messages"],
//               [<BarChart3 className="w-4 h-4" />, "Statistiques", null],
//               [<Settings className="w-4 h-4" />, "Paramètres", null],
//             ].map(([icon, label, onClick], i) => (
//               <button 
//                 key={i} 
//                 onClick={onClick as (() => void) || undefined}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
//                   (label === "Mes Projets" && activeTab === "projets") || 
//                   (label === "Donations Reçues" && activeTab === "donations")
//                     ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
//                     : ""
//                 } ${!onClick ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                 disabled={!onClick}
//               >
//                 <span>{icon}</span>
//                 <span className="text-sm font-medium">{label}</span>
//               </button>
//             ))}
//           </nav>

//           <DonationsWidget userType="ETABLISSEMENT" />
//         </aside>

//         {/* Centre */}
//         <main className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
//           <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-xl font-bold text-slate-800">
//                   {activeTab === "projets" && "Mes Projets"}
//                   {activeTab === "donations" && "Donations Reçues"}
//                   {activeTab === "activite" && "Activité"}
//                 </div>
//                 <div className="text-sm text-slate-600">
//                   {activeTab === "projets" && "Gérez vos projets et suivez vos donations en temps réel"}
//                   {activeTab === "donations" && "Suivez et confirmez les dons reçus"}
//                   {activeTab === "activite" && "Consultez l'activité récente de votre établissement"}
//                 </div>
//               </div>
//               <button 
//                 onClick={handleRefresh}
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-white/50 transition-colors"
//                 disabled={loading || loadingDonations}
//               >
//                 <RefreshCw className={`w-4 h-4 ${(loading || loadingDonations) ? 'animate-spin' : ''}`} />
//                 Actualiser
//               </button>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button 
//                 onClick={() => setActiveTab("projets")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
//                   activeTab === "projets" 
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
//                     : "hover:bg-white/50"
//                 }`}
//               >
//                 <FileText className="w-4 h-4" />
//                 Projets
//               </button>
//               <button 
//                 onClick={() => setActiveTab("donations")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
//                   activeTab === "donations" 
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
//                     : "hover:bg-white/50"
//                 }`}
//               >
//                 <DollarSign className="w-4 h-4" />
//                 Donations
//               </button>
//               <button 
//                 onClick={() => setActiveTab("activite")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
//                   activeTab === "activite" 
//                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
//                     : "hover:bg-white/50"
//                 }`}
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 Activité
//               </button>
//             </div>
//           </div>
          
//           {renderMainContent()}
//         </main>

//         {/* Colonne droite */}
//         <aside className="hidden lg:flex flex-col gap-6">
//           <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 shadow-lg">
//             <div className="flex items-center gap-2 font-semibold mb-4">
//               <BarChart3 className="w-5 h-5" />
//               Statistiques du mois
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//                 <div className="text-2xl font-bold">
//                   {loading ? "..." : stats.totalProjects}
//                 </div>
//                 <div className="text-xs opacity-90">Projets actifs</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//                 <div className="text-2xl font-bold">
//                   {loadingDonations ? "..." : donationStats?.thisMonth || 0}
//                 </div>
//                 <div className="text-xs opacity-90">Nouvelles donations</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//                 <div className="text-2xl font-bold">
//                   {loadingDonations ? "..." : formatAmount((donationStats?.montantThisMonth || 0)/1000000) + "M"}
//                 </div>
//                 <div className="text-xs opacity-90">Ar collectés ce mois</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
//                 <div className="text-2xl font-bold">
//                   {loadingDonations ? "..." : donationStats?.donateurUniques || 0}
//                 </div>
//                 <div className="text-xs opacity-90">Donateurs uniques</div>
//               </div>
//             </div>
//           </div>

//           {donationStats && (
//             <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
//               <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
//                 <DollarSign className="w-5 h-5 text-green-600" />
//                 Résumé financier
//               </div>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
//                   <span className="text-sm text-slate-600">Total collecté:</span>
//                   <span className="font-semibold text-green-600">
//                     {formatAmount(donationStats.totalMonetaire)} Ar
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
//                   <span className="text-sm text-slate-600 flex items-center gap-1">
//                     <Clock className="w-3.5 h-3.5" />
//                     En attente:
//                   </span>
//                   <span className="font-semibold text-yellow-600">
//                     {formatAmount(donationStats.montantEnAttente)} Ar
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
//                   <span className="text-sm text-slate-600 flex items-center gap-1">
//                     <CheckCircle className="w-3.5 h-3.5" />
//                     Reçu:
//                   </span>
//                   <span className="font-semibold text-emerald-600">
//                     {formatAmount(donationStats.montantRecu)} Ar
//                   </span>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="text-xs text-slate-500 flex items-center justify-center gap-2 bg-slate-50 p-2 rounded-lg">
//                   <Target className="w-3.5 h-3.5" />
//                   {donationStats.donationsMonetaires} dons monétaires • {donationStats.donationsVivres + donationStats.donationsMateriels} dons matériels
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
//               <TrendingUp className="w-5 h-5 text-indigo-600" />
//               Projets populaires
//             </div>
//             {!loading && projects.slice(0, 4).map((project) => (
//               <div key={project.id} className="flex items-center justify-between py-2.5 border-b last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors">
//                 <div className="flex items-center gap-2.5">
//                   <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center text-xs font-semibold shadow-sm">
//                     {project.titre.slice(0,2).toUpperCase()}
//                   </div>
//                   <div className="text-sm font-medium text-slate-700 truncate max-w-[120px]">{project.titre}</div>
//                 </div>
//                 <div className="flex items-center gap-1 text-xs text-slate-500">
//                   <Users className="w-3.5 h-3.5" />
//                   {project.donCount}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="text-center py-4 text-slate-500">
//                 <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
//               </div>
//             )}
//           </div>

//           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
//               <Target className="w-5 h-5 text-purple-600" />
//               Actions rapides
//             </div>
//             <div className="flex flex-col gap-2">
//               <Link 
//                 href="/projects/new" 
//                 className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
//               >
//                 <Plus className="w-4 h-4" />
//                 Nouveau projet
//               </Link>
//               <Link 
//                 href="/dashboard/friends"
//                 className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
//               >
//                 <UserPlus className="w-4 h-4" />
//                 Inviter un enseignant
//               </Link>
//               <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg">
//                 <FileBarChart className="w-4 h-4" />
//                 Voir rapports
//               </button>
//               <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg">
//                 <HelpCircle className="w-4 h-4" />
//                 Contacter support
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }

// components/ProfilComponent/DashboardEtab.tsx
"use client";
import type { FrontUser } from "@/lib/hooks/useCurrentUser";
import Link from "next/link";
import { useUserProjects } from "@/lib/hooks/useUserProjects";
import { useDonationStats } from "@/lib/hooks/useDonationStats";
import { useState, useEffect } from "react";
import DonationsReceivedPage from "../donations/DonationsReceivedPage";
import DonationsWidget from "../donations/DonationWidget";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { 
  FileText, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Image as ImageIcon,
  UserPlus,
  FileBarChart,
  HelpCircle,
  FolderOpen,
  Target,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  BarChart3
} from "lucide-react";

// Type pour les enseignants
type ValidatedTeacher = {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    telephone?: string;
    avatar?: string;
    createdAt: string;
  };
  position?: string;
  experience?: string;
  degree?: string;
  validated: boolean;
};

export default function EtabDashboard({ user }: { user: FrontUser }) {
  const etab = user.etablissement;
  const { projects, stats, loading, error, refreshProjects } = useUserProjects();
  const { stats: donationStats, loading: loadingDonations, refreshStats: refreshDonationStats } = useDonationStats();
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"projets" | "donations" | "equipe" | "activite">("projets");
  
  // États pour l'équipe
  const [teachers, setTeachers] = useState<ValidatedTeacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState<ValidatedTeacher[]>([]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'CONSTRUCTION': 'Construction',
      'REHABILITATION': 'Réhabilitation', 
      'AUTRES': 'Autres'
    };
    return labels[category] || category;
  };

  // Charger les enseignants validés
  useEffect(() => {
    if (activeTab === "equipe" && etab?.id) {
      fetchValidatedTeachers();
    }
  }, [activeTab, etab?.id]);

  // Filtrer les enseignants
  useEffect(() => {
    if (searchTerm) {
      const filtered = teachers.filter(teacher =>
        teacher.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  const fetchValidatedTeachers = async () => {
    if (!etab?.id) return;
    
    setLoadingTeachers(true);
    try {
      const res = await fetch(`/api/etablissements/${etab.id}/teachers/validated`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des enseignants");
      }

      const data = await res.json();
      setTeachers(data.teachers || []);
      setFilteredTeachers(data.teachers || []);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    setDeletingProject(projectId);
    try {
      const response = await fetch(`/api/user/projects?id=${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      refreshProjects();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingProject(null);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "projets") {
      refreshProjects();
    } else if (activeTab === "donations") {
      refreshDonationStats();
    } else if (activeTab === "equipe") {
      fetchValidatedTeachers();
    }
  };

  const renderTeamContent = () => (
    <div className="p-6">
      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un enseignant par nom, email ou poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {loadingTeachers ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de votre équipe...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            {searchTerm ? "Aucun résultat" : "Aucun enseignant validé"}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm 
              ? "Essayez avec d'autres termes de recherche"
              : "Les enseignants que vous validez apparaîtront ici"}
          </p>
          {!searchTerm && (
            <Link 
              href="/dashboard/admin/pending-teachers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5" />
              Voir les demandes en attente
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* En-tête avec avatar */}
              <div className="flex items-start gap-4 mb-4">
                <AvatarDisplay
                  name={teacher.user.fullName}
                  avatar={teacher.user.avatar}
                  size="lg"
                  showBorder={true}
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-800 truncate">
                    {teacher.user.fullName}
                  </h3>
                  {teacher.position && (
                    <p className="text-sm text-indigo-600 font-medium flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4" />
                      {teacher.position}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Validé
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{teacher.user.email}</span>
                </div>
                {teacher.user.telephone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{teacher.user.telephone}</span>
                  </div>
                )}
              </div>

              {/* Informations supplémentaires */}
              <div className="grid grid-cols-2 gap-3">
                {teacher.experience && (
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs text-slate-600 font-medium">Expérience</span>
                    </div>
                    <p className="text-sm text-slate-900 font-semibold">{teacher.experience}</p>
                  </div>
                )}
                {teacher.degree && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs text-slate-600 font-medium">Diplôme</span>
                    </div>
                    <p className="text-sm text-slate-900 font-semibold truncate" title={teacher.degree}>
                      {teacher.degree}
                    </p>
                  </div>
                )}
              </div>

              {/* Date d'ajout */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  Membre depuis le {formatDate(teacher.user.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques en bas */}
      {!loadingTeachers && filteredTeachers.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{teachers.length}</div>
                <div className="text-sm text-slate-600">Enseignants validés</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {teachers.filter(t => t.position).length}
                </div>
                <div className="text-sm text-slate-600">Avec poste défini</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {teachers.filter(t => t.degree).length}
                </div>
                <div className="text-sm text-slate-600">Diplômés</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case "donations":
        return <DonationsReceivedPage user={user} userType="ETABLISSEMENT" />;
      case "equipe":
        return renderTeamContent();
      case "activite":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Activité récente</h3>
              <p className="text-slate-500">Cette section affichera l'activité récente de votre établissement</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            {/* Bouton nouveau projet */}
            <Link href="/projects/new">
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Plus className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="font-semibold text-slate-800 mb-1">Publier un nouveau projet</div>
                <div className="text-sm text-slate-600">Partagez vos projets pour trouver des donateurs</div>
              </div>
            </Link>

            {loading && (
              <div className="mt-6 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Chargement de vos projets...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Erreur: {error}</span>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="mt-6 space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FolderOpen className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun projet publié</h3>
                    <p className="text-slate-500 mb-6">Commencez par créer votre premier projet pour attirer des donateurs</p>
                    <Link 
                      href="/projects/new"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                      Créer mon premier projet
                    </Link>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-semibold text-lg text-slate-800">{project.titre}</div>
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                              {getCategoryLabel(project.categorie)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {project.description}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              Réf: {project.reference}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(project.datePublication)}
                            </span>
                          </div>
                          
                          {project.photos && project.photos.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {project.photos.slice(0, 3).map((photo, index) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={photo} 
                                    alt="Photo du projet"
                                    className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                                  />
                                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              ))}
                              {project.photos.length > 3 && (
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200 flex flex-col items-center justify-center text-xs text-slate-600 font-semibold">
                                  <ImageIcon className="w-4 h-4 mb-1" />
                                  +{project.photos.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                            <Users className="w-4 h-4" />
                            {project.donCount} Don{project.donCount > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            {formatAmount(project.totalRaised)} Ar
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/projects/${project.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Détails
                          </Link>
                          <Link 
                            href={`/projects/${project.id}/edit`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-700 text-xs hover:bg-indigo-100 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Modifier
                          </Link>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingProject === project.id || project.donCount > 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 text-xs hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={project.donCount > 0 ? "Impossible de supprimer un projet avec des dons" : "Supprimer le projet"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingProject === project.id ? "..." : "Supprimer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Colonne gauche */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <AvatarDisplay
                name={etab?.nom ?? user.nom}
                avatar={user.avatar}
                size="lg"
                showBorder={true}
              />
            </div>
            
            <div className="mt-3 font-semibold text-slate-800">{etab?.nom ?? user.nom}</div>
            <div className="text-sm text-slate-500">
              {etab ? `${etab.type === "PUBLIC" ? "Établissement Public" : "Établissement Privé"}${etab.niveau ? " • " + etab.niveau : ""}` : user.typeProfil}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
                <div className="text-lg font-bold text-indigo-600">{loading ? "..." : stats.totalProjects}</div>
                <div className="text-xs text-slate-600">Projets</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3">
                <div className="text-lg font-bold text-green-600">
                  {loadingDonations ? "..." : donationStats?.donateurUniques || 0}
                </div>
                <div className="text-xs text-slate-600">Donateurs</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3">
                <div className="text-lg font-bold text-amber-600">
                  {loadingDonations ? "..." : formatAmount(donationStats?.totalMonetaire || 0)}
                </div>
                <div className="text-xs text-slate-600">Ar collectés</div>
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
            {[
              [<FileText className="w-4 h-4" />, "Mes Projets", () => setActiveTab("projets")],
              [<DollarSign className="w-4 h-4" />, "Donations Reçues", () => setActiveTab("donations")],
              [<CheckCircle className="w-4 h-4" />, "Valider enseignants", () => window.location.href = "/dashboard/admin/pending-teachers"],
              [<Users className="w-4 h-4" />, "Mon Équipe", () => setActiveTab("equipe")],
              [<MessageSquare className="w-4 h-4" />, "Messages", () => window.location.href = "/dashboard/messages"],
              [<Settings className="w-4 h-4" />, "Paramètres", () => window.location.href = "/dashboard/edit"],
            ].map(([icon, label, onClick], i) => (
              <button 
                key={i} 
                onClick={onClick as (() => void) || undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ${
                  (label === "Mes Projets" && activeTab === "projets") || 
                  (label === "Donations Reçues" && activeTab === "donations") ||
                  (label === "Mon Équipe" && activeTab === "equipe")
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                    : ""
                } ${!onClick ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={!onClick}
              >
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>

          <DonationsWidget userType="ETABLISSEMENT" />
        </aside>

        {/* Centre */}
        <main className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {activeTab === "projets" && "Mes Projets"}
                  {activeTab === "donations" && "Donations Reçues"}
                  {activeTab === "equipe" && "Mon Équipe"}
                  {activeTab === "activite" && "Activité"}
                </div>
                <div className="text-sm text-slate-600">
                  {activeTab === "projets" && "Gérez vos projets et suivez vos donations en temps réel"}
                  {activeTab === "donations" && "Suivez et confirmez les dons reçus"}
                  {activeTab === "equipe" && "Consultez et gérez votre équipe d'enseignants"}
                  {activeTab === "activite" && "Consultez l'activité récente de votre établissement"}
                </div>
              </div>
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-white/50 transition-colors"
                disabled={loading || loadingDonations || loadingTeachers}
              >
                <RefreshCw className={`w-4 h-4 ${(loading || loadingDonations || loadingTeachers) ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setActiveTab("projets")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === "projets" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Projets
              </button>
              <button 
                onClick={() => setActiveTab("donations")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === "donations" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Donations
              </button>
              <button 
                onClick={() => setActiveTab("equipe")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === "equipe" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <Users className="w-4 h-4" />
                Équipe
              </button>
              <button 
                onClick={() => setActiveTab("activite")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === "activite" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Activité
              </button>
            </div>
          </div>
          
          {renderMainContent()}
        </main>

        {/* Colonne droite */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 shadow-lg">
            <div className="flex items-center gap-2 font-semibold mb-4">
              <BarChart3 className="w-5 h-5" />
              Statistiques du mois
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">
                  {loading ? "..." : stats.totalProjects}
                </div>
                <div className="text-xs opacity-90">Projets actifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">
                  {loadingDonations ? "..." : donationStats?.thisMonth || 0}
                </div>
                <div className="text-xs opacity-90">Nouvelles donations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">
                  {loadingDonations ? "..." : formatAmount((donationStats?.montantThisMonth || 0)/1000000) + "M"}
                </div>
                <div className="text-xs opacity-90">Ar collectés ce mois</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">
                  {loadingTeachers ? "..." : teachers.length}
                </div>
                <div className="text-xs opacity-90">Enseignants</div>
              </div>
            </div>
          </div>

          {donationStats && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
                <DollarSign className="w-5 h-5 text-green-600" />
                Résumé financier
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-sm text-slate-600">Total collecté:</span>
                  <span className="font-semibold text-green-600">
                    {formatAmount(donationStats.totalMonetaire)} Ar
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    En attente:
                  </span>
                  <span className="font-semibold text-yellow-600">
                    {formatAmount(donationStats.montantEnAttente)} Ar
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-slate-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Reçu:
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {formatAmount(donationStats.montantRecu)} Ar
                  </span>
                </div>
                <hr className="my-2" />
                <div className="text-xs text-slate-500 flex items-center justify-center gap-2 bg-slate-50 p-2 rounded-lg">
                  <Target className="w-3.5 h-3.5" />
                  {donationStats.donationsMonetaires} dons monétaires • {donationStats.donationsVivres + donationStats.donationsMateriels} dons matériels
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Projets populaires
            </div>
            {!loading && projects.slice(0, 4).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2.5 border-b last:border-0 hover:bg-slate-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center text-xs font-semibold shadow-sm">
                    {project.titre.slice(0,2).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-slate-700 truncate max-w-[120px]">{project.titre}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {project.donCount}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center py-4 text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4 text-slate-800">
              <Target className="w-5 h-5 text-purple-600" />
              Actions rapides
            </div>
            <div className="flex flex-col gap-2">
              <Link 
                href="/projects/new" 
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </Link>
              <Link 
                href="/dashboard/admin/pending-teachers"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                Valider enseignants
              </Link>
              <button 
                onClick={() => setActiveTab("equipe")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <Users className="w-4 h-4" />
                Voir mon équipe
              </button>
              <Link
                href="/dashboard/edit"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg"
              >
                <Settings className="w-4 h-4" />
                Paramètres
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}