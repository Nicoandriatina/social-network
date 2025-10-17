// components/DashboardEnseignantConnected.tsx
"use client";

import React, { useState } from "react";
import { Plus, Upload, Briefcase, GraduationCap, Award, Edit2, Trash2, Save, X, FileText, Loader2 } from "lucide-react";
import { useTeacherProfile } from "@/lib/hooks/useTeacherProfile";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function DashboardEnseignantConnected() {
  const { user, loading: userLoading } = useCurrentUser();
  const {
    experiences,
    formations,
    certifications,
    loading: profileLoading,
    addExperience,
    deleteExperience,
    addFormation,
    deleteFormation,
    addCertification,
    deleteCertification,
    uploadCV
  } = useTeacherProfile();

  const [activeTab, setActiveTab] = useState<"parcours" | "formations" | "certifications">("parcours");
  const [showUploadCV, setShowUploadCV] = useState(false);
  const [uploading, setUploading] = useState(false);

  // États pour les nouveaux formulaires
  const [showNewExpForm, setShowNewExpForm] = useState(false);
  const [newExp, setNewExp] = useState({
    poste: "",
    etablissement: "",
    debut: "",
    fin: "",
    enCours: false,
    description: ""
  });

  const [showNewFormForm, setShowNewFormForm] = useState(false);
  const [newForm, setNewForm] = useState({
    diplome: "",
    etablissement: "",
    annee: "",
    description: ""
  });

  const [showNewCertForm, setShowNewCertForm] = useState(false);
  const [newCert, setNewCert] = useState({
    titre: "",
    organisme: "",
    date: "",
    lien: ""
  });

  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center">Non autorisé</div>;
  }

  const avatarLetters = (user.nom || "EN")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
    } catch (error) {
      alert("Erreur lors de l'ajout de l'expérience");
    }
  };

  const handleAddFormation = async () => {
    if (!newForm.diplome || !newForm.etablissement || !newForm.annee) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addFormation(newForm);
      setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
      setShowNewFormForm(false);
    } catch (error) {
      alert("Erreur lors de l'ajout de la formation");
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.titre || !newCert.organisme || !newCert.date) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addCertification(newCert);
      setNewCert({ titre: "", organisme: "", date: "", lien: "" });
      setShowNewCertForm(false);
    } catch (error) {
      alert("Erreur lors de l'ajout de la certification");
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadCV(file);
      alert("CV uploadé et analysé avec succès !");
      setShowUploadCV(false);
    } catch (error) {
      alert("Erreur lors de l'upload du CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              {avatarLetters}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{user.nom}</h1>
                  <p className="text-slate-600 mt-1">{user.etablissement?.nom || "Personnel éducatif"}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {user.etablissement ? `${user.etablissement.type} • ${user.etablissement.niveau || ""}` : ""}
                  </p>
                </div>

                <button
                  onClick={() => setShowUploadCV(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Importer CV
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-800">{experiences.length}</div>
                  <div className="text-xs text-slate-500">Expériences</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-800">{formations.length}</div>
                  <div className="text-xs text-slate-500">Formations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-800">{certifications.length}</div>
                  <div className="text-xs text-slate-500">Certifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("parcours")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "parcours"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Expériences professionnelles
            </button>
            <button
              onClick={() => setActiveTab("formations")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "formations"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Formations
            </button>
            <button
              onClick={() => setActiveTab("certifications")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "certifications"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Award className="w-4 h-4" />
              Certifications
            </button>
          </div>

          <div className="p-6">
            {/* Onglet Expériences */}
            {activeTab === "parcours" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Parcours professionnel</h2>
                  <button
                    onClick={() => setShowNewExpForm(!showNewExpForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>

                {showNewExpForm && (
                  <div className="bg-slate-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                    <h3 className="font-semibold text-slate-800 mb-4">Nouvelle expérience</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Poste *"
                        value={newExp.poste}
                        onChange={(e) => setNewExp({ ...newExp, poste: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Établissement *"
                        value={newExp.etablissement}
                        onChange={(e) => setNewExp({ ...newExp, etablissement: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="month"
                        placeholder="Date de début *"
                        value={newExp.debut}
                        onChange={(e) => setNewExp({ ...newExp, debut: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="month"
                        placeholder="Date de fin"
                        value={newExp.fin}
                        onChange={(e) => setNewExp({ ...newExp, fin: e.target.value })}
                        disabled={newExp.enCours}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none disabled:bg-slate-100"
                      />
                    </div>
                    <label className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        checked={newExp.enCours}
                        onChange={(e) => setNewExp({ ...newExp, enCours: e.target.checked, fin: "" })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-600">Poste actuel</span>
                    </label>
                    <textarea
                      placeholder="Description des responsabilités..."
                      value={newExp.description}
                      onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                      className="w-full mt-4 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-24"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleAddExperience}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setShowNewExpForm(false);
                          setNewExp({ poste: "", etablissement: "", debut: "", fin: "", enCours: false, description: "" });
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {experiences.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune expérience ajoutée</p>
                  </div>
                ) : (
                  experiences.map((exp) => (
                    <div key={exp.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 text-lg">{exp.poste}</h3>
                            <p className="text-slate-600">{exp.etablissement}</p>
                            <p className="text-sm text-slate-500 mt-1">
                              {new Date(exp.debut).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                              {" - "}
                              {exp.enCours ? "Aujourd'hui" : exp.fin ? new Date(exp.fin).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : ""}
                            </p>
                            {exp.description && (
                              <p className="text-slate-600 mt-3 text-sm leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Onglet Formations */}
            {activeTab === "formations" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Formations académiques</h2>
                  <button
                    onClick={() => setShowNewFormForm(!showNewFormForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>

                {showNewFormForm && (
                  <div className="bg-slate-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                    <h3 className="font-semibold text-slate-800 mb-4">Nouvelle formation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Diplôme *"
                        value={newForm.diplome}
                        onChange={(e) => setNewForm({ ...newForm, diplome: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Établissement *"
                        value={newForm.etablissement}
                        onChange={(e) => setNewForm({ ...newForm, etablissement: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Année d'obtention *"
                        value={newForm.annee}
                        onChange={(e) => setNewForm({ ...newForm, annee: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Description (spécialisation, mention...)"
                      value={newForm.description}
                      onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                      className="w-full mt-4 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none min-h-20"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleAddFormation}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setShowNewFormForm(false);
                          setNewForm({ diplome: "", etablissement: "", annee: "", description: "" });
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {formations.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune formation ajoutée</p>
                  </div>
                ) : (
                  formations.map((form) => (
                    <div key={form.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{form.diplome}</h3>
                            <p className="text-slate-600">{form.etablissement}</p>
                            <p className="text-sm text-slate-500 mt-1">{form.annee}</p>
                            {form.description && (
                              <p className="text-slate-600 mt-3 text-sm">{form.description}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteFormation(form.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Onglet Certifications */}
            {activeTab === "certifications" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Certifications et distinctions</h2>
                  <button
                    onClick={() => setShowNewCertForm(!showNewCertForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>

                {showNewCertForm && (
                  <div className="bg-slate-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                    <h3 className="font-semibold text-slate-800 mb-4">Nouvelle certification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Titre de la certification *"
                        value={newCert.titre}
                        onChange={(e) => setNewCert({ ...newCert, titre: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Organisme *"
                        value={newCert.organisme}
                        onChange={(e) => setNewCert({ ...newCert, organisme: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="month"
                        placeholder="Date d'obtention *"
                        value={newCert.date}
                        onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <input
                        type="url"
                        placeholder="Lien de vérification (optionnel)"
                        value={newCert.lien}
                        onChange={(e) => setNewCert({ ...newCert, lien: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleAddCertification}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setShowNewCertForm(false);
                          setNewCert({ titre: "", organisme: "", date: "", lien: "" });
                        }}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {certifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune certification ajoutée</p>
                  </div>
                ) : (
                  certifications.map((cert) => (
                    <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{cert.titre}</h3>
                            <p className="text-slate-600">{cert.organisme}</p>
                            <p className="text-sm text-slate-500 mt-1">
                              {new Date(cert.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                            </p>
                            {cert.lien && (
                              <a
                                href={cert.lien}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                              >
                                Voir le certificat →
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCertification(cert.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'upload de CV */}
      {showUploadCV && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                  <p className="text-slate-600">Analyse du CV en cours...</p>
                </div>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">
                    Glissez votre CV ici ou cliquez pour parcourir
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
                    Formats acceptés: PDF, DOC, DOCX (max 5MB)
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <p className="text-sm text-indigo-800">
                <strong>💡 Astuce:</strong> Notre IA analysera automatiquement votre CV pour extraire vos expériences, formations et certifications.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}