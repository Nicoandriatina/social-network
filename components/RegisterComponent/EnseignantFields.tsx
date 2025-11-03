"use client";

import { useEffect, useState } from "react";
import { School, Briefcase, Calendar, Award, AlertCircle } from "lucide-react";

type Etablissement = {
  id: string;
  nom: string;
  type: string;
  niveau: string;
};

export default function EnseignantFields({ register, errors }: any) {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="border-b pb-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <School className="w-5 h-5 text-green-600" />
          Informations enseignant
        </h3>
        <p className="text-sm text-gray-500 mt-1">Votre profil sera soumis à validation par votre établissement</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sélection de l'établissement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" />
            Établissement <span className="text-red-500">*</span>
          </label>
          {loading ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span className="text-gray-600 text-sm">Chargement des établissements...</span>
            </div>
          ) : etablissements.length === 0 ? (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Aucun établissement disponible</p>
                <p className="text-xs text-yellow-600 mt-1">Veuillez contacter l'administrateur</p>
              </div>
            </div>
          ) : (
            <select
              {...register("etablissementId")}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.etablissementId ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Sélectionnez votre établissement</option>
              {etablissements.map((etab) => (
                <option key={etab.id} value={etab.id}>
                  {etab.nom} • {etab.type} • {etab.niveau}
                </option>
              ))}
            </select>
          )}
          {errors.etablissementId && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.etablissementId.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Poste occupé
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: Professeur de Mathématiques"
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
            Années d'expérience
            <span className="text-xs text-gray-400 ml-1">(optionnel)</span>
          </label>
          <input
            type="text"
            placeholder="Ex: 5 ans"
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
            placeholder="Ex: Master en Mathématiques"
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

      {/* Message informatif */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Validation requise</p>
          <p className="mt-1 text-blue-700">
            Votre profil sera examiné par l'administrateur de votre établissement avant activation.
          </p>
        </div>
      </div>
    </div>
  );
}