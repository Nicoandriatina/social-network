"use client";

import { useEffect, useState } from "react";

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
    // ✅ Utiliser ?simple=true pour accès public
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
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        👨‍🏫 Informations Enseignant
      </h3>

      <div className="grid grid-cols-1 gap-6">
        {/* Sélection de l'établissement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🏫 Établissement * <span className="text-red-500">*</span>
          </label>
          {loading ? (
            <div className="text-gray-500 text-sm py-3">Chargement des établissements...</div>
          ) : (
            <select
              {...register("etablissementId")}
              className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.etablissementId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Sélectionnez votre établissement --</option>
              {etablissements.map((etab) => (
                <option key={etab.id} value={etab.id}>
                  {etab.nom} ({etab.type} - {etab.niveau})
                </option>
              ))}
            </select>
          )}
          {errors.etablissementId && (
            <p className="text-red-500 text-xs mt-1">{errors.etablissementId.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            💼 Poste occupé
          </label>
          <input
            type="text"
            placeholder="Ex: Professeur de Mathématiques"
            {...register("position")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.position && (
            <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* Expérience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📅 Années d'expérience
          </label>
          <input
            type="text"
            placeholder="Ex: 5 ans"
            {...register("experience")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.experience && (
            <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
          )}
        </div>

        {/* Diplôme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🎓 Diplôme le plus élevé
          </label>
          <input
            type="text"
            placeholder="Ex: Master en Mathématiques"
            {...register("degree")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.degree ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.degree && (
            <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}