"use client";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Inscription",
      description:
        "Créez votre compte selon votre profil : établissement, enseignant ou donateur",
    },
    {
      number: 2,
      title: "Publication",
      description:
        "Les établissements publient leurs projets avec détails et photos",
    },
    {
      number: 3,
      title: "Connexion",
      description:
        "Donateurs et établissements se connectent via demandes d'amis",
    },
    {
      number: 4,
      title: "Contribution",
      description:
        "Réalisation des dons avec suivi transparent du statut",
    },
  ];

  return (
    <section className="bg-white/90 backdrop-blur-xl rounded-3xl px-6 py-20 shadow-2xl my-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Comment ça marche ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
        {steps.map((step) => (
          <div
            key={step.number}
            className="text-center relative px-4 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-full flex items-center justify-center shadow-lg">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
