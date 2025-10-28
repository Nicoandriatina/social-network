// import { Building2, GraduationCap, Users, Calendar } from "lucide-react";

// export default function EtablissementFields({
//   register,
//   errors,
// }: {
//   register: any;
//   errors: any;
// }) {
//   return (
//     <div className="space-y-6">
//       <div className="border-b pb-2 mb-6">
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <Building2 className="w-5 h-5 text-blue-600" />
//           Informations de l'établissement
//         </h3>
//         <p className="text-sm text-gray-500 mt-1">Détails sur votre établissement d'enseignement</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* Type administratif */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Building2 className="w-4 h-4 text-gray-500" />
//             Type administratif
//           </label>
//           <select
//             {...register("adminType")}
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//               errors.adminType ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           >
//             <option value="">Sélectionnez le type</option>
//             <option value="public">🏛️ Public</option>
//             <option value="prive">🏢 Privé</option>
//           </select>
//           {errors.adminType && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.adminType.message}
//             </p>
//           )}
//         </div>

//         {/* Niveau d'enseignement */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <GraduationCap className="w-4 h-4 text-gray-500" />
//             Niveau d'enseignement
//           </label>
//           <select
//             {...register("level")}
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//               errors.level ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           >
//             <option value="">Sélectionnez le niveau</option>
//             <option value="epp">🎒 EPP (École Primaire Publique)</option>
//             <option value="ceg">📚 CEG (Collège)</option>
//             <option value="lycee">🎓 Lycée</option>
//             <option value="college">🏫 Collège</option>
//             <option value="universite">🎯 Université</option>
//             <option value="organisme">🏢 Organisme de formation</option>
//           </select>
//           {errors.level && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.level.message}
//             </p>
//           )}
//         </div>

//         {/* Nombre d'élèves */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Users className="w-4 h-4 text-gray-500" />
//             Nombre d'élèves / étudiants
//           </label>
//           <input
//             {...register("studentCount")}
//             type="number"
//             placeholder="Ex: 500"
//             min="1"
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//               errors.studentCount ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           />
//           {errors.studentCount && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.studentCount.message}
//             </p>
//           )}
//         </div>

//         {/* Année de création */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//             <Calendar className="w-4 h-4 text-gray-500" />
//             Année de création
//           </label>
//           <input
//             {...register("foundedYear")}
//             type="number"
//             placeholder="Ex: 1995"
//             min={1900}
//             max={new Date().getFullYear()}
//             className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//               errors.foundedYear ? "border-red-500 bg-red-50" : "border-gray-300"
//             }`}
//           />
//           {errors.foundedYear && (
//             <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//               <span className="font-semibold">⚠</span> {errors.foundedYear.message}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { Building2, GraduationCap, Users, Calendar } from "lucide-react";

export default function EtablissementFields({
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
          <Building2 className="w-5 h-5 text-blue-600" />
          Informations de l'établissement
        </h3>
        <p className="text-sm text-gray-500 mt-1">Détails sur votre établissement d'enseignement</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Type administratif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            Type administratif
          </label>
          <select
            {...register("adminType")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.adminType ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez le type</option>
            <option value="public">🏛️ Public</option>
            <option value="prive">🏢 Privé</option>
          </select>
          {errors.adminType && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.adminType.message}
            </p>
          )}
        </div>

        {/* Niveau d'enseignement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            Niveau d'enseignement
          </label>
          <select
            {...register("level")}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.level ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez le niveau</option>
            <option value="epp">🎒 EPP (École Primaire Publique)</option>
            <option value="ceg">📚 CEG (Collège)</option>
            <option value="lycee">🎓 Lycée</option>
            <option value="college">🏫 Collège</option>
            <option value="universite">🎯 Université</option>
            <option value="organisme">🏢 Organisme de formation</option>
          </select>
          {errors.level && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.level.message}
            </p>
          )}
        </div>

        {/* Nombre d'élèves */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            Nombre d'élèves / étudiants
          </label>
          <input
            {...register("studentCount")}
            type="number"
            placeholder="Ex: 500"
            min="1"
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.studentCount ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.studentCount && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.studentCount.message}
            </p>
          )}
        </div>

        {/* Année de création */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            Année de création
          </label>
          <input
            {...register("foundedYear")}
            type="number"
            placeholder="Ex: 1995"
            min={1900}
            max={new Date().getFullYear()}
            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.foundedYear ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.foundedYear && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <span className="font-semibold">⚠</span> {errors.foundedYear.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}