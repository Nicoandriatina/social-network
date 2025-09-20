"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import HeaderWithDropdown from "../Header";
import DonationModal from "../DonationModal";
// import DonationModal from "./DonationModal";

type DonateurDashboardProps = {
  user: {
    fullName?: string | null;
    avatar?: string | null;
    profession?: string | null;
    // stats pour la démo
    _stats?: {
      totalDons: number;
      projetsSoutenus: number;
      impactVal: string; // ex: "8.5M Ar"
    };
  };
};

export default function DonateurDashboard({ user }: DonateurDashboardProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDons: 0,
    projetsSoutenus: 0,
    impactVal: "0 Ar"
  });

  const avatarLetters =
    (user.fullName || "Donateur")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "DN";

  // Charger les dons de l'utilisateur
  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
        
        // Calculer les stats
        const totalDons = data.donations.length;
        const projetsSoutenus = new Set(
          data.donations
            .filter(d => d.destination.type === 'project')
            .map(d => d.destination.name)
        ).size;
        
        setStats({
          totalDons,
          projetsSoutenus,
          impactVal: `${totalDons} dons`
        });
      }
    } catch (error) {
      console.error('Erreur chargement dons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleDonationSuccess = (newDonation) => {
    // Recharger les dons après création
    loadDonations();
    alert(`Don "${newDonation.libelle}" créé avec succès !`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusLabel = (statut) => {
    const labels = {
      'EN_ATTENTE': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'ENVOYE': { label: 'Envoyé', color: 'bg-blue-100 text-blue-800', icon: '📤' },
      'RECEPTIONNE': { label: 'Reçu', color: 'bg-green-100 text-green-800', icon: '✅' }
    };
    return labels[statut] || { label: statut, color: 'bg-gray-100 text-gray-800', icon: '?' };
  };

  const getTypeLabel = (type) => {
    const types = {
      'MONETAIRE': { label: 'Monétaire', icon: '💰' },
      'VIVRES': { label: 'Vivres', icon: '🍎' },
      'NON_VIVRES': { label: 'Matériel', icon: '📚' }
    };
    return types[type] || { label: type, icon: '📦' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <HeaderWithDropdown user={user} userType="donateur"/>
      
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
                  {loading ? "..." : stats.impactVal}
                </div>
                <div className="text-xs text-slate-500">Impact</div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  💝 Mes dons
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  🧩 Projets suivis
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  ⭐ Favoris
                </button>
              </li>
              <li>
                <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
                  💬 Messages
                </button>
              </li>
              <li>
                <Link href="dashboard/edit">
                  <button className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50">
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
                <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
                <p className="text-sm text-slate-500">
                  Suivez vos contributions et l'impact de vos actions
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
              <button className="px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white">
                💝 Dons
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                🧩 Projets suivis
              </button>
              <button className="px-3 py-2 text-sm rounded-xl hover:bg-slate-100">
                📈 Activité
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Chargement de vos dons...</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun don pour le moment</h3>
                <p className="text-slate-500 mb-6">Commencez par faire votre premier don pour soutenir l'éducation</p>
                <button
                  onClick={() => setIsDonationModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Faire mon premier don
                </button>
              </div>
            ) : (
              <>
                {/* Liste des dons récents */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    Mes dons récents
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {donations.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {donations.slice(0, 5).map((don) => {
                      const status = getStatusLabel(don.statut);
                      const type = getTypeLabel(don.type);
                      return (
                        <div key={don.id} className="bg-white p-4 rounded-xl border border-slate-100">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{type.icon}</span>
                                <span className="font-medium text-slate-800">{don.libelle}</span>
                              </div>
                              <div className="text-sm text-slate-600 mb-2">
                                → {don.destination.name}
                                {don.destination.etablissement && (
                                  <span className="text-slate-500"> • {don.destination.etablissement}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Créé le {formatDate(don.createdAt)}</span>
                                {don.quantite && <span>Quantité: {don.quantite}</span>}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.icon} {status.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-slate-800 mb-2">Résumé de mes contributions</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Dons monétaires: </span>
                      <span className="font-semibold">
                        {donations.filter(d => d.type === 'MONETAIRE').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Dons matériels: </span>
                      <span className="font-semibold">
                        {donations.filter(d => d.type !== 'MONETAIRE').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Dons reçus: </span>
                      <span className="font-semibold text-green-600">
                        {donations.filter(d => d.statut === 'RECEPTIONNE').length}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">En cours: </span>
                      <span className="font-semibold text-blue-600">
                        {donations.filter(d => d.statut !== 'RECEPTIONNE').length}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl p-5 text-white bg-gradient-to-br from-emerald-500 to-teal-500">
            <h3 className="font-semibold">📊 Impact global</h3>
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
                <div className="text-lg font-bold">
                  {donations.filter(d => d.statut === 'RECEPTIONNE').length}
                </div>
                <div className="text-xs opacity-90">Dons reçus</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {new Set(donations.map(d => d.destination.etablissement).filter(Boolean)).size}
                </div>
                <div className="text-xs opacity-90">Établissements</div>
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
              <button className="btn btn-secondary border rounded-xl py-2 hover:bg-slate-50 transition-colors">
                🧩 Découvrir des projets
              </button>
              <button className="btn btn-secondary border rounded-xl py-2 hover:bg-slate-50 transition-colors">
                💬 Contacter un établissement
              </button>
            </div>
          </div>
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