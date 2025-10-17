"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Upload, Briefcase, GraduationCap, Award, Plus, Trash2, Save, X, FileText, Loader2 } from "lucide-react";
import { useTeacherProfile } from "@/lib/hooks/useTeacherProfile";

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
  const [newExp, setNewExp] = useState({
    poste: "",
    etablissement: "",
    debut: "",
    fin: "",
    enCours: false,
    description: ""
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
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
                {user.isValidated ? "✅ Validé par l'établissement" : "⏳ En attente de validation"}
              </div>
            </div>

            {/* Stats avec parcours */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {experiences.length}
                </div>
                <div className="text-xs text-slate-500">Expériences</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {formations.length}
                </div>
                <div className="text-xs text-slate-500">Formations</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {certifications.length}
                </div>
                <div className="text-xs text-slate-500">Certifications</div>
              </div>
            </div>

            {/* Bouton Import CV */}
            <button
              onClick={() => setShowUploadCV(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Importer CV
            </button>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button 
                  onClick={() => setActiveView("parcours")}
                  className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "parcours" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
                >
                  👤 Mon Parcours
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView("dons")}
                  className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "dons" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
                >
                  💝 Dons reçus
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView("activite")}
                  className={`w-full text-left px-3 py-2 rounded-xl ${activeView === "activite" ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "hover:bg-slate-50"}`}
                >
                  🧩 Projets participés
                </button>
              </li>
              <li>
                <Link href="/dashboard/messages">
                  <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                    💬 Messages
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/edit">
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
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
            <p className="text-sm text-slate-500">
              Valorisez votre parcours et suivez vos interactions
            </p>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setActiveView("parcours")}
                className={`px-3 py-2 text-sm rounded-xl ${activeView === "parcours" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
              >
                🧭 Parcours
              </button>
              <button 
                onClick={() => setActiveView("dons")}
                className={`px-3 py-2 text-sm rounded-xl ${activeView === "dons" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
              >
                💝 Dons reçus
              </button>
              <button 
                onClick={() => setActiveView("activite")}
                className={`px-3 py-2 text-sm rounded-xl ${activeView === "activite" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
              >
                📈 Activité
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
                      onClick={() => setShowNewExpForm(!showNewExpForm)}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>

                  {showNewExpForm && (
                    <div className="bg-indigo-50 rounded-xl p-4 mb-4 border border-indigo-200">
                      <h4 className="font-medium text-slate-800 mb-3 text-sm">Nouvelle expérience</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Poste *"
                          value={newExp.poste}
                          onChange={(e) => setNewExp({ ...newExp, poste: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Établissement *"
                          value={newExp.etablissement}
                          onChange={(e) => setNewExp({ ...newExp, etablissement: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        />
                        <input
                          type="month"
                          value={newExp.debut}
                          onChange={(e) => setNewExp({ ...newExp, debut: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                        />
                        <input
                          type="month"
                          value={newExp.fin}
                          onChange={(e) => setNewExp({ ...newExp, fin: e.target.value })}
                          disabled={newExp.enCours}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-sm disabled:bg-slate-100"
                        />
                      </div>
                      <label className="flex items-center gap-2 mt-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newExp.enCours}
                          onChange={(e) => setNewExp({ ...newExp, enCours: e.target.checked, fin: "" })}
                          className="w-4 h-4"
                        />
                        <span className="text-slate-600">Poste actuel</span>
                      </label>
                      <textarea
                        placeholder="Description..."
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        className="w-full mt-3 px-3 py-2 rounded-lg border border-slate-300 text-sm min-h-20"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleAddExperience}
                          className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                        <button
                          onClick={() => {
                            setShowNewExpForm(false);
                            setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
                          }}
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
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
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-500 text-sm">Aucune expérience ajoutée</p>
                      <p className="text-slate-400 text-xs mt-1">Cliquez sur "Ajouter" ou importez votre CV</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{exp.poste}</h4>
                              <p className="text-sm text-slate-600">{exp.etablissement}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(exp.debut).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                                {" - "}
                                {exp.enCours ? "Aujourd'hui" : exp.fin ? new Date(exp.fin).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : ""}
                              </p>
                              {exp.description && (
                                <p className="text-sm text-slate-600 mt-2">{exp.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette expérience ?")) {
                                  deleteExperience(exp.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    Formations académiques
                  </h3>
                  {formations.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                      <p className="text-slate-500 text-sm">Aucune formation ajoutée</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formations.map((form) => (
                        <div key={form.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{form.diplome}</h4>
                              <p className="text-sm text-slate-600">{form.etablissement}</p>
                              <p className="text-xs text-slate-500 mt-1">{form.annee}</p>
                              {form.description && (
                                <p className="text-sm text-slate-600 mt-2">{form.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette formation ?")) {
                                  deleteFormation(form.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600"
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
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    Certifications
                  </h3>
                  {certifications.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                      <p className="text-slate-500 text-sm">Aucune certification ajoutée</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{cert.titre}</h4>
                              <p className="text-sm text-slate-600">{cert.organisme}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(cert.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                              </p>
                              {cert.lien && (
                                <a href={cert.lien} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                                  Voir le certificat →
                                </a>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Supprimer cette certification ?")) {
                                  deleteCertification(cert.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600"
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
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Dons reçus (exemple)</h3>
                <div className="text-sm text-slate-600">
                  Don de 2 laptops — statut : ✅ Réceptionné — 12/06/2025
                </div>
              </div>
            )}

            {/* Vue Activité */}
            {activeView === "activite" && (
              <div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4">
                  <h3 className="font-semibold text-slate-800 mb-2">Reconnaissances</h3>
                  <ul className="text-sm text-slate-600 list-disc pl-5">
                    <li>Attestation de contribution au projet "Salle informatique"</li>
                    <li>Mention d'honneur — Semaine de l'éducation</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">Projets participés</h3>
                  <p className="text-sm text-slate-600">{stats.projetsParticipe} projets au total</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
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
                <div className="text-lg font-bold">{stats.recoCount}</div>
                <div className="text-xs opacity-90">Reconnaissances</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowNewExpForm(true)}
                className="btn btn-primary bg-indigo-600 text-white rounded-xl py-2"
              >
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

      {/* Modal d'upload CV */}
      {showUploadCV && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Importer votre CV</h3>
              <button
                onClick={() => setShowUploadCV(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
              {uploading ? (
                <div className="py-4">
                  <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                  <p className="text-slate-600">Analyse avec Google Gemini...</p>
                </div>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Importez votre CV pour extraction automatique
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCVUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                  >
                    Sélectionner un fichier
                  </label>
                  <p className="text-xs text-slate-500 mt-3">
                    PDF, DOC, DOCX (max 10MB)
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <p className="text-sm text-indigo-800">
                <strong>🤖 IA Google Gemini:</strong> Analyse automatique gratuite de votre CV
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreview && cvAnalysis && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-4">✅ Analyse terminée !</h2>
            <p className="text-slate-600 mb-6">
              {cvAnalysis.experiences.length + cvAnalysis.formations.length + cvAnalysis.certifications.length} éléments détectés
            </p>
            
            <div className="space-y-4 mb-6">
              {cvAnalysis.experiences.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">📋 Expériences ({cvAnalysis.experiences.length})</h3>
                  {cvAnalysis.experiences.map((exp: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 rounded mb-2 text-sm">
                      <div className="font-medium">{exp.poste}</div>
                      <div className="text-slate-600">{exp.etablissement}</div>
                      <div className="text-xs text-slate-500">{exp.debut} - {exp.fin || "Aujourd'hui"}</div>
                    </div>
                  ))}
                </div>
              )}

              {cvAnalysis.formations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">🎓 Formations ({cvAnalysis.formations.length})</h3>
                  {cvAnalysis.formations.map((form: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 rounded mb-2 text-sm">
                      <div className="font-medium">{form.diplome}</div>
                      <div className="text-slate-600">{form.etablissement} - {form.annee}</div>
                    </div>
                  ))}
                </div>
              )}

              {cvAnalysis.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">🏆 Certifications ({cvAnalysis.certifications.length})</h3>
                  {cvAnalysis.certifications.map((cert: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 rounded mb-2 text-sm">
                      <div className="font-medium">{cert.titre}</div>
                      <div className="text-slate-600">{cert.organisme}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmCV}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium"
              >
                ✅ Confirmer et sauvegarder
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setCvAnalysis(null);
                }}
                className="px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
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