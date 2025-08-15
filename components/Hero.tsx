"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero-section relative bg-white/90 backdrop-blur-lg rounded-3xl px-6 py-20 shadow-xl my-10 text-center overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(102,126,234,0.05)_0%,transparent_70%)] animate-[spin_20s_linear_infinite]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Connectons l'Éducation
        </h1>
        <p className="text-lg text-gray-600 mt-6 leading-relaxed">
          La première plateforme sociale dédiée à l'éducation malgache. Permettons aux 
          établissements de trouver des partenaires, aux enseignants d'être reconnus, et aux 
          donateurs de contribuer efficacement.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition"
            >
               Rejoindre maintenant
            </Link>
            <Link
              href="/projects"
              className="btn btn-secondary bg-white text-indigo-600 border-2 border-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition"
            >
              Découvrir les projets
            </Link>
          </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-14">
          <div className="text-center">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
              150+
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">Etablissements</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
              2,500+
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">Enseignants</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
              500+
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">Donateurs actifs</div>
          </div>
        </div>
      </div>
    </section>
  );
}
