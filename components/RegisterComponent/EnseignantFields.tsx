"use client";

import { useEffect, useState } from "react";
import { School, Briefcase, Calendar, Award, AlertCircle, Info, Clock } from "lucide-react";

type Etablissement = {
  id: string;
  nom: string;
  type: string;
  niveau: string;
};

export default function EnseignantFields({ register, errors, setValue }: any) {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEtab, setSelectedEtab] = useState<string>("");
  const [isCurrentTeacher, setIsCurrentTeacher] = useState(true);
  const [startYear, setStartYear] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");

  useEffect(() => {
    fetch("/api/etablissements?simple=true")
      .then(res => res.json())
      .then(data => {
        setEtablissements(data.etablissements || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement établissements:", err);
        setLoading(false);
      });
  }, []);

  // Mettre à jour les valeurs dans le formulaire
  useEffect(() => {
    if (startYear) {
      setValue("startYear", parseInt(startYear));
    }
    if (endYear && !isCurrentTeacher) {
      setValue("endYear", parseInt(endYear));
    } else if (isCurrentTeacher) {
      setValue("endYear", null);
    }
    setValue("isCurrentTeacher", isCurrentTeacher);
  }, [startYear, endYear, isCurrentTeacher, setValue]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="border-b pb-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <School className="w-5 h-5 text-green-600" />
          Informations enseignant
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Ces informations permettront à votre établissement de vous identifier
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sélection de l'établissement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" />
            Établissement
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          
          {loading ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span className="text-gray-600 text-sm">Chargement des établissements...</span>
            </div>
          ) : etablissements.length === 0 ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Aucun établissement disponible</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Vous pouvez créer votre compte maintenant et le lier à un établissement plus tard.
                  </p>
                </div>
              </div>
              <input type="hidden" {...register("etablissementId")} value="" />
            </div>
          ) : (
            <>
              <select
                {...register("etablissementId")}
                onChange={(e) => setSelectedEtab(e.target.value)}
                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                  errors.etablissementId ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Ne pas lier à un établissement pour l'instant</option>
                {etablissements.map((etab) => (
                  <option key={etab.id} value={etab.id}>
                    {etab.nom} • {etab.type} • {etab.niveau}
                  </option>
                ))}
              </select>
              
              {!selectedEtab ? (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Compte sans établissement</p>
                    <p className="mt-1 text-blue-700">
                      Vous pourrez lier votre compte à un établissement ultérieurement depuis votre profil.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Validation requise</p>
                    <p className="mt-1 text-amber-700">
                      L'établissement sélectionné devra valider votre profil avant activation complète.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {errors.etablissementId && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.etablissementId.message}
            </p>
          )}
        </div>

        {/* Période d'enseignement - Affiché seulement si un établissement est sélectionné */}
        {selectedEtab && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h4 className="text-base font-semibold text-gray-800">Période d'enseignement</h4>
            </div>
            
            {/* Statut actuel */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrentTeacher}
                  onChange={(e) => {
                    setIsCurrentTeacher(e.target.checked);
                    if (e.target.checked) {
                      setEndYear("");
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Je travaille actuellement dans cet établissement
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Année de début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de début <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("startYear")}
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.startYear ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionner...</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.startYear && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="font-semibold">⚠</span> {errors.startYear.message}
                  </p>
                )}
              </div>

              {/* Année de fin (si ancien enseignant) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de fin {!isCurrentTeacher && <span className="text-red-500">*</span>}
                </label>
                <select
                  {...register("endYear")}
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  disabled={isCurrentTeacher}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.endYear ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {isCurrentTeacher ? "Actuellement" : "Sélectionner..."}
                  </option>
                  {!isCurrentTeacher && years.map((year) => (
                    <option key={year} value={year} disabled={startYear && year < parseInt(startYear)}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.endYear && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="font-semibold">⚠</span> {errors.endYear.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">
                <strong>💡 Astuce :</strong> Ces informations aideront l'établissement à vous identifier rapidement.
              </p>
            </div>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Poste occupé
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Professeur de Mathématiques, Directeur des Études..."
            {...register("position")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.position ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.position && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.position.message}
            </p>
          )}
        </div>

        {/* Expérience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            Années d'expérience totale
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: 5 ans, 10+ ans..."
            {...register("experience")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.experience ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.experience && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.experience.message}
            </p>
          )}
        </div>

        {/* Diplôme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-500" />
            Diplôme le plus élevé
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Master en Mathématiques, Licence CAPEN..."
            {...register("degree")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.degree ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.degree && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.degree.message}
            </p>
          )}
        </div>
      </div>

      {/* Message informatif général */}
      {selectedEtab && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Validation requise</p>
            <p className="mt-1 text-blue-700">
              Votre profil sera examiné par l'administrateur de votre établissement. 
              Assurez-vous que toutes les informations sont exactes pour faciliter la validation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}