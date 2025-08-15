"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeaturesSection from "@/components/FeatureSection";
import HowItWorksSection from "@/components/Working";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 text-gray-800">
      <div className="container max-w-screen-xl mx-auto px-4">
        <Header />
        <Hero />
        <FeaturesSection />
        <HowItWorksSection />
         {/* CTA Section */}
        <section className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl p-10 shadow-2xl text-center my-16">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Prêt à transformer l'éducation ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez dès maintenant la communauté Mada Social Network et participez
            à l'amélioration de l'éducation à Madagascar
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition"
            >
              Créer mon compte
            </Link>
            <Link
              href="/projects"
              className="btn btn-secondary bg-white text-indigo-600 border-2 border-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition"
            >
              Voir les projets
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
