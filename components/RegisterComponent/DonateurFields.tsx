// export default function DonateurFields({
//   register,
//   errors,
// }: {
//   register: any;
//   errors: any;
// }) {
//   return (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
//         💝 Informations donateur
//       </h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Type de donateur
//           </label>
//           <select
//             {...register("donorType")}
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//               errors.donorType ? "border-red-500" : "border-gray-300"
//             }`}
//           >
//             <option value="">Sélectionnez</option>
//             <option value="particulier">Particulier</option>
//             <option value="entreprise">Entreprise</option>
//             <option value="association">Association / ONG</option>
//             <option value="gouvernement">Organisme gouvernemental</option>
//           </select>
//           {errors.donorType && <p className="text-red-500 text-xs mt-1">{errors.donorType.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Secteur d'activité
//           </label>
//           <input
//             {...register("sector")}
//             type="text"
//             placeholder="Ex: Technologies, Commerce, Santé..."
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//               errors.sector ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

import { Heart, Building, Briefcase } from "lucide-react";

export default function DonateurFields({
  register,
  errors,
}: {
  register: any;
  errors: any;
}) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-600" />
          Informations donateur
        </h3>
        <p className="text-sm text-gray-500 mt-1">Aidez-nous à mieux comprendre votre profil</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Type de donateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-500" />
            Type de donateur
          </label>
          <select
            {...register("donorType")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
              errors.donorType ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez votre profil</option>
            <option value="particulier">👤 Particulier</option>
            <option value="entreprise">🏢 Entreprise</option>
            <option value="association">🤝 Association / ONG</option>
            <option value="gouvernement">🏛️ Organisme gouvernemental</option>
          </select>
          {errors.donorType && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.donorType.message}
            </p>
          )}
        </div>

        {/* Secteur d'activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Secteur d'activité
          </label>
          <input
            {...register("sector")}
            type="text"
            placeholder="Ex: Technologies, Commerce, Santé..."
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
              errors.sector ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.sector && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.sector.message}
            </p>
          )}
        </div>
      </div>

      {/* Message de remerciement */}
      <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200 flex items-start gap-3">
        <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-pink-800">
          <p className="font-medium">Merci pour votre générosité !</p>
          <p className="mt-1 text-pink-700">
            Votre contribution aidera les établissements à offrir une meilleure éducation.
          </p>
        </div>
      </div>
    </div>
  );
}
