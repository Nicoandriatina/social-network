// export default function BasicInfoFields({
//   register,
//   errors,
// }: {
//   register: any;
//   errors: any;
// }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Adresse email <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("email")}
//           type="email"
//           placeholder="exemple@email.com"
//           className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//             errors.email ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Mot de passe <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("password")}
//           type="password"
//           placeholder="••••••••"
//           className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//             errors.password ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         <p className="text-gray-400 text-xs mt-1">Minimum 8 caractères</p>
//         {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//       </div>

//       <div className="sm:col-span-2">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Nom complet <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("fullName")}
//           type="text"
//           placeholder="Nom de l'établissement ou nom et prénom"
//           className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//             errors.fullName ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
//       </div>

//       <div className="sm:col-span-2">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Téléphone <span className="text-red-500">*</span>
//         </label>
//         <input
//           {...register("phone")}
//           type="tel"
//           placeholder="+261 XX XXX XXXX"
//           className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//             errors.phone ? "border-red-500" : "border-gray-300"
//           }`}
//         />
//         {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";

export default function BasicInfoFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = [
    { code: "MG", name: "🇲🇬 Madagascar" },
    { code: "RE", name: "🇷🇪 Réunion" },
    { code: "MU", name: "🇲🇺 Île Maurice" },
    { code: "SC", name: "🇸🇨 Seychelles" },
    { code: "KM", name: "🇰🇲 Comores" },
    { code: "FR", name: "🇫🇷 France" },
    { code: "BE", name: "🇧🇪 Belgique" },
    { code: "CH", name: "🇨🇭 Suisse" },
    { code: "CA", name: "🇨🇦 Canada" },
    { code: "US", name: "🇺🇸 États-Unis" },
    { code: "GB", name: "🇬🇧 Royaume-Uni" },
    { code: "DE", name: "🇩🇪 Allemagne" },
    { code: "IT", name: "🇮🇹 Italie" },
    { code: "ES", name: "🇪🇸 Espagne" },
    { code: "PT", name: "🇵🇹 Portugal" },
    { code: "NL", name: "🇳🇱 Pays-Bas" },
    { code: "AU", name: "🇦🇺 Australie" },
    { code: "NZ", name: "🇳🇿 Nouvelle-Zélande" },
    { code: "JP", name: "🇯🇵 Japon" },
    { code: "CN", name: "🇨🇳 Chine" },
    { code: "IN", name: "🇮🇳 Inde" },
    { code: "BR", name: "🇧🇷 Brésil" },
    { code: "MX", name: "🇲🇽 Mexique" },
    { code: "ZA", name: "🇿🇦 Afrique du Sud" },
    { code: "NG", name: "🇳🇬 Nigeria" },
    { code: "EG", name: "🇪🇬 Égypte" },
    { code: "SG", name: "🇸🇬 Singapour" },
    { code: "TH", name: "🇹🇭 Thaïlande" },
    { code: "VN", name: "🇻🇳 Vietnam" },
    { code: "KR", name: "🇰🇷 Corée du Sud" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Email */}
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
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.email.message}</p>
        )}
      </div>

      {/* Pays - Dropdown avec tous les pays */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pays <span className="text-red-500">*</span>
        </label>
        <select
          {...register("country")}
          className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.country ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">-- Sélectionnez votre pays --</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.country.message}</p>
        )}
      </div>

      {/* Mot de passe avec toggle visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-1">Minimum 8 caractères</p>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.password.message}</p>
        )}
      </div>

      {/* Confirmation mot de passe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer mot de passe <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Nom complet */}
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
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.fullName.message}</p>
        )}
      </div>

      {/* Téléphone */}
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
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone.message}</p>
        )}
      </div>
    </div>
  );
}