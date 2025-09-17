export default function EtablissementFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        🏛️ Informations établissement
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type administratif
          </label>
          <select
            {...register("adminType")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.adminType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez</option>
            <option value="public">Public</option>
            <option value="prive">Privé</option>
          </select>
          {errors.adminType && <p className="text-red-500 text-xs mt-1">{errors.adminType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d'enseignement
          </label>
          <select
            {...register("level")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.level ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez</option>
            <option value="epp">EPP</option>
            <option value="ceg">CEG</option>
            <option value="lycee">Lycée</option>
            <option value="college">Collège</option>
            <option value="universite">Université</option>
            <option value="organisme">Organisme</option>
          </select>
          {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre d'élèves / étudiants
          </label>
          <input
            {...register("studentCount")}
            type="number"
            placeholder="Ex: 500"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.studentCount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.studentCount && <p className="text-red-500 text-xs mt-1">{errors.studentCount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année de création
          </label>
          <input
            {...register("foundedYear")}
            type="number"
            placeholder="Ex: 1995"
            min={1900}
            max={new Date().getFullYear()}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.foundedYear ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.foundedYear && <p className="text-red-500 text-xs mt-1">{errors.foundedYear.message}</p>}
        </div>
      </div>
    </div>
  );
}
