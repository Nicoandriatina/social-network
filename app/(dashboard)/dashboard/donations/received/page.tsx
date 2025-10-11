"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Filter, 
  Search, 
  Download, 
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  User,
  Building2,
  GraduationCap,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity
} from "lucide-react";
import DonationDetailModal from "@/components/donations/DonationDetailModal";
import DonationActivityHistory from "@/components/donations/DonationActivityHistory";

export default function EnhancedDonationsReceivedPage() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États UI
  const [activeView, setActiveView] = useState<'donations' | 'history'>('donations');
  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/donations/received');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des donations');
      }
      
      const data = await response.json();
      setDonations(data.donations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  // Filtrage des donations
  const filteredDonations = useMemo(() => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(don =>
        don.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        don.donateur.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statutFilter !== 'all') {
      filtered = filtered.filter(don => don.statut === statutFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(don => don.type === typeFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(don => 
        new Date(don.createdAt) >= cutoffDate
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [donations, searchTerm, statutFilter, typeFilter, dateFilter]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      total: donations.length,
      totalMonetaire: donations
        .filter(d => d.type === 'MONETAIRE' && d.montant)
        .reduce((sum, d) => sum + (d.montant || 0), 0),
      enAttente: donations.filter(d => d.statut === 'EN_ATTENTE').length,
      envoyes: donations.filter(d => d.statut === 'ENVOYE').length,
      recus: donations.filter(d => d.statut === 'RECEPTIONNE').length,
      donatersUniques: new Set(donations.map(d => d.donateur.id)).size
    };
  }, [donations]);

  const handleStatusUpdate = async (donationId: string, newStatus: string) => {
    setUpdatingStatus(donationId);
    
    try {
      const response = await fetch(`/api/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      await loadDonations();
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (statut: string) => {
    const statusMap = {
      'EN_ATTENTE': { 
        label: 'En attente', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock 
      },
      'ENVOYE': { 
        label: 'Envoyé', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Truck 
      },
      'RECEPTIONNE': { 
        label: 'Reçu', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2 
      }
    };
    return statusMap[statut] || statusMap['EN_ATTENTE'];
  };

  const getTypeInfo = (type: string) => {
    const typeMap = {
      'MONETAIRE': { label: 'Monétaire', icon: '💰', color: 'text-green-600' },
      'VIVRES': { label: 'Vivres', icon: '🍎', color: 'text-orange-600' },
      'NON_VIVRES': { label: 'Matériel', icon: '📚', color: 'text-blue-600' }
    };
    return typeMap[type] || { label: type, icon: '📦', color: 'text-gray-600' };
  };

  const getDestinationInfo = (donation: any) => {
    if (donation.project) {
      return {
        type: 'Projet',
        name: donation.project.titre,
        subtitle: donation.project.etablissement?.nom,
        icon: FileText
      };
    } else if (donation.beneficiaireEtab) {
      return {
        type: 'Établissement',
        name: donation.beneficiaireEtab.nom,
        subtitle: 'Don général',
        icon: Building2
      };
    } else if (donation.beneficiairePersonnel) {
      return {
        type: 'Personnel',
        name: donation.beneficiairePersonnel.fullName,
        subtitle: 'Don personnel',
        icon: GraduationCap
      };
    }
    return { type: 'Inconnu', name: 'Destination inconnue', icon: Package };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des donations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-red-700 mb-2">Erreur de chargement</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDonations}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre de contrôle - SIMPLE SANS HEADER DUPLIQUÉ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Toggle Vue */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setActiveView('donations')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'donations'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Donations
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'history'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Historique
              </button>
            </div>

            {/* Boutons d'action */}
            {activeView === 'donations' && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    showFilters 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === 'donations' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar avec statistiques et filtres */}
            <div className="space-y-6">
              {/* Statistiques rapides */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Vue d'ensemble
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total des dons:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Montant total:</span>
                    <span className="font-semibold text-green-600">
                      {formatAmount(stats.totalMonetaire)} Ar
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Donateurs uniques:</span>
                    <span className="font-semibold">{stats.donatersUniques}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-600">En attente:</span>
                      <span className="font-medium">{stats.enAttente}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600">Envoyés:</span>
                      <span className="font-medium">{stats.envoyes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Reçus:</span>
                      <span className="font-medium">{stats.recus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div className={`bg-white rounded-2xl border border-slate-200 p-6 transition-all ${
                showFilters ? 'block' : 'hidden lg:block'
              }`}>
                <h3 className="font-semibold text-slate-800 mb-4">Filtres</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rechercher
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nom du donateur, libellé..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={statutFilter}
                      onChange={(e) => setStatutFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="EN_ATTENTE">En attente</option>
                      <option value="ENVOYE">Envoyés</option>
                      <option value="RECEPTIONNE">Reçus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type de don
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Tous les types</option>
                      <option value="MONETAIRE">Monétaires</option>
                      <option value="VIVRES">Vivres</option>
                      <option value="NON_VIVRES">Matériels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Période
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Toutes les périodes</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                    </select>
                  </div>

                  {(searchTerm || statutFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatutFilter('all');
                        setTypeFilter('all');
                        setDateFilter('all');
                      }}
                      className="w-full px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Liste des donations */}
            <div className="space-y-4">
              {filteredDonations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Aucune donation trouvée
                  </h3>
                  <p className="text-slate-500">
                    Les donations apparaîtront ici quand vous en recevrez
                  </p>
                </div>
              ) : (
                filteredDonations.map((donation) => {
                  const statusInfo = getStatusInfo(donation.statut);
                  const typeInfo = getTypeInfo(donation.type);
                  const destinationInfo = getDestinationInfo(donation);
                  const StatusIcon = statusInfo.icon;
                  const DestinationIcon = destinationInfo.icon;

                  return (
                    <div key={donation.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                            {donation.donateur.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{donation.libelle}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                {statusInfo.label}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {donation.donateur.fullName}
                              </span>
                              
                              <span className={`flex items-center gap-1 ${typeInfo.color}`}>
                                <span>{typeInfo.icon}</span>
                                {typeInfo.label}
                                {donation.type === 'MONETAIRE' && donation.montant && (
                                  <span className="font-semibold ml-1">
                                    {formatAmount(donation.montant)} Ar
                                  </span>
                                )}
                                {donation.quantite && (
                                  <span className="font-semibold ml-1">
                                    {donation.quantite} unités
                                  </span>
                                )}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                              <DestinationIcon className="w-4 h-4" />
                              <span>{destinationInfo.type}: {destinationInfo.name}</span>
                              {destinationInfo.subtitle && (
                                <span className="text-slate-400">• {destinationInfo.subtitle}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {donation.statut === 'ENVOYE' && (
                            <button
                              onClick={() => handleStatusUpdate(donation.id, 'RECEPTIONNE')}
                              disabled={updatingStatus === donation.id}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                            >
                              {updatingStatus === donation.id ? 'Confirmation...' : 'Confirmer réception'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => setSelectedDonation(donation)}
                            className="p-2 hover:bg-slate-100 rounded-lg group"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                          </button>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Suivi du don</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            <span className="text-slate-600">
                              Créé le {formatDate(donation.createdAt)}
                            </span>
                          </div>
                          
                          {donation.dateEnvoi && (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-slate-600">
                                Envoyé le {formatDate(donation.dateEnvoi)}
                              </span>
                            </div>
                          )}
                          
                          {donation.dateReception && (
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-slate-600">
                                Reçu le {formatDate(donation.dateReception)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Photos */}
                      {donation.photos && donation.photos.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-slate-700 mb-2">Photos</h4>
                          <div className="flex gap-2">
                            {donation.photos.slice(0, 3).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt="Photo du don"
                                className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                                onClick={() => setSelectedDonation(donation)}
                              />
                            ))}
                            {donation.photos.length > 3 && (
                              <div className="w-16 h-16 bg-slate-200 rounded-lg border flex items-center justify-center cursor-pointer">
                                <span className="text-xs text-slate-600">+{donation.photos.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Vue historique */
          <div className="max-w-4xl mx-auto">
            <DonationActivityHistory 
              showDonationInfo={true}
              limit={30}
            />
          </div>
        )}
      </div>

      {/* Modal de détails */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onStatusUpdate={async (donationId, newStatus) => {
          await handleStatusUpdate(donationId, newStatus);
          setSelectedDonation(null);
        }}
      />
    </div>
  );
}