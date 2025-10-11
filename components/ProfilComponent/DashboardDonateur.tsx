"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import DonationModal from "../donations/DonationModal";
import DonationStatusManager from "../donations/DonationStatusManager";
import { useDonationStats } from "@/lib/hooks/useDonationStats";

type DonateurDashboardProps = {
  user: {
    fullName?: string | null;
    avatar?: string | null;
    profession?: string | null;
  };
};


export default function DonateurDashboard({ user }: DonateurDashboardProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState<"dons" | "projets" | "activite">("dons");
  const { stats: donationStats, loading: loadingStats, refreshStats } = useDonationStats();

  const [stats, setStats] = useState({
    totalDons: 0,
    projetsSoutenus: 0,
    totalMonetaire: 0,
    enAttente: 0,
    envoyes: 0,
    recus: 0
  });

  const avatarLetters =
    (user.fullName || "Donateur")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DN";

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Charger les dons de l'utilisateur
  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/donations');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des dons');
      }
      
      const data = await response.json();
      setDonations(data.donations || []);
      
      // Calculer les stats locales (du côté donateur)
      const totalDons = data.donations.length;
      const projetsSoutenus = new Set(
        data.donations
          .filter(d => d.destination.type === 'project')
          .map(d => d.destination.name)
      ).size;

      // Calculer le total monétaire donné
      const totalMonetaire = data.donations
        .filter(d => d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0);

      const enAttente = data.donations.filter(d => d.statut === 'EN_ATTENTE').length;
      const envoyes = data.donations.filter(d => d.statut === 'ENVOYE').length;
      const recus = data.donations.filter(d => d.statut === 'RECEPTIONNE').length;
      
      setStats({
        totalDons,
        projetsSoutenus,
        totalMonetaire,
        enAttente,
        envoyes,
        recus
      });
    } catch (error) {
      console.error('Erreur chargement dons:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleDonationSuccess = (newDonation) => {
    loadDonations();
    refreshStats(); // Actualiser aussi les stats globales
    alert(`Don "${newDonation.libelle}" créé avec succès !`);
  };

  const handleStatusUpdate = (updatedDonation) => {
    setDonations(prevDonations => 
      prevDonations.map(don => 
        don.id === updatedDonation.id ? updatedDonation : don
      )
    );
    loadDonations();
    refreshStats();
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case "projets":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Projets suivis</h3>
              <p className="text-slate-500 mb-6">
                Découvrez et suivez les projets qui vous intéressent
              </p>
              <Link 
                href="/projects"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Découvrir des projets
              </Link>
            </div>
          </div>
        );

      case "activite":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Activité récente</h3>
              <p className="text-slate-500">
                Cette section affichera votre activité récente sur la plateforme
              </p>
            </div>
          </div>
        );

      default: // dons
        return (
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Chargement de vos dons...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadDonations}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun don pour le moment</h3>
                <p className="text-slate-500 mb-6">
                  Commencez par faire votre premier don pour soutenir l'éducation
                </p>
                <button
                  onClick={() => setIsDonationModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Faire mon premier don
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistiques rapides avec montants */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-600 text-sm">📦</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-800">{stats.totalDons}</div>
                        <div className="text-sm text-slate-500">Total des dons</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">💰</span>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          {formatAmount(stats.totalMonetaire)} Ar
                        </div>
                        <div className="text-sm text-slate-500">Total donné</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📤</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.envoyes}</div>
                        <div className="text-sm text-slate-500">Envoyés</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 text-sm">✅</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">{stats.recus}</div>
                        <div className="text-sm text-slate-500">Reçus</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gestionnaire de statut des dons */}
                <div className="bg-white border border-slate-200 rounded-2xl">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Gestion de mes dons</h3>
                    <p className="text-slate-600 mt-1">
                      Suivez le statut de vos contributions et marquez-les comme envoyées
                    </p>
                  </div>
                  <div className="p-6">
                    <DonationStatusManager
                      donations={donations}
                      onStatusUpdate={handleStatusUpdate}
                      userType="DONATEUR"
                    />
                  </div>
                </div>

                {/* Résumé des contributions */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-emerald-800 mb-4">Résumé de mes contributions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700">
                        {donations.filter(d => d.type === 'MONETAIRE').length}
                      </div>
                      <div className="text-emerald-600">Dons monétaires</div>
                      <div className="text-xs text-emerald-500 mt-1">
                        {formatAmount(donations
                          .filter(d => d.type === 'MONETAIRE' && d.montant)
                          .reduce((sum, d) => sum + (d.montant || 0), 0)
                        )} Ar
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700">
                        {donations.filter(d => d.type === 'VIVRES').length}
                      </div>
                      <div className="text-emerald-600">Dons alimentaires</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700">
                        {donations.filter(d => d.type === 'NON_VIVRES').length}
                      </div>
                      <div className="text-emerald-600">Dons matériels</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700">{stats.projetsSoutenus}</div>
                      <div className="text-emerald-600">Projets soutenus</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      
      {/* 3 colonnes */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Profil donateur */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {avatarLetters}
            </div>
            <div className="text-center mt-3">
              <h3 className="font-semibold text-slate-800">
                {user.fullName || "Donateur(trice)"}
              </h3>
              <p className="text-sm text-slate-500">
                {user.profession || "Ami de l'éducation"}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {loading ? "..." : stats.totalDons}
                </div>
                <div className="text-xs text-slate-500">Dons</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {loading ? "..." : stats.projetsSoutenus}
                </div>
                <div className="text-xs text-slate-500">Projets</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-slate-800">
                  {loading ? "..." : formatAmount(stats.totalMonetaire/1000) + "K"}
                </div>
                <div className="text-xs text-slate-500">Ar donnés</div>
              </div>
            </div>
          </div>

          {/* Menu */}
         <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
          <ul className="space-y-1 text-sm">
            <li>
              <button 
                onClick={() => setActiveTab("dons")}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "dons" 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg"
                }`}
              >
                💝 Mes dons
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab("projets")}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === "projets" 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg"
                }`}
              >
                🧩 Projets suivis
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-xl text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg">
                ⭐ Favoris
              </button>
            </li>
            <li>
              <Link href="/dashboard/friends" className="block">
                <button className="w-full text-left px-3 py-2 rounded-xl text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg">
                  👥 Mes amis
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/messages" className="block">
                <button className="w-full text-left px-3 py-2 rounded-xl text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg">
                  💬 Messages
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/edit" className="block">
                <button className="w-full text-left px-3 py-2 rounded-xl text-slate-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:shadow-lg">
                  ⚙️ Paramètres
                </button>
              </Link>
            </li>
          </ul>
        </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header / Tabs */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {activeTab === "dons" && "Mes Dons"}
                  {activeTab === "projets" && "Projets Suivis"}
                  {activeTab === "activite" && "Activité"}
                </h2>
                <p className="text-sm text-slate-500">
                  {activeTab === "dons" && "Suivez vos contributions et gérez leur statut"}
                  {activeTab === "projets" && "Découvrez et soutenez des projets éducatifs"}
                  {activeTab === "activite" && "Consultez votre activité récente"}
                </p>
              </div>
              <button 
                onClick={loadDonations}
                className="px-3 py-1.5 rounded-lg text-sm hover:bg-white/50 transition-colors"
                disabled={loading}
              >
                {loading ? "⏳" : "🔄"} Actualiser
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab("dons")}
                className={`px-3 py-2 text-sm rounded-xl transition-colors ${
                  activeTab === "dons" 
                    ? "bg-emerald-600 text-white" 
                    : "hover:bg-slate-100"
                }`}
              >
                💝 Dons
              </button>
              <button 
                onClick={() => setActiveTab("projets")}
                className={`px-3 py-2 text-sm rounded-xl transition-colors ${
                  activeTab === "projets" 
                    ? "bg-emerald-600 text-white" 
                    : "hover:bg-slate-100"
                }`}
              >
                🧩 Projets suivis
              </button>
              <button 
                onClick={() => setActiveTab("activite")}
                className={`px-3 py-2 text-sm rounded-xl transition-colors ${
                  activeTab === "activite" 
                    ? "bg-emerald-600 text-white" 
                    : "hover:bg-slate-100"
                }`}
              >
                📈 Activité
              </button>
            </div>
          </div>

          {/* Content */}
          {renderMainContent()}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-500">
            <h3 className="font-semibold">📊 Mon Impact</h3>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
              <div>
                <div className="text-lg font-bold">{stats.totalDons}</div>
                <div className="text-xs opacity-90">Contributions</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.projetsSoutenus}</div>
                <div className="text-xs opacity-90">Projets soutenus</div>
              </div>
              <div>
                <div className="text-lg font-bold">{stats.recus}</div>
                <div className="text-xs opacity-90">Dons reçus</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {formatAmount(stats.totalMonetaire/1000)}K
                </div>
                <div className="text-xs opacity-90">Ar donnés</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">⚡ Actions rapides</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsDonationModalOpen(true)}
                className="btn btn-primary bg-emerald-600 text-white rounded-xl py-2 hover:bg-emerald-700 transition-colors"
              >
                ➕ Faire un don
              </button>
              <Link href="/projects">
                <button className="w-full btn btn-secondary border rounded-xl py-2 hover:bg-slate-50 transition-colors">
                  🧩 Découvrir des projets
                </button>
              </Link>
              <button className="btn btn-secondary border rounded-xl py-2 hover:bg-slate-50 transition-colors">
                💬 Contacter un établissement
              </button>
            </div>
          </div>

          {/* Actions sur les dons en attente */}
          {stats.enAttente > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <h3 className="font-semibold text-yellow-800 mb-2">⏳ Actions requises</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Vous avez {stats.enAttente} don(s) en attente d'envoi
              </p>
              <button 
                onClick={() => setActiveTab("dons")}
                className="w-full px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
              >
                Gérer mes dons
              </button>
            </div>
          )}

          {/* Félicitations */}
          {stats.recus > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Bravo !</h3>
              <p className="text-sm text-green-700 mb-3">
                {stats.recus} de vos dons ont été reçus avec succès
              </p>
              <div className="text-xs text-green-600">
                Merci pour votre contribution à l'éducation !
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Modal de création de don */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
}