// "use client";

// import Link from "next/link";
// import React, { useState } from "react";
// import { Upload, Briefcase, GraduationCap, Award, Plus, Trash2, Save, X, FileText, Loader2 } from "lucide-react";
// import { useTeacherProfile } from "@/lib/hooks/useTeacherProfile";
// import { AvatarDisplay } from "@/components/AvatarDisplay";

// type EnseignantDashboardProps = {
//   user: {
//     fullName?: string | null;
//     profession?: string | null;
//     avatar?: string | null;
//     isValidated?: boolean;
//     etablissement?: {
//       nom: string;
//       type?: string | null;
//       niveau?: string | null;
//     } | null;
//     _stats?: {
//       recoCount: number;
//       projetsParticipe: number;
//       donsRecus: number;
//     };
//   };
// };

// export default function EnseignantDashboard({ user }: EnseignantDashboardProps) {
//   const {
//     experiences,
//     formations,
//     certifications,
//     loading,
//     addExperience,
//     deleteExperience,
//     addFormation,
//     deleteFormation,
//     addCertification,
//     deleteCertification,
//     uploadCV,
//     confirmCVData
//   } = useTeacherProfile();

//   const [activeView, setActiveView] = useState<"parcours" | "dons" | "activite">("parcours");
//   const [showUploadCV, setShowUploadCV] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [cvAnalysis, setCvAnalysis] = useState<any>(null);
//   const [showPreview, setShowPreview] = useState(false);
  
//   // Formulaires d'ajout manuel
//   const [showNewExpForm, setShowNewExpForm] = useState(false);
//   const [showNewFormForm, setShowNewFormForm] = useState(false);
//   const [showNewCertForm, setShowNewCertForm] = useState(false);

//   const [newExp, setNewExp] = useState({
//     poste: "",
//     etablissement: "",
//     debut: "",
//     fin: "",
//     enCours: false,
//     description: ""
//   });

//   const [newForm, setNewForm] = useState({
//     diplome: "",
//     etablissement: "",
//     annee: "",
//     description: ""
//   });

//   const [newCert, setNewCert] = useState({
//     titre: "",
//     organisme: "",
//     date: "",
//     lien: ""
//   });

//   const stats = user._stats || {
//     recoCount: 12,
//     projetsParticipe: 5,
//     donsRecus: 4,
//   };

//   // === GESTION DES EXPÉRIENCES ===
//   const handleAddExperience = async () => {
//     if (!newExp.poste || !newExp.etablissement || !newExp.debut) {
//       alert("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     try {
//       await addExperience({
//         poste: newExp.poste,
//         etablissement: newExp.etablissement,
//         debut: newExp.debut,
//         fin: newExp.enCours ? undefined : newExp.fin,
//         enCours: newExp.enCours,
//         description: newExp.description
//       });
      
//       setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
//       setShowNewExpForm(false);
//       alert("✅ Expérience ajoutée !");
//     } catch (error) {
//       alert("❌ Erreur lors de l'ajout");
//     }
//   };

//   // === GESTION DES FORMATIONS ===
//   const handleAddFormation = async () => {
//     if (!newForm.diplome || !newForm.etablissement || !newForm.annee) {
//       alert("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     try {
//       await addFormation({
//         diplome: newForm.diplome,
//         etablissement: newForm.etablissement,
//         annee: newForm.annee,
//         description: newForm.description || undefined
//       });
      
//       setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
//       setShowNewFormForm(false);
//       alert("✅ Formation ajoutée !");
//     } catch (error) {
//       alert("❌ Erreur lors de l'ajout");
//     }
//   };

//   // === GESTION DES CERTIFICATIONS ===
//   const handleAddCertification = async () => {
//     if (!newCert.titre || !newCert.organisme || !newCert.date) {
//       alert("Veuillez remplir tous les champs obligatoires");
//       return;
//     }

//     try {
//       await addCertification({
//         titre: newCert.titre,
//         organisme: newCert.organisme,
//         date: newCert.date,
//         lien: newCert.lien || undefined
//       });
      
//       setNewCert({ titre: "", organisme: "", date: "", lien: "" });
//       setShowNewCertForm(false);
//       alert("✅ Certification ajoutée !");
//     } catch (error) {
//       alert("❌ Erreur lors de l'ajout");
//     }
//   };

//   // === GESTION CV ===
//   const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     console.log("📄 Fichier sélectionné:", file.name, file.type, file.size);

//     setUploading(true);
//     try {
//       console.log("🚀 Début uploadCV..."); 
//       const result = await uploadCV(file);
//       console.log("✅ Résultat uploadCV:", result);
//       setCvAnalysis(result.data);
//       setShowUploadCV(false);
//       setShowPreview(true);
//     } catch (error: any) {
//       console.error("❌ Erreur:", error);
//       alert(error.message || "❌ Erreur lors de l'analyse du CV");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleConfirmCV = async () => {
//     if (!cvAnalysis) return;

//     try {
//       await confirmCVData({
//         experiences: cvAnalysis.experiences,
//         formations: cvAnalysis.formations,
//         certifications: cvAnalysis.certifications,
//         replaceExisting: false
//       });
      
//       setShowPreview(false);
//       setCvAnalysis(null);
//       alert("✅ Profil mis à jour avec succès !");
//     } catch (error) {
//       alert("❌ Erreur lors de la sauvegarde");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
//       <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        
//         {/* LEFT SIDEBAR */}
//         <aside className="hidden lg:flex flex-col gap-6">
//           {/* Profil enseignant avec Avatar */}
//           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//             {/* Avatar */}
//             <div className="flex justify-center mb-3">
//               <AvatarDisplay
//                 name={user.fullName || "Enseignant"}
//                 avatar={user.avatar}
//                 size="lg"
//                 showBorder={true}
//               />
//             </div>
            
//             <div className="text-center mt-3">
//               <h3 className="font-semibold text-slate-800">
//                 {user.fullName || "Enseignant(e)"}
//               </h3>
//               <p className="text-sm text-slate-500">
//                 {user.profession || "Personnel éducatif"}
//               </p>
//               <p className="text-xs text-slate-500 mt-1">
//                 {user.etablissement
//                   ? `${user.etablissement.nom} • ${user.etablissement.type ?? ""} ${user.etablissement.niveau ? `• ${user.etablissement.niveau}` : ""}`
//                   : "Établissement non renseigné"}
//               </p>

//               <div
//                 className={`inline-flex items-center gap-2 mt-3 px-2.5 py-1 rounded-full text-xs font-medium ${
//                   user.isValidated
//                     ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
//                     : "bg-amber-50 text-amber-600 border border-amber-200"
//                 }`}
//               >
//                 {user.isValidated ? "✅ Validé par l'établissement" : "⏳ En attente de validation"}
//               </div>
//             </div>

//             {/* Stats avec parcours */}
//             <div className="grid grid-cols-3 gap-3 mt-5">
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {experiences.length}
//                 </div>
//                 <div className="text-xs text-slate-500">Expériences</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {formations.length}
//                 </div>
//                 <div className="text-xs text-slate-500">Formations</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-base font-semibold text-slate-800">
//                   {certifications.length}
//                 </div>
//                 <div className="text-xs text-slate-500">Certifications</div>
//               </div>
//             </div>

//             {/* Bouton Import CV */}
//             <button
//               onClick={() => setShowUploadCV(true)}
//               className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
//             >
//               <Upload className="w-4 h-4" />
//               Importer CV
//             </button>
//           </div>

//           {/* Menu */}
//           <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
//             <ul className="space-y-1 text-sm">
//               <li>
//                 <button 
//                   onClick={() => setActiveView("parcours")}
//                   className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "parcours" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
//                 >
//                   👤 Mon Parcours
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveView("dons")}
//                   className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "dons" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
//                 >
//                   💝 Dons reçus
//                 </button>
//               </li>
//               <li>
//                 <button 
//                   onClick={() => setActiveView("activite")}
//                   className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "activite" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
//                 >
//                   🧩 Projets participés
//                 </button>
//               </li>
//               <li>
//                 <Link href="/dashboard/messages">
//                   <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                     💬 Messages
//                   </button>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/dashboard/edit">
//                   <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
//                     ⚙️ Paramètres
//                   </button>
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* MAIN FEED */}
//         <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//           {/* Header / Tabs */}
//           <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
//             <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
//             <p className="text-sm text-slate-500">
//               Valorisez votre parcours et suivez vos interactions
//             </p>

//             <div className="flex gap-2 mt-4">
//               <button 
//                 onClick={() => setActiveView("parcours")}
//                 className={`px-3 py-2 text-sm rounded-xl ${activeView === "parcours" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
//               >
//                 🧭 Parcours
//               </button>
//               <button 
//                 onClick={() => setActiveView("dons")}
//                 className={`px-3 py-2 text-sm rounded-xl ${activeView === "dons" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
//               >
//                 💝 Dons reçus
//               </button>
//               <button 
//                 onClick={() => setActiveView("activite")}
//                 className={`px-3 py-2 text-sm rounded-xl ${activeView === "activite" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
//               >
//                 📈 Activité
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            
//             {/* Vue Parcours */}
//             {activeView === "parcours" && (
//               <div className="space-y-6">
//                 {/* Section Expériences */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-semibold text-slate-800 flex items-center gap-2">
//                       <Briefcase className="w-5 h-5 text-indigo-600" />
//                       Expériences professionnelles
//                     </h3>
//                     <button
//                       onClick={() => setShowNewExpForm(!showNewExpForm)}
//                       className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Ajouter
//                     </button>
//                   </div>

//                   {showNewExpForm && (
//                     <div className="bg-indigo-50 rounded-xl p-4 mb-4 border border-indigo-200">
//                       <h4 className="font-medium text-slate-800 mb-3 text-sm">Nouvelle expérience</h4>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="Poste *"
//                           value={newExp.poste}
//                           onChange={(e) => setNewExp({ ...newExp, poste: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Établissement *"
//                           value={newExp.etablissement}
//                           onChange={(e) => setNewExp({ ...newExp, etablissement: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="month"
//                           value={newExp.debut}
//                           onChange={(e) => setNewExp({ ...newExp, debut: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                           placeholder="Date de début *"
//                         />
//                         <input
//                           type="month"
//                           value={newExp.fin}
//                           onChange={(e) => setNewExp({ ...newExp, fin: e.target.value })}
//                           disabled={newExp.enCours}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm disabled:bg-slate-100"
//                           placeholder="Date de fin"
//                         />
//                       </div>
//                       <label className="flex items-center gap-2 mt-2 text-sm">
//                         <input
//                           type="checkbox"
//                           checked={newExp.enCours}
//                           onChange={(e) => setNewExp({ ...newExp, enCours: e.target.checked, fin: "" })}
//                           className="w-4 h-4"
//                         />
//                         <span className="text-slate-600">Poste actuel</span>
//                       </label>
//                       <textarea
//                         placeholder="Description..."
//                         value={newExp.description}
//                         onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
//                         className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20"
//                       />
//                       <div className="flex gap-2 mt-3">
//                         <button
//                           onClick={handleAddExperience}
//                           className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
//                         >
//                           <Save className="w-4 h-4" />
//                           Enregistrer
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowNewExpForm(false);
//                             setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
//                           }}
//                           className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
//                         >
//                           Annuler
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {loading ? (
//                     <div className="text-center py-8">
//                       <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
//                     </div>
//                   ) : experiences.length === 0 ? (
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
//                       <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//                       <p className="text-slate-500 text-sm">Aucune expérience ajoutée</p>
//                       <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {experiences.map((exp) => (
//                         <div key={exp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-slate-800">{exp.poste}</h4>
//                               <p className="text-sm text-slate-600">{exp.etablissement}</p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {new Date(exp.debut).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
//                                 {" - "}
//                                 {exp.enCours ? "Aujourd'hui" : exp.fin ? new Date(exp.fin).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : ""}
//                               </p>
//                               {exp.description && (
//                                 <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => {
//                                 if (confirm("Supprimer cette expérience ?")) {
//                                   deleteExperience(exp.id);
//                                 }
//                               }}
//                               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Section Formations */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-semibold text-slate-800 flex items-center gap-2">
//                       <GraduationCap className="w-5 h-5 text-emerald-600" />
//                       Formations académiques
//                     </h3>
//                     <button
//                       onClick={() => setShowNewFormForm(!showNewFormForm)}
//                       className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Ajouter
//                     </button>
//                   </div>

//                   {showNewFormForm && (
//                     <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
//                       <h4 className="font-medium text-slate-800 mb-3 text-sm">Nouvelle formation</h4>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="Diplôme *"
//                           value={newForm.diplome}
//                           onChange={(e) => setNewForm({ ...newForm, diplome: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Établissement *"
//                           value={newForm.etablissement}
//                           onChange={(e) => setNewForm({ ...newForm, etablissement: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="number"
//                           placeholder="Année *"
//                           value={newForm.annee}
//                           onChange={(e) => setNewForm({ ...newForm, annee: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                           min="1950"
//                           max="2030"
//                         />
//                       </div>
//                       <textarea
//                         placeholder="Description (mention, spécialisation...)"
//                         value={newForm.description}
//                         onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
//                         className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20"
//                       />
//                       <div className="flex gap-2 mt-3">
//                         <button
//                           onClick={handleAddFormation}
//                           className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
//                         >
//                           <Save className="w-4 h-4" />
//                           Enregistrer
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowNewFormForm(false);
//                             setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
//                           }}
//                           className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
//                         >
//                           Annuler
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {formations.length === 0 ? (
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
//                       <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//                       <p className="text-slate-500 text-sm">Aucune formation ajoutée</p>
//                       <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {formations.map((form) => (
//                         <div key={form.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-slate-800">{form.diplome}</h4>
//                               <p className="text-sm text-slate-600">{form.etablissement}</p>
//                               <p className="text-xs text-slate-500 mt-1">{form.annee}</p>
//                               {form.description && (
//                                 <p className="text-sm text-slate-600 mt-2">{form.description}</p>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => {
//                                 if (confirm("Supprimer cette formation ?")) {
//                                   deleteFormation(form.id);
//                                 }
//                               }}
//                               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Section Certifications */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-semibold text-slate-800 flex items-center gap-2">
//                       <Award className="w-5 h-5 text-amber-600" />
//                       Certifications
//                     </h3>
//                     <button
//                       onClick={() => setShowNewCertForm(!showNewCertForm)}
//                       className="flex items-center gap-1 px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Ajouter
//                     </button>
//                   </div>

//                   {showNewCertForm && (
//                     <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
//                       <h4 className="font-medium text-slate-800 mb-3 text-sm">Nouvelle certification</h4>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="Titre *"
//                           value={newCert.titre}
//                           onChange={(e) => setNewCert({ ...newCert, titre: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Organisme *"
//                           value={newCert.organisme}
//                           onChange={(e) => setNewCert({ ...newCert, organisme: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                         <input
//                           type="month"
//                           value={newCert.date}
//                           onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                           placeholder="Date d'obtention *"
//                         />
//                         <input
//                           type="url"
//                           placeholder="Lien (optionnel)"
//                           value={newCert.lien}
//                           onChange={(e) => setNewCert({ ...newCert, lien: e.target.value })}
//                           className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
//                         />
//                       </div>
//                       <div className="flex gap-2 mt-3">
//                         <button
//                           onClick={handleAddCertification}
//                           className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
//                         >
//                           <Save className="w-4 h-4" />
//                           Enregistrer
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowNewCertForm(false);
//                             setNewCert({ titre: "", organisme: "", date: "", lien: "" });
//                           }}
//                           className="px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50"
//                         >
//                           Annuler
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                   {certifications.length === 0 ? (
//                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
//                       <Award className="w-12 h-12 mx-auto mb-3 text-slate-400" />
//                       <p className="text-slate-500 text-sm">Aucune certification ajoutée</p>
//                       <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {certifications.map((cert) => (
//                         <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                           <div className="flex justify-between items-start">
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-slate-800">{cert.titre}</h4>
//                               <p className="text-sm text-slate-600">{cert.organisme}</p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {new Date(cert.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
//                               </p>
//                               {cert.lien && (
//                                 <a href={cert.lien} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
//                                   Voir le certificat →
//                                 </a>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => {
//                                 if (confirm("Supprimer cette certification ?")) {
//                                   deleteCertification(cert.id);
//                                 }
//                               }}
//                               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Vue Dons reçus */}
//             {activeView === "dons" && (
//               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
//                 <h3 className="font-semibold text-slate-800 mb-2">Dons reçus (exemple)</h3>
//                 <div className="text-sm text-slate-600">
//                   Don de 2 laptops — statut : ✅ Réceptionné — 12/06/2025
//                 </div>
//               </div>
//             )}

//             {/* Vue Activité */}
//             {activeView === "activite" && (
//               <div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
//                   <h3 className="font-semibold text-slate-800 mb-2">Reconnaissances</h3>
//                   <ul className="text-sm text-slate-600 list-disc pl-5">
//                     <li>Attestation de contribution au projet "Salle informatique"</li>
//                     <li>Mention d'honneur — Semaine de l'éducation</li>
//                   </ul>
//                 </div>

//                 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
//                   <h3 className="font-semibold text-slate-800 mb-2">Projets participés</h3>
//                   <p className="text-sm text-slate-600">{stats.projetsParticipe} projets au total</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>

//         {/* RIGHT SIDEBAR */}
//         <aside className="hidden lg:flex flex-col gap-6">
//           <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-500 to-purple-600">
//             <h3 className="font-semibold">🌟 Statistiques du mois</h3>
//             <div className="grid grid-cols-2 gap-4 mt-4 text-center">
//               <div>
//                 <div className="text-lg font-bold">3</div>
//                 <div className="text-xs opacity-90">Projets</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">2</div>
//                 <div className="text-xs opacity-90">Dons reçus</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">5</div>
//                 <div className="text-xs opacity-90">Messages</div>
//               </div>
//               <div>
//                 <div className="text-lg font-bold">{stats.recoCount}</div>
//                 <div className="text-xs opacity-90">Reconnaissances</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
//             <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
//             <div className="flex flex-col gap-2">
//               <button 
//                 onClick={() => setShowNewExpForm(true)}
//                 className="w-full text-left px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors text-sm font-medium"
//               >
//                 💼 Ajouter une expérience
//               </button>
//               <button 
//                 onClick={() => setShowNewFormForm(true)}
//                 className="w-full text-left px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors text-sm font-medium"
//               >
//                 🎓 Ajouter une formation
//               </button>
//               <button 
//                 onClick={() => setShowNewCertForm(true)}
//                 className="w-full text-left px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-colors text-sm font-medium"
//               >
//                 🏆 Ajouter une certification
//               </button>
//               <button 
//                 onClick={() => setShowUploadCV(true)}
//                 className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors text-sm font-medium"
//               >
//                 📄 Importer mon CV
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>

//       {/* Modal d'upload CV */}
//       {showUploadCV && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold text-slate-800">Importer votre CV</h3>
//               <button
//                 onClick={() => setShowUploadCV(false)}
//                 className="p-2 hover:bg-slate-100 rounded-lg"
//                 disabled={uploading}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
//               {uploading ? (
//                 <div className="py-4">
//                   <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
//                   <p className="text-slate-600">Analyse avec Google Gemini...</p>
//                   <p className="text-xs text-slate-500 mt-2">Cela peut prendre quelques secondes</p>
//                 </div>
//               ) : (
//                 <>
//                   <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//                   <p className="text-slate-600 mb-4">
//                     Importez votre CV pour extraction automatique
//                   </p>
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleCVUpload}
//                     className="hidden"
//                     id="cv-upload"
//                   />
//                   <label
//                     htmlFor="cv-upload"
//                     className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer transition-colors"
//                   >
//                     Sélectionner un fichier PDF
//                   </label>
//                   <p className="text-xs text-slate-500 mt-3">
//                     Fichier PDF uniquement (max 10MB)
//                   </p>
//                 </>
//               )}
//             </div>

//             <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
//               <p className="text-sm text-indigo-800">
//                 <strong>🤖 IA Google Gemini:</strong> Analyse automatique et gratuite de votre CV
//               </p>
//               <ul className="text-xs text-indigo-700 mt-2 space-y-1">
//                 <li>✓ Extraction des expériences professionnelles</li>
//                 <li>✓ Détection des formations académiques</li>
//                 <li>✓ Identification des certifications</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de prévisualisation */}
//       {showPreview && cvAnalysis && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800">Analyse terminée !</h2>
//                 <p className="text-slate-600">
//                   {cvAnalysis.experiences.length + cvAnalysis.formations.length + cvAnalysis.certifications.length} éléments détectés
//                 </p>
//               </div>
//             </div>
            
//             <div className="space-y-4 mb-6">
//               {cvAnalysis.experiences.length > 0 && (
//                 <div>
//                   <h3 className="font-semibold mb-2 flex items-center gap-2">
//                     <Briefcase className="w-5 h-5 text-indigo-600" />
//                     Expériences ({cvAnalysis.experiences.length})
//                   </h3>
//                   <div className="space-y-2">
//                     {cvAnalysis.experiences.map((exp: any, i: number) => (
//                       <div key={i} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-200">
//                         <div className="font-medium text-slate-800">{exp.poste}</div>
//                         <div className="text-slate-600">{exp.etablissement}</div>
//                         <div className="text-xs text-slate-500 mt-1">{exp.debut} - {exp.fin || "Aujourd'hui"}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {cvAnalysis.formations.length > 0 && (
//                 <div>
//                   <h3 className="font-semibold mb-2 flex items-center gap-2">
//                     <GraduationCap className="w-5 h-5 text-emerald-600" />
//                     Formations ({cvAnalysis.formations.length})
//                   </h3>
//                   <div className="space-y-2">
//                     {cvAnalysis.formations.map((form: any, i: number) => (
//                       <div key={i} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-200">
//                         <div className="font-medium text-slate-800">{form.diplome}</div>
//                         <div className="text-slate-600">{form.etablissement} - {form.annee}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {cvAnalysis.certifications.length > 0 && (
//                 <div>
//                   <h3 className="font-semibold mb-2 flex items-center gap-2">
//                     <Award className="w-5 h-5 text-amber-600" />
//                     Certifications ({cvAnalysis.certifications.length})
//                   </h3>
//                   <div className="space-y-2">
//                     {cvAnalysis.certifications.map((cert: any, i: number) => (
//                       <div key={i} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-200">
//                         <div className="font-medium text-slate-800">{cert.titre}</div>
//                         <div className="text-slate-600">{cert.organisme}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//               <p className="text-sm text-blue-800">
//                 ℹ️ Vérifiez les informations extraites avant de sauvegarder. Vous pourrez les modifier ultérieurement.
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleConfirmCV}
//                 className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
//               >
//                 ✅ Confirmer et sauvegarder
//               </button>
//               <button
//                 onClick={() => {
//                   setShowPreview(false);
//                   setCvAnalysis(null);
//                 }}
//                 className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { 
  Upload, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Loader2,
  User,
  Gift,
  TrendingUp,
  MessageSquare,
  Settings,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Target,
  BarChart3,
  Eye,
  Edit3
} from "lucide-react";
import { useTeacherProfile } from "@/lib/hooks/useTeacherProfile";
import { AvatarDisplay } from "@/components/AvatarDisplay";

type EnseignantDashboardProps = {
  user: {
    fullName?: string | null;
    profession?: string | null;
    avatar?: string | null;
    isValidated?: boolean;
    etablissement?: {
      nom: string;
      type?: string | null;
      niveau?: string | null;
    } | null;
    _stats?: {
      recoCount: number;
      projetsParticipe: number;
      donsRecus: number;
    };
  };
};

export default function EnseignantDashboard({ user }: EnseignantDashboardProps) {
  const {
    experiences,
    formations,
    certifications,
    loading,
    addExperience,
    deleteExperience,
    addFormation,
    deleteFormation,
    addCertification,
    deleteCertification,
    uploadCV,
    confirmCVData
  } = useTeacherProfile();

  const [activeView, setActiveView] = useState<"parcours" | "dons" | "activite">("parcours");
  const [showUploadCV, setShowUploadCV] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Formulaires d'ajout manuel
  const [showNewExpForm, setShowNewExpForm] = useState(false);
  const [showNewFormForm, setShowNewFormForm] = useState(false);
  const [showNewCertForm, setShowNewCertForm] = useState(false);

  const [newExp, setNewExp] = useState({
    poste: "",
    etablissement: "",
    debut: "",
    fin: "",
    enCours: false,
    description: ""
  });

  const [newForm, setNewForm] = useState({
    diplome: "",
    etablissement: "",
    annee: "",
    description: ""
  });

  const [newCert, setNewCert] = useState({
    titre: "",
    organisme: "",
    date: "",
    lien: ""
  });

  const stats = user._stats || {
    recoCount: 12,
    projetsParticipe: 5,
    donsRecus: 4,
  };

  // === GESTION DES EXPÉRIENCES ===
  const handleAddExperience = async () => {
    if (!newExp.poste || !newExp.etablissement || !newExp.debut) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addExperience({
        poste: newExp.poste,
        etablissement: newExp.etablissement,
        debut: newExp.debut,
        fin: newExp.enCours ? undefined : newExp.fin,
        enCours: newExp.enCours,
        description: newExp.description
      });
      
      setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
      setShowNewExpForm(false);
      alert("✅ Expérience ajoutée !");
    } catch (error) {
      alert("❌ Erreur lors de l'ajout");
    }
  };

  // === GESTION DES FORMATIONS ===
  const handleAddFormation = async () => {
    if (!newForm.diplome || !newForm.etablissement || !newForm.annee) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addFormation({
        diplome: newForm.diplome,
        etablissement: newForm.etablissement,
        annee: newForm.annee,
        description: newForm.description || undefined
      });
      
      setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
      setShowNewFormForm(false);
      alert("✅ Formation ajoutée !");
    } catch (error) {
      alert("❌ Erreur lors de l'ajout");
    }
  };

  // === GESTION DES CERTIFICATIONS ===
  const handleAddCertification = async () => {
    if (!newCert.titre || !newCert.organisme || !newCert.date) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addCertification({
        titre: newCert.titre,
        organisme: newCert.organisme,
        date: newCert.date,
        lien: newCert.lien || undefined
      });
      
      setNewCert({ titre: "", organisme: "", date: "", lien: "" });
      setShowNewCertForm(false);
      alert("✅ Certification ajoutée !");
    } catch (error) {
      alert("❌ Erreur lors de l'ajout");
    }
  };

  // === GESTION CV ===
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📄 Fichier sélectionné:", file.name, file.type, file.size);

    setUploading(true);
    try {
      console.log("🚀 Début uploadCV..."); 
      const result = await uploadCV(file);
      console.log("✅ Résultat uploadCV:", result);
      setCvAnalysis(result.data);
      setShowUploadCV(false);
      setShowPreview(true);
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      alert(error.message || "❌ Erreur lors de l'analyse du CV");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmCV = async () => {
    if (!cvAnalysis) return;

    try {
      await confirmCVData({
        experiences: cvAnalysis.experiences,
        formations: cvAnalysis.formations,
        certifications: cvAnalysis.certifications,
        replaceExisting: false
      });
      
      setShowPreview(false);
      setCvAnalysis(null);
      alert("✅ Profil mis à jour avec succès !");
    } catch (error) {
      alert("❌ Erreur lors de la sauvegarde");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Profil enseignant avec Avatar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <AvatarDisplay
                name={user.fullName || "Enseignant"}
                avatar={user.avatar}
                size="lg"
                showBorder={true}
              />
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
                  ? `${user.etablissement.nom}${user.etablissement.type ? " • " + user.etablissement.type : ""}${user.etablissement.niveau ? " • " + user.etablissement.niveau : ""}`
                  : "Établissement non renseigné"}
              </p>

              <div
                className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium ${
                  user.isValidated
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {user.isValidated ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Validé par l'établissement
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    En attente de validation
                  </>
                )}
              </div>
            </div>

            {/* Stats avec parcours */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-indigo-600">
                  {experiences.length}
                </div>
                <div className="text-xs text-slate-600">Expériences</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-emerald-600">
                  {formations.length}
                </div>
                <div className="text-xs text-slate-600">Formations</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-amber-600">
                  {certifications.length}
                </div>
                <div className="text-xs text-slate-600">Certifications</div>
              </div>
            </div>

            {/* Bouton Import CV */}
            <button
              onClick={() => setShowUploadCV(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Importer mon CV
            </button>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button 
                  onClick={() => setActiveView("parcours")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeView === "parcours" 
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Mon Parcours</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView("dons")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeView === "dons" 
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span className="font-medium">Dons reçus</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView("activite")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeView === "activite" 
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Projets participés</span>
                </button>
              </li>
              <li>
                <Link href="/dashboard/messages">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Messages</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/edit">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Paramètres</span>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header / Tabs */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
            <p className="text-sm text-slate-600">
              Valorisez votre parcours et suivez vos interactions
            </p>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setActiveView("parcours")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeView === "parcours" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <User className="w-4 h-4" />
                Parcours
              </button>
              <button 
                onClick={() => setActiveView("dons")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeView === "dons" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <Gift className="w-4 h-4" />
                Dons reçus
              </button>
              <button 
                onClick={() => setActiveView("activite")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeView === "activite" 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Activité
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            
            {/* Vue Parcours */}
            {activeView === "parcours" && (
              <div className="space-y-6">
                {/* Section Expériences */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      Expériences professionnelles
                    </h3>
                    <button
                      onClick={() => setActiveView("parcours")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>

                  {showNewExpForm && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border-2 border-indigo-200">
                      <h4 className="font-medium text-slate-800 mb-3 text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                        Nouvelle expérience
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Poste *"
                          value={newExp.poste}
                          onChange={(e) => setNewExp({ ...newExp, poste: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Établissement *"
                          value={newExp.etablissement}
                          onChange={(e) => setNewExp({ ...newExp, etablissement: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="month"
                          value={newExp.debut}
                          onChange={(e) => setNewExp({ ...newExp, debut: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Date de début *"
                        />
                        <input
                          type="month"
                          value={newExp.fin}
                          onChange={(e) => setNewExp({ ...newExp, fin: e.target.value })}
                          disabled={newExp.enCours}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm disabled:bg-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Date de fin"
                        />
                      </div>
                      <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newExp.enCours}
                          onChange={(e) => setNewExp({ ...newExp, enCours: e.target.checked, fin: "" })}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 font-medium">Poste actuel</span>
                      </label>
                      <textarea
                        placeholder="Description..."
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleAddExperience}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setShowNewExpForm(false);
                            setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                    </div>
                  ) : experiences.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Aucune expérience ajoutée</p>
                      <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{exp.poste}</h4>
                              <p className="text-sm text-slate-600 mt-0.5">{exp.etablissement}</p>
                              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(exp.debut).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                                {" - "}
                                {exp.enCours ? "Aujourd'hui" : exp.fin ? new Date(exp.fin).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : ""}
                              </p>
                              {exp.description && (
                                <p className="text-sm text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg">{exp.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette expérience ?")) {
                                  deleteExperience(exp.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Formations */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                      Formations académiques
                    </h3>
                    <button
                      onClick={() => setShowNewFormForm(!showNewFormForm)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>

                  {showNewFormForm && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 mb-4 border-2 border-emerald-200">
                      <h4 className="font-medium text-slate-800 mb-3 text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-emerald-600" />
                        Nouvelle formation
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Diplôme *"
                          value={newForm.diplome}
                          onChange={(e) => setNewForm({ ...newForm, diplome: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Établissement *"
                          value={newForm.etablissement}
                          onChange={(e) => setNewForm({ ...newForm, etablissement: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Année *"
                          value={newForm.annee}
                          onChange={(e) => setNewForm({ ...newForm, annee: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          min="1950"
                          max="2030"
                        />
                      </div>
                      <textarea
                        placeholder="Description (mention, spécialisation...)"
                        value={newForm.description}
                        onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                        className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleAddFormation}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setShowNewFormForm(false);
                            setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {formations.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <GraduationCap className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Aucune formation ajoutée</p>
                      <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formations.map((form) => (
                        <div key={form.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{form.diplome}</h4>
                              <p className="text-sm text-slate-600 mt-0.5">{form.etablissement}</p>
                              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {form.annee}
                              </p>
                              {form.description && (
                                <p className="text-sm text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg">{form.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette formation ?")) {
                                  deleteFormation(form.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Certifications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      Certifications
                    </h3>
                    <button
                      onClick={() => setShowNewCertForm(!showNewCertForm)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>

                  {showNewCertForm && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 mb-4 border-2 border-amber-200">
                      <h4 className="font-medium text-slate-800 mb-3 text-sm flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-600" />
                        Nouvelle certification
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Titre *"
                          value={newCert.titre}
                          onChange={(e) => setNewCert({ ...newCert, titre: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Organisme *"
                          value={newCert.organisme}
                          onChange={(e) => setNewCert({ ...newCert, organisme: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        <input
                          type="month"
                          value={newCert.date}
                          onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Date d'obtention *"
                        />
                        <input
                          type="url"
                          placeholder="Lien (optionnel)"
                          value={newCert.lien}
                          onChange={(e) => setNewCert({ ...newCert, lien: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleAddCertification}
                          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setShowNewCertForm(false);
                            setNewCert({ titre: "", organisme: "", date: "", lien: "" });
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  {certifications.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">Aucune certification ajoutée</p>
                      <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{cert.titre}</h4>
                              <p className="text-sm text-slate-600 mt-0.5">{cert.organisme}</p>
                              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(cert.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                              </p>
                              {cert.lien && (
                                <a 
                                  href={cert.lien} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:underline mt-2 inline-flex"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Voir le certificat
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette certification ?")) {
                                  deleteCertification(cert.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vue Dons reçus */}
            {activeView === "dons" && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Dons reçus</h3>
                    <p className="text-sm text-slate-600">Historique de vos dons</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-slate-800">Don de 2 laptops</span>
                      </div>
                      <p className="text-sm text-slate-600">Statut: Réceptionné</p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        12/06/2025
                      </p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vue Activité */}
            {activeView === "activite" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Reconnaissances</h3>
                      <p className="text-sm text-slate-600">Vos contributions reconnues</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">Attestation de contribution au projet "Salle informatique"</p>
                          <p className="text-xs text-slate-500 mt-1">Délivrée le 15 mars 2025</p>
                        </div>
                      </div>
                    </li>
                    <li className="bg-white rounded-xl p-4 border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">Mention d'honneur — Semaine de l'éducation</p>
                          <p className="text-xs text-slate-500 mt-1">Délivrée le 8 février 2025</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Projets participés</h3>
                      <p className="text-sm text-slate-600">{stats.projetsParticipe} projets au total</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center border border-indigo-200">
                      <div className="text-2xl font-bold text-indigo-600">{stats.projetsParticipe}</div>
                      <div className="text-xs text-slate-600 mt-1">Total</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-indigo-200">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-xs text-slate-600 mt-1">Actifs</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center border border-indigo-200">
                      <div className="text-2xl font-bold text-slate-400">2</div>
                      <div className="text-xs text-slate-600 mt-1">Terminés</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              <h3 className="font-semibold">Statistiques du mois</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">3</div>
                <div className="text-xs opacity-90">Projets</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">2</div>
                <div className="text-xs opacity-90">Dons reçus</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">5</div>
                <div className="text-xs opacity-90">Messages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">{stats.recoCount}</div>
                <div className="text-xs opacity-90">Reconnaissances</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-800">Actions rapides</h3>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowNewExpForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 rounded-xl transition-all duration-300 text-sm font-medium border border-indigo-200"
              >
                <Briefcase className="w-4 h-4" />
                Ajouter une expérience
              </button>
              <button 
                onClick={() => setShowNewFormForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 rounded-xl transition-all duration-300 text-sm font-medium border border-emerald-200"
              >
                <GraduationCap className="w-4 h-4" />
                Ajouter une formation
              </button>
              <button 
                onClick={() => setShowNewCertForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 rounded-xl transition-all duration-300 text-sm font-medium border border-amber-200"
              >
                <Award className="w-4 h-4" />
                Ajouter une certification
              </button>
              <button 
                onClick={() => setShowUploadCV(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 rounded-xl transition-all duration-300 text-sm font-medium border border-purple-200"
              >
                <Upload className="w-4 h-4" />
                Importer mon CV
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Astuce</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>💡 Le saviez-vous ?</strong> Un profil complet avec CV augmente vos chances de recevoir des dons de 60% !
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal d'upload CV */}
      {showUploadCV && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-6 h-6 text-indigo-600" />
                Importer votre CV
              </h3>
              <button
                onClick={() => setShowUploadCV(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all">
              {uploading ? (
                <div className="py-4">
                  <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-600 font-medium">Analyse avec l'IA...</p>
                  <p className="text-xs text-slate-500 mt-2">Cela peut prendre quelques secondes</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-slate-600 mb-4 font-medium">
                    Importez votre CV pour extraction automatique
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg cursor-pointer transition-all duration-300 font-medium"
                  >
                    <Upload className="w-5 h-5" />
                    Sélectionner un fichier PDF
                  </label>
                  <p className="text-xs text-slate-500 mt-3">
                    Fichier PDF uniquement (max 10MB)
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <p className="text-sm text-indigo-800 font-medium flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <strong>IA :</strong> Analyse automatique et gratuite
              </p>
              <ul className="text-xs text-indigo-700 mt-3 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Extraction des expériences professionnelles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Détection des formations académiques
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Identification des certifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreview && cvAnalysis && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Analyse terminée !</h2>
                <p className="text-slate-600">
                  {cvAnalysis.experiences.length + cvAnalysis.formations.length + cvAnalysis.certifications.length} éléments détectés
                </p>
              </div>
            </div>
            
            <div className="space-y-5 mb-6">
              {cvAnalysis.experiences.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Expériences ({cvAnalysis.experiences.length})
                  </h3>
                  <div className="space-y-2">
                    {cvAnalysis.experiences.map((exp: any, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl text-sm border border-indigo-200">
                        <div className="font-medium text-slate-800">{exp.poste}</div>
                        <div className="text-slate-600 mt-0.5">{exp.etablissement}</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.debut} - {exp.fin || "Aujourd'hui"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cvAnalysis.formations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    Formations ({cvAnalysis.formations.length})
                  </h3>
                  <div className="space-y-2">
                    {cvAnalysis.formations.map((form: any, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl text-sm border border-emerald-200">
                        <div className="font-medium text-slate-800">{form.diplome}</div>
                        <div className="text-slate-600 mt-0.5">{form.etablissement} - {form.annee}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cvAnalysis.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-800">
                    <Award className="w-5 h-5 text-amber-600" />
                    Certifications ({cvAnalysis.certifications.length})
                  </h3>
                  <div className="space-y-2">
                    {cvAnalysis.certifications.map((cert: any, i: number) => (
                      <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl text-sm border border-amber-200">
                        <div className="font-medium text-slate-800">{cert.titre}</div>
                        <div className="text-slate-600 mt-0.5">{cert.organisme}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Vérifiez les informations extraites avant de sauvegarder. Vous pourrez les modifier ultérieurement.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmCV}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg font-medium transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmer et sauvegarder
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setCvAnalysis(null);
                }}
                className="px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}