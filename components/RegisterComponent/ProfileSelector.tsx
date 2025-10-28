// import { motion } from "framer-motion";

// const profiles = [
//   {
//     type: "etablissement",
//     icon: "🏫",
//     title: "Établissement",
//     description: "École, lycée, université ou centre de formation",
//   },
//   {
//     type: "enseignant",
//     icon: "👨‍🏫",
//     title: "Enseignant/Personnel",
//     description: "Professeur, directeur ou personnel éducatif",
//   },
//   {
//     type: "donateur",
//     icon: "🤝",
//     title: "Donateur",
//     description: "Particulier, entreprise ou ONG souhaitant aider",
//   },
// ];

// export default function ProfileSelector({ selected, onSelect }: { selected: string | null; onSelect: (type: string) => void }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//       {profiles.map((profile) => (
//         <motion.div
//           key={profile.type}
//           onClick={() => onSelect(profile.type)}
//           className={`cursor-pointer rounded-xl border-2 p-6 shadow-md transition-all hover:shadow-xl bg-white relative overflow-hidden ${
//             selected === profile.type ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-200"
//           }`}
//           whileHover={{ scale: 1.03 }}
//         >
//           <div className="text-5xl mb-4">{profile.icon}</div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-1">{profile.title}</h3>
//           <p className="text-sm text-gray-500">{profile.description}</p>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { School, GraduationCap, Heart } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Badge de sélection */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Icône avec gradient */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center mb-4 shadow-lg`}>
              <Icon className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            {/* Titre et description */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}