
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDonationStats } from "@/lib/hooks/useDonationStats";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import {
  Gift,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  Star,
  Plus,
  RefreshCw,
  Package,
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  Zap,
  Eye,
  Sparkles,
  Award,
  Search
} from "lucide-react";
import UpdatedDonationStatusManager from "../donations/DonationStatusManager";
import DonationSuccessModal from "../donations/DonationSuccesModal";
import DonationModal from "../donations/DonationModal";

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

  // State pour la modal de succès
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    donation: any;
  }>({
    isOpen: false,
    donation: null
  });

  const [stats, setStats] = useState({
    totalDons: 0,
    projetsSoutenus: 0,
    totalMonetaire: 0,
    enAttente: 0,
    envoyes: 0,
    recus: 0
  });

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Charger les dons de l'utilisateur
  // const loadDonations = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await fetch('/api/donations');
      
  //     if (!response.ok) {
  //       throw new Error('Erreur lors du chargement des dons');
  //     }
      
  //     const data = await response.json();
  //     setDonations(data.donations || []);
      
  //     const totalDons = data.donations.length;
  //     const projetsSoutenus = new Set(
  //       data.donations
  //         .filter(d => d.destination.type === 'project')
  //         .map(d => d.destination.name)
  //     ).size;

  //     const totalMonetaire = data.donations
  //       .filter(d => d.type === 'MONETAIRE' && d.montant)
  //       .reduce((sum, d) => sum + (d.montant || 0), 0);

  //     const enAttente = data.donations.filter(d => d.statut === 'EN_ATTENTE').length;
  //     const envoyes = data.donations.filter(d => d.statut === 'ENVOYE').length;
  //     const recus = data.donations.filter(d => d.statut === 'RECEPTIONNE').length;
      
  //     setStats({
  //       totalDons,
  //       projetsSoutenus,
  //       totalMonetaire,
  //       enAttente,
  //       envoyes,
  //       recus
  //     });
  //   } catch (error) {
  //     console.error('Erreur chargement dons:', error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadDonations = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/donations');
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des dons');
    }
    
    const data = await response.json();
    console.log('Data received:', data); // ✅ Vérifiez la structure
    console.log('Donations:', data.donations); // ✅ Vérifiez si donations existe
    
    // ✅ Vérification défensive
    const donationsList = data.donations || [];
    setDonations(donationsList);
    
    const totalDons = donationsList.length;
    const projetsSoutenus = new Set(
      donationsList
        .filter(d => d.destination?.type === 'project')
        .map(d => d.destination?.name)
        .filter(Boolean) // Enlever les valeurs null/undefined
    ).size;

    const totalMonetaire = donationsList
      .filter(d => d.type === 'MONETAIRE' && d.montant)
      .reduce((sum, d) => sum + (d.montant || 0), 0);

    const enAttente = donationsList.filter(d => d.statut === 'EN_ATTENTE').length;
    const envoyes = donationsList.filter(d => d.statut === 'ENVOYE').length;
    const recus = donationsList.filter(d => d.statut === 'RECEPTIONNE').length;
    
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
    setDonations([]); // ✅ Réinitialiser à un tableau vide en cas d'erreur
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadDonations();
  }, []);

  // Préparer les données pour la modal de succès
  const getDestinationForModal = (donation: any) => {
    if (donation.project) {
      return {
        primary: donation.project.titre,
        secondary: donation.project.etablissement?.nom || 'Projet'
      };
    } else if (donation.beneficiaireEtab) {
      return {
        primary: donation.beneficiaireEtab.nom,
        secondary: 'Établissement'
      };
    } else if (donation.beneficiairePersonnel) {
      return {
        primary: donation.beneficiairePersonnel.fullName,
        secondary: 'Personnel éducatif'
      };
    }
    if (donation.destination) {
    return {
      primary: donation.destination.name || donation.destination.primary || 'Destination',
      secondary: donation.destination.etablissement || donation.destination.secondary || ''
    };
  }
    return { 
      primary: 'Destination inconnue',
       secondary: '' 
      };
  };

  const handleDonationSuccess = (newDonation) => {
    loadDonations();
    refreshStats();
    
    // Préparer les données pour la modal
    const modalDonation = {
      libelle: newDonation.libelle,
      type: newDonation.type,
      montant: newDonation.montant,
      items: newDonation.items,
      destination: getDestinationForModal(newDonation)
    };

    // Ouvrir la modal de succès
    setSuccessModal({
      isOpen: true,
      donation: modalDonation
    });
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
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Projets suivis</h3>
              <p className="text-slate-500 mb-6">
                Découvrez et suivez les projets qui vous intéressent
              </p>
              <Link 
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Search className="w-5 h-5" />
                Découvrir des projets
              </Link>
            </div>
          </div>
        );

      case "activite":
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Activité récente</h3>
              <p className="text-slate-500">
                Cette section affichera votre activité récente sur la plateforme
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Chargement de vos dons...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadDonations}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </button>
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Aucun don pour le moment</h3>
                <p className="text-slate-500 mb-6">
                  Commencez par faire votre premier don pour soutenir l'éducation
                </p>
                <button
                  onClick={() => setIsDonationModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Faire mon premier don
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-800">{stats.totalDons}</div>
                        <div className="text-sm text-slate-500">Total des dons</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          {formatAmount(stats.totalMonetaire)} Ar
                        </div>
                        <div className="text-sm text-slate-500">Total donné</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <Send className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.envoyes}</div>
                        <div className="text-sm text-slate-500">Envoyés</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">{stats.recus}</div>
                        <div className="text-sm text-slate-500">Reçus</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Gestion de mes dons</h3>
                        <p className="text-slate-600 text-sm">
                          Suivez le statut de vos contributions et marquez-les comme envoyées
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <UpdatedDonationStatusManager
                      donations={donations}
                      onStatusUpdate={handleStatusUpdate}
                      userType="DONATEUR"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-emerald-800">Résumé de mes contributions</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">
                        {donations.filter(d => d.type === 'MONETAIRE').length}
                      </div>
                      <div className="text-emerald-600 font-medium mb-1">Dons monétaires</div>
                      <div className="text-xs text-emerald-500 flex items-center justify-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatAmount(donations
                          .filter(d => d.type === 'MONETAIRE' && d.montant)
                          .reduce((sum, d) => sum + (d.montant || 0), 0)
                        )} Ar
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">
                        {donations.filter(d => d.type === 'VIVRES').length}
                      </div>
                      <div className="text-emerald-600 font-medium">Dons alimentaires</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">
                        {donations.filter(d => d.type === 'NON_VIVRES').length}
                      </div>
                      <div className="text-emerald-600 font-medium">Dons matériels</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">{stats.projetsSoutenus}</div>
                      <div className="text-emerald-600 font-medium">Projets soutenus</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Profil donateur */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-center mb-3">
              <AvatarDisplay
                name={user.fullName || "Donateur"}
                avatar={user.avatar}
                size="lg"
                showBorder={true}
              />
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
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-emerald-600">
                  {loading ? "..." : stats.totalDons}
                </div>
                <div className="text-xs text-slate-600">Dons</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-blue-600">
                  {loading ? "..." : stats.projetsSoutenus}
                </div>
                <div className="text-xs text-slate-600">Projets</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
                <div className="text-base font-semibold text-purple-600">
                  {loading ? "..." : formatAmount(stats.totalMonetaire/1000) + "K"}
                </div>
                <div className="text-xs text-slate-600">Ar donnés</div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <ul className="space-y-1 text-sm">
              <li>
                <button 
                  onClick={() => setActiveTab("dons")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeTab === "dons" 
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span className="font-medium">Mes dons</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab("projets")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    activeTab === "projets" 
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Projets suivis</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Favoris</span>
                </button>
              </li>
              <li>
                <Link href="/dashboard/friends" className="block">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Mes amis</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/messages" className="block">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Messages</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/edit" className="block">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Paramètres</span>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header / Tabs */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {activeTab === "dons" && "Mes Dons"}
                  {activeTab === "projets" && "Projets Suivis"}
                  {activeTab === "activite" && "Activité"}
                </h2>
                <p className="text-sm text-slate-600">
                  {activeTab === "dons" && "Suivez vos contributions et gérez leur statut"}
                  {activeTab === "projets" && "Découvrez et soutenez des projets éducatifs"}
                  {activeTab === "activite" && "Consultez votre activité récente"}
                </p>
              </div>
              <button 
                onClick={loadDonations}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-white/50 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab("dons")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeTab === "dons" 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <Gift className="w-4 h-4" />
                Dons
              </button>
              <button 
                onClick={() => setActiveTab("projets")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeTab === "projets" 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <Target className="w-4 h-4" />
                Projets suivis
              </button>
              <button 
                onClick={() => setActiveTab("activite")}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  activeTab === "activite" 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md" 
                    : "hover:bg-white/50"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Activité
              </button>
            </div>
          </div>

          {/* Content */}
          {renderMainContent()}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold">Mon Impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">{stats.totalDons}</div>
                <div className="text-xs opacity-90">Contributions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">{stats.projetsSoutenus}</div>
                <div className="text-xs opacity-90">Projets soutenus</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">{stats.recus}</div>
                <div className="text-xs opacity-90">Dons reçus</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xl font-bold">
                  {formatAmount(stats.totalMonetaire/1000)}K
                </div>
                <div className="text-xs opacity-90">Ar donnés</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-800">Actions rapides</h3>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsDonationModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              >
                <Plus className="w-4 h-4" />
                Faire un don
              </button>
              <Link href="/projects">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                  <Search className="w-4 h-4" />
                  Découvrir des projets
                </button>
              </Link>
              <Link href="dashboard/messages">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                <MessageSquare className="w-4 h-4" />
                Contacter un établissement
              </button>
              </Link>
            </div>
          </div>

          {stats.enAttente > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-yellow-800">Actions requises</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                Vous avez {stats.enAttente} don(s) en attente d'envoi
              </p>
              <button 
                onClick={() => setActiveTab("dons")}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 rounded-lg hover:from-yellow-200 hover:to-amber-200 transition-all text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Gérer mes dons
              </button>
            </div>
          )}

          {stats.recus > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-green-800">Bravo !</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                {stats.recus} de vos dons ont été reçus avec succès
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 bg-white rounded-lg p-3 border border-green-200">
                <Heart className="w-4 h-4" />
                Merci pour votre contribution à l'éducation !
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800">Astuce du jour</h3>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-sm text-indigo-800 leading-relaxed">
                <strong className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Le saviez-vous ?
                </strong>
                Vous pouvez suivre l'évolution de vos dons en temps réel et recevoir des notifications quand ils sont reçus.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSuccess={handleDonationSuccess}
      />

      <DonationSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, donation: null })}
        donation={successModal.donation}
      />
    </div>
  );
}