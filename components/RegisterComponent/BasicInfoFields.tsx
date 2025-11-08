
// import { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, User, Phone, Globe } from "lucide-react";

// export default function BasicInfoFields({
//   register,
//   errors,
// }: {
//   register: any;
//   errors: any;
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const countries = [
//     { code: "MG", name: "Madagascar", flag: "🇲🇬" },
//     { code: "RE", name: "Réunion", flag: "🇷🇪" },
//     { code: "MU", name: "Île Maurice", flag: "🇲🇺" },
//     { code: "SC", name: "Seychelles", flag: "🇸🇨" },
//     { code: "KM", name: "Comores", flag: "🇰🇲" },
//     { code: "FR", name: "France", flag: "🇫🇷" },
//     { code: "BE", name: "Belgique", flag: "🇧🇪" },
//     { code: "CH", name: "Suisse", flag: "🇨🇭" },
//     { code: "CA", name: "Canada", flag: "🇨🇦" },
//     { code: "US", name: "États-Unis", flag: "🇺🇸" },
//     { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
//     { code: "DE", name: "Allemagne", flag: "🇩🇪" },
//     { code: "IT", name: "Italie", flag: "🇮🇹" },
//     { code: "ES", name: "Espagne", flag: "🇪🇸" },
//     { code: "PT", name: "Portugal", flag: "🇵🇹" },
//     { code: "NL", name: "Pays-Bas", flag: "🇳🇱" },
//     { code: "AU", name: "Australie", flag: "🇦🇺" },
//     { code: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿" },
//     { code: "JP", name: "Japon", flag: "🇯🇵" },
//     { code: "CN", name: "Chine", flag: "🇨🇳" },
//     { code: "IN", name: "Inde", flag: "🇮🇳" },
//     { code: "BR", name: "Brésil", flag: "🇧🇷" },
//     { code: "MX", name: "Mexique", flag: "🇲🇽" },
//     { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦" },
//     { code: "NG", name: "Nigeria", flag: "🇳🇬" },
//     { code: "EG", name: "Égypte", flag: "🇪🇬" },
//     { code: "SG", name: "Singapour", flag: "🇸🇬" },
//     { code: "TH", name: "Thaïlande", flag: "🇹🇭" },
//     { code: "VN", name: "Vietnam", flag: "🇻🇳" },
//     { code: "KR", name: "Corée du Sud", flag: "🇰🇷" },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="border-b pb-2 mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <User className="w-5 h-5 text-indigo-600" />
//           Informations personnelles
//         </h3>
//         <p className="text-sm text-gray-500 mt-1">Les champs marqués d'un astérisque (*) sont obligatoires</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Mail className="w-4 h-4 text-gray-500" />
//             Adresse email <span className="text-red-500">*</span>
//           </label>
//           <input
//             {...register("email")}
//             type="email"
//             placeholder="exemple@email.com"
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//               errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           />
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.email.message}
//             </p>
//           )}
//         </div>

//         {/* Pays */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Globe className="w-4 h-4 text-gray-500" />
//             Pays <span className="text-red-500">*</span>
//           </label>
//           <select
//             {...register("country")}
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//               errors.country ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           >
//             <option value="">Sélectionnez votre pays</option>
//             {countries.map((country) => (
//               <option key={country.code} value={country.code}>
//                 {country.flag} {country.name}
//               </option>
//             ))}
//           </select>
//           {errors.country && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.country.message}
//             </p>
//           )}
//         </div>

//         {/* Mot de passe */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Lock className="w-4 h-4 text-gray-500" />
//             Mot de passe <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <input
//               {...register("password")}
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//                 errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
//               aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//           <p className="text-gray-400 text-xs mt-2">Minimum 8 caractères</p>
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.password.message}
//             </p>
//           )}
//         </div>

//         {/* Confirmation mot de passe */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Lock className="w-4 h-4 text-gray-500" />
//             Confirmer mot de passe <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <input
//               {...register("confirmPassword")}
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="••••••••"
//               className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//                 errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
//               aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//             >
//               {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//           {errors.confirmPassword && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.confirmPassword.message}
//             </p>
//           )}
//         </div>

//         {/* Nom complet */}
//         <div className="sm:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <User className="w-4 h-4 text-gray-500" />
//             Nom complet <span className="text-red-500">*</span>
//           </label>
//           <input
//             {...register("fullName")}
//             type="text"
//             placeholder="Nom de l'établissement ou nom et prénom"
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//               errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           />
//           {errors.fullName && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.fullName.message}
//             </p>
//           )}
//         </div>

//         {/* Téléphone */}
//         <div className="sm:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Phone className="w-4 h-4 text-gray-500" />
//             Téléphone <span className="text-red-500">*</span>
//           </label>
//           <input
//             {...register("phone")}
//             type="tel"
//             placeholder="+261 XX XXX XXXX"
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//               errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           />
//           {errors.phone && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.phone.message}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, Globe, AlertCircle } from "lucide-react";

export default function BasicInfoFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Liste des pays avec les vrais codes de drapeaux Unicode
  const countries = [
    { code: "MG", name: "Madagascar", flag: "🇲🇬" },
    { code: "RE", name: "Réunion", flag: "🇷🇪" },
    { code: "MU", name: "Île Maurice", flag: "🇲🇺" },
    { code: "SC", name: "Seychelles", flag: "🇸🇨" },
    { code: "KM", name: "Comores", flag: "🇰🇲" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "BE", name: "Belgique", flag: "🇧🇪" },
    { code: "CH", name: "Suisse", flag: "🇨🇭" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "US", name: "États-Unis", flag: "🇺🇸" },
    { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
    { code: "DE", name: "Allemagne", flag: "🇩🇪" },
    { code: "IT", name: "Italie", flag: "🇮🇹" },
    { code: "ES", name: "Espagne", flag: "🇪🇸" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "NL", name: "Pays-Bas", flag: "🇳🇱" },
    { code: "AU", name: "Australie", flag: "🇦🇺" },
    { code: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿" },
    { code: "JP", name: "Japon", flag: "🇯🇵" },
    { code: "CN", name: "Chine", flag: "🇨🇳" },
    { code: "IN", name: "Inde", flag: "🇮🇳" },
    { code: "BR", name: "Brésil", flag: "🇧🇷" },
    { code: "MX", name: "Mexique", flag: "🇲🇽" },
    { code: "ZA", name: "Afrique du Sud", flag: "🇿🇦" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "EG", name: "Égypte", flag: "🇪🇬" },
    { code: "SG", name: "Singapour", flag: "🇸🇬" },
    { code: "TH", name: "Thaïlande", flag: "🇹🇭" },
    { code: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "KR", name: "Corée du Sud", flag: "🇰🇷" },
  ];

  // Helper pour afficher l'icône d'erreur animée
  const ErrorIcon = () => (
    <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          Informations personnelles
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Les champs marqués d'un <span className="text-red-500 font-bold">*</span> sont obligatoires
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            Adresse email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="exemple@email.com"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ErrorIcon />
              </div>
            )}
          </div>
          {errors.email && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.email.message}</span>
              </p>
            </div>
          )}
        </div>

        {/* Pays avec drapeaux */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            Pays <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("country")}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all appearance-none ${
                errors.country 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              style={{ paddingRight: "2.5rem" }}
            >
              <option value="">🌍 Sélectionnez votre pays</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            {/* Icône dropdown personnalisée */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {errors.country ? (
                <ErrorIcon />
              ) : (
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
          {errors.country && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.country.message}</span>
              </p>
            </div>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full border-2 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Minimum 8 caractères requis
          </p>
          {errors.password && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.password.message}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            Confirmer mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full border-2 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.confirmPassword.message}</span>
              </p>
            </div>
          )}
        </div>

        {/* Nom complet */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Nom complet <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("fullName")}
              type="text"
              placeholder="Nom de l'établissement ou nom et prénom"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.fullName 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.fullName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ErrorIcon />
              </div>
            )}
          </div>
          {errors.fullName && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.fullName.message}</span>
              </p>
            </div>
          )}
        </div>

        {/* Téléphone */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("phone")}
              type="tel"
              placeholder="+261 34 12 345 67"
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.phone 
                  ? "border-red-500 bg-red-50 focus:ring-red-300 animate-shake" 
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
            />
            {errors.phone && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ErrorIcon />
              </div>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Format international recommandé (ex: +261 34 12 345 67)
          </p>
          {errors.phone && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs flex items-center gap-2">
                <ErrorIcon />
                <span className="font-semibold">{errors.phone.message}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}