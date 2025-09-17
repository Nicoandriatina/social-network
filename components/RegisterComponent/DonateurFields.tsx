export default function DonateurFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        💝 Informations donateur
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de donateur
          </label>
          <select
            {...register("donorType")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.donorType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez</option>
            <option value="particulier">Particulier</option>
            <option value="entreprise">Entreprise</option>
            <option value="association">Association / ONG</option>
            <option value="gouvernement">Organisme gouvernemental</option>
          </select>
          {errors.donorType && <p className="text-red-500 text-xs mt-1">{errors.donorType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secteur d'activité
          </label>
          <input
            {...register("sector")}
            type="text"
            placeholder="Ex: Technologies, Commerce, Santé..."
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.sector ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message}</p>}
        </div>
      </div>
    </div>
  );
}
