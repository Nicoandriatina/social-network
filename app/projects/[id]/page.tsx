// "use client";

// // Fonctions de navigation simulées
//   const goBack = () => {
//     console.log("Navigation retour");
//     // Dans une vraie app Next.js: router.back()
//   };

//   const goToEdit = () => {
//     console.log(`Navigation vers édition du projet ${projectId}`);
//     // Dans une vraie app Next.js: router.push(`/projects/${projectId}/edit`)
//   };

// import { useState, useEffect } from 'react';
// import { ArrowLeft, Calendar, MapPin, User, Edit, Share2, Heart, DollarSign } from 'lucide-react';

// // Mock hook pour les détails du projet
// const useProjectDetails = (projectId) => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Simulation d'un appel API
//     const fetchProject = async () => {
//       try {
//         setLoading(true);
//         // Simulation de données
//         setTimeout(() => {
//           setProject({
//             id: projectId,
//             reference: "REF-202409-001",
//             titre: "Rénovation de la bibliothèque scolaire",
//             description: "Ce projet vise à rénover entièrement notre bibliothèque scolaire pour offrir un environnement d'apprentissage moderne et stimulant à nos 1 200 élèves.\n\nLes travaux incluent :\n- Réfection complète des sols et des murs\n- Installation d'un nouveau système d'éclairage LED\n- Mise en place d'espaces de travail collaboratif\n- Acquisition de mobilier ergonomique\n- Création d'un espace numérique avec 20 ordinateurs\n\nCe projet bénéficiera directement à tous nos élèves et contribuera à améliorer leurs résultats scolaires.",
//             categorie: "REHABILITATION",
//             photos: [
//               "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
//               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
//               "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&fit=crop"
//             ],
//             datePublication: "2024-09-15T10:00:00Z",
//             dateDebut: "2024-11-01T00:00:00Z",
//             dateFin: "2024-12-15T00:00:00Z",
//             createdAt: "2024-09-15T10:00:00Z",
//             updatedAt: "2024-09-18T14:30:00Z",
//             auteur: {
//               id: "1",
//               fullName: "Marie Rakotomalala",
//               avatar: null,
//               email: "marie.rakoto@lycee-antananarivo.mg"
//             },
//             etablissement: {
//               id: "1",
//               nom: "Lycée Antananarivo",
//               type: "PUBLIC",
//               niveau: "LYCEE",
//               adresse: "Avenue de l'Indépendance, Antananarivo 101"
//             },
//             dons: [
//               {
//                 id: "1",
//                 libelle: "Don pour matériel informatique",
//                 type: "MONETAIRE",
//                 quantite: null,
//                 statut: "RECEPTIONNE",
//                 dateEnvoi: "2024-09-16T09:00:00Z",
//                 dateReception: "2024-09-17T14:00:00Z",
//                 createdAt: "2024-09-16T09:00:00Z",
//                 donateur: {
//                   id: "101",
//                   fullName: "Jean Randrianarison",
//                   avatar: null
//                 }
//               },
//               {
//                 id: "2",
//                 libelle: "Fournitures scolaires",
//                 type: "NON_VIVRES",
//                 quantite: 50,
//                 statut: "EN_ATTENTE",
//                 dateEnvoi: null,
//                 dateReception: null,
//                 createdAt: "2024-09-17T11:30:00Z",
//                 donateur: {
//                   id: "102",
//                   fullName: "Entreprise TechMada",
//                   avatar: null
//                 }
//               },
//               {
//                 id: "3",
//                 libelle: "Contribution pour travaux",
//                 type: "MONETAIRE",
//                 quantite: null,
//                 statut: "ENVOYE",
//                 dateEnvoi: "2024-09-18T08:00:00Z",
//                 dateReception: null,
//                 createdAt: "2024-09-18T08:00:00Z",
//                 donateur: {
//                   id: "103",
//                   fullName: "Association des Parents d'Élèves",
//                   avatar: null
//                 }
//               }
//             ],
//             stats: {
//               donCount: 3,
//               totalRaised: 2500000,
//               uniqueDonors: 3
//             }
//           });
//           setLoading(false);
//         }, 1000);
//       } catch (err) {
//         setError("Erreur lors du chargement");
//         setLoading(false);
//       }
//     };

//     if (projectId) {
//       fetchProject();
//     }
//   }, [projectId]);

//   const refreshProject = () => {
//     // Fonction pour rafraîchir les données
//     console.log("Rafraîchissement du projet");
//   };

//   return { project, loading, error, refreshProject };
// };

// const ProjectDetailsPage = ({ projectId = "1" } = {}) => {
//   const { project, loading, error, updateProject, refreshProject } = useProjectDetails(projectId);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // Fonctions de navigation adaptées pour la vraie app
//   const goBack = () => {
//     // Dans votre vraie app Next.js, utilisez:
//     // const router = useRouter();
//     // router.back();
//     console.log("Navigation retour vers le dashboard");
//     window.location.href = "/dashboard"; // Fallback temporaire
//   };

//   const goToEdit = () => {
//     // Dans votre vraie app Next.js, utilisez:
//     // const router = useRouter();
//     // router.push(`/projects/${projectId}/edit`);
//     console.log(`Navigation vers édition du projet ${projectId}`);
//     window.location.href = `/projects/${projectId}/edit`; // Fallback temporaire
//   };

//   // Fonction pour formater les montants
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('fr-MG', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Fonction pour formater les dates
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   // Fonction pour obtenir le label de la catégorie
//   const getCategoryLabel = (category: string) => {
//     const labels: Record<string, string> = {
//       'CONSTRUCTION': 'Construction',
//       'REHABILITATION': 'Réhabilitation', 
//       'AUTRES': 'Autres'
//     };
//     return labels[category] || category;
//   };

//   // Fonction pour obtenir le statut du don
//   const getDonStatus = (statut: string) => {
//     const statusLabels: Record<string, { label: string; color: string }> = {
//       'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
//       'ENVOYE': { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
//       'RECEPTIONNE': { label: 'Reçu', color: 'bg-green-100 text-green-800' }
//     };
//     return statusLabels[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement du projet...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={goBack}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Retour
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!project) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
//       {/* Header */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={goBack}
//               className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Retour
//             </button>
//             <div>
//               <h1 className="text-xl font-bold text-gray-800">Détails du projet</h1>
//               <p className="text-sm text-gray-500">{project.reference}</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={goToEdit}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               <Edit className="w-4 h-4" />
//               Modifier
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//               <Share2 className="w-4 h-4" />
//               Partager
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Photos du projet */}
//             {project.photos && project.photos.length > 0 && (
//               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
//                 <div className="aspect-video bg-gray-100 relative">
//                   <img
//                     src={project.photos[selectedImageIndex]}
//                     alt="Photo du projet"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {project.photos.length > 1 && (
//                   <div className="p-4 flex gap-2 overflow-x-auto">
//                     {project.photos.map((photo, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedImageIndex(index)}
//                         className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
//                           selectedImageIndex === index ? 'border-indigo-500' : 'border-gray-200'
//                         }`}
//                       >
//                         <img
//                           src={photo}
//                           alt={`Photo ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Informations principales */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <h2 className="text-3xl font-bold text-gray-800">{project.titre}</h2>
//                     <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
//                       {getCategoryLabel(project.categorie)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-6 text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       Publié le {formatDate(project.datePublication)}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-4 h-4" />
//                       {project.etablissement.adresse || 'Non spécifié'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="prose max-w-none">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
//                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                   {project.description}
//                 </p>
//               </div>

//               {/* Dates du projet */}
//               {(project.dateDebut || project.dateFin) && (
//                 <div className="mt-8 p-6 bg-gray-50 rounded-xl">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Planification</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {project.dateDebut && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Date de début</label>
//                         <div className="text-gray-800 font-medium">
//                           {formatDate(project.dateDebut)}
//                         </div>
//                       </div>
//                     )}
//                     {project.dateFin && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Date de fin</label>
//                         <div className="text-gray-800 font-medium">
//                           {formatDate(project.dateFin)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Donations reçues */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-8">
//               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                 <Heart className="w-5 h-5 text-red-500" />
//                 Donations reçues ({project.dons.length})
//               </h3>
              
//               {project.dons.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-4xl mb-2">💝</div>
//                   <p className="text-gray-500">Aucune donation pour le moment</p>
//                   <p className="text-sm text-gray-400">Soyez patient, les donateurs vont bientôt contribuer!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {project.dons.map((don) => {
//                     const status = getDonStatus(don.statut);
//                     return (
//                       <div key={don.id} className="border border-gray-200 rounded-xl p-4">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                               <span className="text-indigo-600 text-xs font-semibold">
//                                 {don.donateur.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
//                               </span>
//                             </div>
//                             <div>
//                               <div className="font-medium text-gray-800">{don.donateur.fullName}</div>
//                               <div className="text-sm text-gray-600 mt-1">{don.libelle}</div>
//                               <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
//                                 <span>Type: {don.type}</span>
//                                 {don.quantite && <span>• Quantité: {don.quantite}</span>}
//                                 <span>• {formatDate(don.createdAt)}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
//                             {status.label}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Statistiques */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-xs">👥</span>
//                     </div>
//                     <span className="text-sm font-medium">Donateurs</span>
//                   </div>
//                   <span className="font-bold text-indigo-600">{project.stats.uniqueDonors}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                       <DollarSign className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-sm font-medium">Collecté</span>
//                   </div>
//                   <span className="font-bold text-green-600">{formatAmount(project.stats.totalRaised)} Ar</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-xs">💝</span>
//                     </div>
//                     <span className="text-sm font-medium">Total dons</span>
//                   </div>
//                   <span className="font-bold text-purple-600">{project.stats.donCount}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Informations sur l'établissement */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Établissement
//               </h3>
//               <div className="space-y-3">
//                 <div>
//                   <div className="text-sm text-gray-500">Nom</div>
//                   <div className="font-medium text-gray-800">{project.etablissement.nom}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500">Type</div>
//                   <div className="font-medium text-gray-800">
//                     {project.etablissement.type === 'PUBLIC' ? 'Public' : 'Privé'} • {project.etablissement.niveau}
//                   </div>
//                 </div>
//                 {project.etablissement.adresse && (
//                   <div>
//                     <div className="text-sm text-gray-500">Adresse</div>
//                     <div className="font-medium text-gray-800">{project.etablissement.adresse}</div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-sm text-gray-500">Responsable</div>
//                   <div className="font-medium text-gray-800">{project.auteur.fullName}</div>
//                   <div className="text-sm text-gray-500">{project.auteur.email}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions rapides */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
//               <div className="space-y-3">
//                 <button 
//                   onClick={goToEdit}
//                   className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <Edit className="w-4 h-4" />
//                   Modifier le projet
//                 </button>
//                 <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                   Télécharger le rapport
//                 </button>
//                 <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                   Contacter les donateurs
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default ProjectDetailsPage;
// "use client";
// // Fonctions de navigation simulées
//   const goBack = () => {
//     console.log("Navigation retour");
//     // Dans une vraie app Next.js: router.back()
//   };

//   const goToEdit = () => {
//     console.log(`Navigation vers édition du projet ${projectId}`);
//     // Dans une vraie app Next.js: router.push(`/projects/${projectId}/edit`)
//   };

// import { useState, useEffect } from 'react';
// import { ArrowLeft, Calendar, MapPin, User, Edit, Share2, Heart, DollarSign } from 'lucide-react';

// // Vrai hook utilisant votre API existante
// const useProjectDetails = (projectId) => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchProjectDetails = async () => {
//     if (!projectId) {
//       setError("ID du projet requis");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       // Appel réel à votre API
//       const response = await fetch(`/api/projects/${projectId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('Projet non trouvé');
//         }
//         if (response.status === 401) {
//           throw new Error('Vous devez être connecté pour voir ce projet');
//         }
//         throw new Error('Erreur lors de la récupération du projet');
//       }

//       const data = await response.json();
//       setProject(data.project);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Une erreur est survenue');
//       console.error('Erreur lors de la récupération des détails du projet:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProject = async (updateData) => {
//     try {
//       const response = await fetch(`/api/projects/${projectId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.error || 'Erreur lors de la modification');
//       }

//       // Rafraîchir les détails du projet après modification
//       await fetchProjectDetails();
      
//       return { success: true };
//     } catch (err) {
//       throw new Error(err instanceof Error ? err.message : 'Erreur lors de la modification');
//     }
//   };

//   const refreshProject = () => {
//     fetchProjectDetails();
//   };

//   useEffect(() => {
//     fetchProjectDetails();
//   }, [projectId]);

//   return {
//     project,
//     loading,
//     error,
//     updateProject,
//     refreshProject
//   };
// };

// const ProjectDetailsPage = ({ projectId = "1" } = {}) => {
//   const { project, loading, error, updateProject, refreshProject } = useProjectDetails(projectId);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // Fonctions de navigation adaptées pour la vraie app
//   const goBack = () => {
//     // Dans votre vraie app Next.js, utilisez:
//     // const router = useRouter();
//     // router.back();
//     console.log("Navigation retour vers le dashboard");
//     window.location.href = "/dashboard"; // Fallback temporaire
//   };

//   const goToEdit = () => {
//     // Dans votre vraie app Next.js, utilisez:
//     // const router = useRouter();
//     // router.push(`/projects/${projectId}/edit`);
//     console.log(`Navigation vers édition du projet ${projectId}`);
//     window.location.href = `/projects/${projectId}/edit`; // Fallback temporaire
//   };

//   // Fonction pour formater les montants
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('fr-MG', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   // Fonction pour formater les dates
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     });
//   };

//   // Fonction pour obtenir le label de la catégorie
//   const getCategoryLabel = (category: string) => {
//     const labels: Record<string, string> = {
//       'CONSTRUCTION': 'Construction',
//       'REHABILITATION': 'Réhabilitation', 
//       'AUTRES': 'Autres'
//     };
//     return labels[category] || category;
//   };

//   // Fonction pour obtenir le statut du don
//   const getDonStatus = (statut: string) => {
//     const statusLabels: Record<string, { label: string; color: string }> = {
//       'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
//       'ENVOYE': { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
//       'RECEPTIONNE': { label: 'Reçu', color: 'bg-green-100 text-green-800' }
//     };
//     return statusLabels[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement du projet...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={goBack}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Retour
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!project) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
//       {/* Header */}
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={goBack}
//               className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Retour
//             </button>
//             <div>
//               <h1 className="text-xl font-bold text-gray-800">Détails du projet</h1>
//               <p className="text-sm text-gray-500">{project.reference}</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button
//               onClick={goToEdit}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               <Edit className="w-4 h-4" />
//               Modifier
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//               <Share2 className="w-4 h-4" />
//               Partager
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Photos du projet */}
//             {project.photos && project.photos.length > 0 && (
//               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
//                 <div className="aspect-video bg-gray-100 relative">
//                   <img
//                     src={project.photos[selectedImageIndex]}
//                     alt="Photo du projet"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {project.photos.length > 1 && (
//                   <div className="p-4 flex gap-2 overflow-x-auto">
//                     {project.photos.map((photo, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedImageIndex(index)}
//                         className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
//                           selectedImageIndex === index ? 'border-indigo-500' : 'border-gray-200'
//                         }`}
//                       >
//                         <img
//                           src={photo}
//                           alt={`Photo ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Informations principales */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-8">
//               <div className="flex items-start justify-between mb-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-2">
//                     <h2 className="text-3xl font-bold text-gray-800">{project.titre}</h2>
//                     <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
//                       {getCategoryLabel(project.categorie)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-6 text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       Publié le {formatDate(project.datePublication)}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-4 h-4" />
//                       {project.etablissement.adresse || 'Non spécifié'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="prose max-w-none">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
//                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                   {project.description}
//                 </p>
//               </div>

//               {/* Dates du projet */}
//               {(project.dateDebut || project.dateFin) && (
//                 <div className="mt-8 p-6 bg-gray-50 rounded-xl">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Planification</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {project.dateDebut && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Date de début</label>
//                         <div className="text-gray-800 font-medium">
//                           {formatDate(project.dateDebut)}
//                         </div>
//                       </div>
//                     )}
//                     {project.dateFin && (
//                       <div>
//                         <label className="text-sm font-medium text-gray-500">Date de fin</label>
//                         <div className="text-gray-800 font-medium">
//                           {formatDate(project.dateFin)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Donations reçues */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-8">
//               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//                 <Heart className="w-5 h-5 text-red-500" />
//                 Donations reçues ({project.dons.length})
//               </h3>
              
//               {project.dons.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-4xl mb-2">💝</div>
//                   <p className="text-gray-500">Aucune donation pour le moment</p>
//                   <p className="text-sm text-gray-400">Soyez patient, les donateurs vont bientôt contribuer!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {project.dons.map((don) => {
//                     const status = getDonStatus(don.statut);
//                     return (
//                       <div key={don.id} className="border border-gray-200 rounded-xl p-4">
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                               <span className="text-indigo-600 text-xs font-semibold">
//                                 {don.donateur.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
//                               </span>
//                             </div>
//                             <div>
//                               <div className="font-medium text-gray-800">{don.donateur.fullName}</div>
//                               <div className="text-sm text-gray-600 mt-1">{don.libelle}</div>
//                               <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
//                                 <span>Type: {don.type}</span>
//                                 {don.quantite && <span>• Quantité: {don.quantite}</span>}
//                                 <span>• {formatDate(don.createdAt)}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
//                             {status.label}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Statistiques */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-xs">👥</span>
//                     </div>
//                     <span className="text-sm font-medium">Donateurs</span>
//                   </div>
//                   <span className="font-bold text-indigo-600">{project.stats.uniqueDonors}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//                       <DollarSign className="w-4 h-4 text-white" />
//                     </div>
//                     <span className="text-sm font-medium">Collecté</span>
//                   </div>
//                   <span className="font-bold text-green-600">{formatAmount(project.stats.totalRaised)} Ar</span>
//                 </div>
                
//                 <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
//                       <span className="text-white text-xs">💝</span>
//                     </div>
//                     <span className="text-sm font-medium">Total dons</span>
//                   </div>
//                   <span className="font-bold text-purple-600">{project.stats.donCount}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Informations sur l'établissement */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Établissement
//               </h3>
//               <div className="space-y-3">
//                 <div>
//                   <div className="text-sm text-gray-500">Nom</div>
//                   <div className="font-medium text-gray-800">{project.etablissement.nom}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500">Type</div>
//                   <div className="font-medium text-gray-800">
//                     {project.etablissement.type === 'PUBLIC' ? 'Public' : 'Privé'} • {project.etablissement.niveau}
//                   </div>
//                 </div>
//                 {project.etablissement.adresse && (
//                   <div>
//                     <div className="text-sm text-gray-500">Adresse</div>
//                     <div className="font-medium text-gray-800">{project.etablissement.adresse}</div>
//                   </div>
//                 )}
//                 <div>
//                   <div className="text-sm text-gray-500">Responsable</div>
//                   <div className="font-medium text-gray-800">{project.auteur.fullName}</div>
//                   <div className="text-sm text-gray-500">{project.auteur.email}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions rapides */}
//             <div className="bg-white rounded-2xl border border-slate-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
//               <div className="space-y-3">
//                 <button 
//                   onClick={goToEdit}
//                   className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <Edit className="w-4 h-4" />
//                   Modifier le projet
//                 </button>
//                 <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                   Télécharger le rapport
//                 </button>
//                 <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
//                   Contacter les donateurs
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetailsPage;
"use client";
// Fonctions de navigation simulées
  const goBack = () => {
    console.log("Navigation retour");
    // Dans une vraie app Next.js: router.back()
  };

  const goToEdit = () => {
    console.log(`Navigation vers édition du projet ${projectId}`);
    // Dans une vraie app Next.js: router.push(`/projects/${projectId}/edit`)
  };

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Edit, Share2, Heart, DollarSign } from 'lucide-react';

// Vrai hook utilisant votre API existante
const useProjectDetails = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectDetails = async () => {
    if (!projectId) {
      setError("ID du projet requis");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Appel réel à votre API
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet non trouvé');
        }
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour voir ce projet');
        }
        throw new Error('Erreur lors de la récupération du projet');
      }

      const data = await response.json();
      setProject(data.project);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des détails du projet:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updateData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la modification');
      }

      // Rafraîchir les détails du projet après modification
      await fetchProjectDetails();
      
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const refreshProject = () => {
    fetchProjectDetails();
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    updateProject,
    refreshProject
  };
};

const ProjectDetailsPage = ({ projectId } = {}) => {
  // Si aucun projectId n'est passé, essayer de le récupérer depuis l'URL
  const actualProjectId = projectId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
  
  const { project, loading, error, updateProject, refreshProject } = useProjectDetails(actualProjectId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fonctions de navigation adaptées pour la vraie app
  const goBack = () => {
    // Dans votre vraie app Next.js, utilisez:
    // const router = useRouter();
    // router.back();
    console.log("Navigation retour vers le dashboard");
    window.location.href = "/dashboard"; // Fallback temporaire
  };

  const goToEdit = () => {
    // Dans votre vraie app Next.js, utilisez:
    // const router = useRouter();
    // router.push(`/projects/${projectId}/edit`);
    console.log(`Navigation vers édition du projet ${projectId}`);
    window.location.href = `/projects/${project.id}/edit`; // Fallback temporaire
  };

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir le label de la catégorie
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'CONSTRUCTION': 'Construction',
      'REHABILITATION': 'Réhabilitation', 
      'AUTRES': 'Autres'
    };
    return labels[category] || category;
  };

  // Fonction pour obtenir le statut du don
  const getDonStatus = (statut: string) => {
    const statusLabels: Record<string, { label: string; color: string }> = {
      'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      'ENVOYE': { label: 'Envoyé', color: 'bg-blue-100 text-blue-800' },
      'RECEPTIONNE': { label: 'Reçu', color: 'bg-green-100 text-green-800' }
    };
    return statusLabels[statut] || { label: statut, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={goBack}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Détails du projet</h1>
              <p className="text-sm text-gray-500">{project.reference}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={goToEdit}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photos du projet */}
            {project.photos && project.photos.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={project.photos[selectedImageIndex]}
                    alt="Photo du projet"
                    className="w-full h-full object-cover"
                  />
                </div>
                {project.photos.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {project.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                          selectedImageIndex === index ? 'border-indigo-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Informations principales */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-800">{project.titre}</h2>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                      {getCategoryLabel(project.categorie)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Publié le {formatDate(project.datePublication)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.etablissement.adresse || 'Non spécifié'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {/* Dates du projet */}
              {(project.dateDebut || project.dateFin) && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Planification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.dateDebut && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date de début</label>
                        <div className="text-gray-800 font-medium">
                          {formatDate(project.dateDebut)}
                        </div>
                      </div>
                    )}
                    {project.dateFin && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date de fin</label>
                        <div className="text-gray-800 font-medium">
                          {formatDate(project.dateFin)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Donations reçues */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Donations reçues ({project.dons.length})
              </h3>
              
              {project.dons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">💝</div>
                  <p className="text-gray-500">Aucune donation pour le moment</p>
                  <p className="text-sm text-gray-400">Soyez patient, les donateurs vont bientôt contribuer!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.dons.map((don) => {
                    const status = getDonStatus(don.statut);
                    return (
                      <div key={don.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 text-xs font-semibold">
                                {don.donateur.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{don.donateur.fullName}</div>
                              <div className="text-sm text-gray-600 mt-1">{don.libelle}</div>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <span>Type: {don.type}</span>
                                {don.quantite && <span>• Quantité: {don.quantite}</span>}
                                <span>• {formatDate(don.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">👥</span>
                    </div>
                    <span className="text-sm font-medium">Donateurs</span>
                  </div>
                  <span className="font-bold text-indigo-600">{project.stats.uniqueDonors}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Collecté</span>
                  </div>
                  <span className="font-bold text-green-600">{formatAmount(project.stats.totalRaised)} Ar</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">💝</span>
                    </div>
                    <span className="text-sm font-medium">Total dons</span>
                  </div>
                  <span className="font-bold text-purple-600">{project.stats.donCount}</span>
                </div>
              </div>
            </div>

            {/* Informations sur l'établissement */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Établissement
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Nom</div>
                  <div className="font-medium text-gray-800">{project.etablissement.nom}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium text-gray-800">
                    {project.etablissement.type === 'PUBLIC' ? 'Public' : 'Privé'} • {project.etablissement.niveau}
                  </div>
                </div>
                {project.etablissement.adresse && (
                  <div>
                    <div className="text-sm text-gray-500">Adresse</div>
                    <div className="font-medium text-gray-800">{project.etablissement.adresse}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-500">Responsable</div>
                  <div className="font-medium text-gray-800">{project.auteur.fullName}</div>
                  <div className="text-sm text-gray-500">{project.auteur.email}</div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={goToEdit}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier le projet
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Télécharger le rapport
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Contacter les donateurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;