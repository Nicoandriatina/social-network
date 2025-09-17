export default function BasicInfoFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="exemple@email.com"
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-gray-400 text-xs mt-1">Minimum 8 caractères</p>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Nom de l'établissement ou nom et prénom"
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="+261 XX XXX XXXX"
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
    </div>
  );
}
