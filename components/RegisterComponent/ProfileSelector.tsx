import { motion } from "framer-motion";

const profiles = [
  {
    type: "etablissement",
    icon: "🏫",
    title: "Établissement",
    description: "École, lycée, université ou centre de formation",
  },
  {
    type: "enseignant",
    icon: "👨‍🏫",
    title: "Enseignant/Personnel",
    description: "Professeur, directeur ou personnel éducatif",
  },
  {
    type: "donateur",
    icon: "🤝",
    title: "Donateur",
    description: "Particulier, entreprise ou ONG souhaitant aider",
  },
];

export default function ProfileSelector({ selected, onSelect }: { selected: string | null; onSelect: (type: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {profiles.map((profile) => (
        <motion.div
          key={profile.type}
          onClick={() => onSelect(profile.type)}
          className={`cursor-pointer rounded-xl border-2 p-6 shadow-md transition-all hover:shadow-xl bg-white relative overflow-hidden ${
            selected === profile.type ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-200"
          }`}
          whileHover={{ scale: 1.03 }}
        >
          <div className="text-5xl mb-4">{profile.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{profile.title}</h3>
          <p className="text-sm text-gray-500">{profile.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
