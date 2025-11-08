// import { motion } from "framer-motion";
// import { School, GraduationCap, Heart } from "lucide-react";

// const profiles = [
//   {
//     type: "etablissement",
//     icon: School,
//     title: "Établissement",
//     description: "École, lycée, université ou centre de formation",
//     color: "from-blue-500 to-indigo-600",
//     bgColor: "bg-blue-50",
//     borderColor: "border-blue-500",
//     ringColor: "ring-blue-300",
//   },
//   {
//     type: "enseignant",
//     icon: GraduationCap,
//     title: "Enseignant/Personnel",
//     description: "Professeur, directeur ou personnel éducatif",
//     color: "from-green-500 to-emerald-600",
//     bgColor: "bg-green-50",
//     borderColor: "border-green-500",
//     ringColor: "ring-green-300",
//   },
//   {
//     type: "donateur",
//     icon: Heart,
//     title: "Donateur",
//     description: "Particulier, entreprise ou ONG souhaitant aider",
//     color: "from-pink-500 to-rose-600",
//     bgColor: "bg-pink-50",
//     borderColor: "border-pink-500",
//     ringColor: "ring-pink-300",
//   },
// ];

// export default function ProfileSelector({ 
//   selected, 
//   onSelect 
// }: { 
//   selected: string | null; 
//   onSelect: (type: string) => void;
// }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
//       {profiles.map((profile) => {
//         const Icon = profile.icon;
//         const isSelected = selected === profile.type;
        
//         return (
//           <motion.div
//             key={profile.type}
//             onClick={() => onSelect(profile.type)}
//             className={`cursor-pointer rounded-2xl border-2 p-6 shadow-md transition-all hover:shadow-xl relative overflow-hidden ${
//               isSelected 
//                 ? `${profile.borderColor} ring-4 ${profile.ringColor} ${profile.bgColor}` 
//                 : "border-gray-200 bg-white hover:border-gray-300"
//             }`}
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {/* Badge de sélection */}
//             {isSelected && (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md"
//               >
//                 <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}>
//                   <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               </motion.div>
//             )}

//             {/* Icône avec gradient */}
//             <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-4 shadow-lg`}>
//               <Icon className="w-8 h-8 text-white" strokeWidth={2} />
//             </div>

//             {/* Titre et description */}
//             <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.title}</h3>
//             <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }
import { motion, AnimatePresence } from "framer-motion";
import { School, GraduationCap, Heart, Info, ArrowRight } from "lucide-react";

const profiles = [
  {
    type: "etablissement",
    icon: School,
    title: "Établissement",
    description: "École, lycée, université ou centre de formation",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    ringColor: "ring-blue-300",
    benefits: ["Gestion des enseignants", "Suivi des projets", "Réception de dons"]
  },
  {
    type: "enseignant",
    icon: GraduationCap,
    title: "Enseignant/Personnel",
    description: "Professeur, directeur ou personnel éducatif",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    ringColor: "ring-green-300",
    benefits: ["Liaison établissement", "Participation projets", "Réseau éducatif"]
  },
  {
    type: "donateur",
    icon: Heart,
    title: "Donateur",
    description: "Particulier, entreprise ou ONG souhaitant aider",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-500",
    ringColor: "ring-pink-300",
    benefits: ["Faire des dons", "Suivre l'impact", "Soutenir l'éducation"]
  },
];

export default function ProfileSelector({ 
  selected, 
  onSelect 
}: { 
  selected: string | null; 
  onSelect: (type: string) => void;
}) {
  return (
    <div className="mb-8">
      {/* Bandeau d'instruction animé */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
                  🎯 Commencez par choisir votre type de profil
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Sélectionnez le type de compte qui vous correspond. Les champs de formulaire s'adapteront automatiquement à votre choix.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-600 animate-pulse flex-shrink-0 mt-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de confirmation après sélection */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-800">
              Profil <strong>{profiles.find(p => p.type === selected)?.title}</strong> sélectionné. 
              Remplissez maintenant les informations ci-dessous.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cartes de sélection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          const isSelected = selected === profile.type;
          
          return (
            <motion.div
              key={profile.type}
              onClick={() => onSelect(profile.type)}
              className={`cursor-pointer rounded-2xl border-2 p-6 shadow-md transition-all hover:shadow-xl relative overflow-hidden ${
                isSelected 
                  ? `${profile.borderColor} ring-4 ${profile.ringColor} ${profile.bgColor}` 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Badge de sélection */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md z-10"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Effet de vague au survol */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
              )}

              {/* Icône avec gradient */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-4 shadow-lg relative z-10`}>
                <Icon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>

              {/* Titre et description */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 relative z-10">{profile.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 relative z-10">{profile.description}</p>

              {/* Liste des avantages */}
              <div className="space-y-2 relative z-10">
                {profile.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${profile.color}`} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Bouton de sélection visible au survol */}
              {!isSelected && (
                <div className="mt-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button className={`w-full py-2 rounded-lg bg-gradient-to-r ${profile.color} text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all`}>
                    Choisir ce profil
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}