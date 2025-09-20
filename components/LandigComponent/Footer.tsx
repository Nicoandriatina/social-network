"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-md rounded-2xl text-white py-10 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm text-white/80">
        {/* Colonne 1 */}
        <div>
          <h4 className="text-lg text-teal-400 font-semibold mb-3">
            Mada Social Network
          </h4>
          <p>
            La plateforme qui connecte l'éducation malgache pour un avenir meilleur.
          </p>
        </div>

        {/* Colonne 2 */}
        <div>
          <h4 className="text-lg text-teal-400 font-semibold mb-3">
            Liens rapides
          </h4>
          <ul className="space-y-1">
            <li>
              <Link href="/signup" className="hover:text-teal-400">
                S'inscrire
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-teal-400">
                Projets
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-teal-400">
                Se connecter
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 */}
        <div>
          <h4 className="text-lg text-teal-400 font-semibold mb-3">Support</h4>
          <ul className="space-y-1">
            <li>
              <Link href="#" className="hover:text-teal-400">
                Centre d'aide
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-teal-400">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-teal-400">
                Conditions d'utilisation
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Logos officiels centrés */}
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <Image
            src="/Logo-MEN-FR.jpg"
            alt="Logo MEN"
            width={60}
            height={60}
            className="rounded-md"
          />
          <Image
            src="/mesupres.png"
            alt="Logo MESUPRES"
            width={90}
            height={60}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="border-t border-white/20 pt-6 text-center">
        <p className="text-white/80 text-xs">
          © {new Date().getFullYear()} Mada Social Network. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
