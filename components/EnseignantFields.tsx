export default function EnseignantFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        🎓 Informations professionnelles
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Établissement de rattachement
          </label>
          <select
            {...register("school")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.school ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez votre établissement</option>
            <option value="lycee_antananarivo">Lycée Antananarivo</option>
            <option value="ceg_antsirabe">CEG Antsirabe</option>
            <option value="epp_fianarantsoa">EPP Fianarantsoa</option>
            <option value="universite_antananarivo">Université d'Antananarivo</option>
          </select>
          {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fonction / Matière enseignée
          </label>
          <input
            {...register("position")}
            type="text"
            placeholder="Ex: Professeur de Mathématiques"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Années d'expérience
          </label>
          <select
            {...register("experience")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez</option>
            <option value="0-2">0-2 ans</option>
            <option value="3-5">3-5 ans</option>
            <option value="6-10">6-10 ans</option>
            <option value="11-20">11-20 ans</option>
            <option value="20+">Plus de 20 ans</option>
          </select>
          {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diplôme principal
          </label>
          <input
            {...register("degree")}
            type="text"
            placeholder="Ex: Licence en Mathématiques"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.degree ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>}
        </div>
      </div>
    </div>
  );
}
