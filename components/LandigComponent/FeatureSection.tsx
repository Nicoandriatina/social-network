"use client";

import React from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    type: "etablissement",
    icon: "\ud83c\udfeb",
    title: "\u00c9tablissements",
    description:
      "Publiez vos projets, trouvez des partenaires et g\u00e9rez vos \u00e9quipes enseignantes",
    benefits: [
      "Publication de projets avec photos et d\u00e9tails",
      "Recherche de donateurs et partenaires",
      "Gestion des enseignants et validations",
      "Suivi des donations re\u00e7ues en temps r\u00e9el",
      "Messagerie avec les donateurs",
    ],
    bg: "from-indigo-500 to-purple-500",
  },
  {
    type: "enseignant",
    icon: "\ud83d\udc68\u200d\ud83c\udfeb",
    title: "Enseignants & Personnel",
    description:
      "Valorisez votre parcours professionnel et obtenez des reconnaissances sociales",
    benefits: [
      "Profil professionnel d\u00e9taill\u00e9",
      "Validation par votre \u00e9tablissement",
      "Reconnaissance de votre parcours",
      "R\u00e9ception de dons personnalis\u00e9s",
      "R\u00e9seau professionnel \u00e9ducatif",
    ],
    bg: "from-red-400 to-yellow-400",
  },
  {
    type: "donateur",
    icon: "\ud83e\udd1d",
    title: "Donateurs",
    description:
      "Soutenez l\u2019\u00e9ducation avec transparence et suivez l\u2019impact de vos contributions",
    benefits: [
      "Choix de projets selon vos pr\u00e9f\u00e9rences",
      "Dons mon\u00e9taires, vivres ou mat\u00e9riels",
      "Suivi transparent de vos contributions",
      "Communication directe avec b\u00e9n\u00e9ficiaires",
      "Historique complet de vos dons",
    ],
    bg: "from-teal-400 to-cyan-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 text-white">
      <h2 className="text-4xl font-bold text-center mb-4 text-white drop-shadow-md">
        Pour qui ?
      </h2>
      <p className="text-center text-lg text-white/90 max-w-2xl mx-auto mb-16">
        Une plateforme adaptée à chaque acteur de l'éducation malgache
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.type}
            className="bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-gray-800 relative overflow-hidden group hover:-translate-y-2 transition"
          >
            <div
              className={cn(
                "w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg",
                "bg-gradient-to-tr",
                f.bg
              )}
            >
              {f.icon}
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">{f.title}</h3>
            <p className="text-center text-gray-600 mb-4 text-sm">
              {f.description}
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              {f.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-6 h-6 text-xs font-bold bg-gradient-to-tr from-teal-400 to-cyan-500 text-white rounded-full flex items-center justify-center">
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div
              className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </section>
  );
}
