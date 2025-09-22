"use client";

import { useState, useEffect } from "react";
import { Gift, TrendingUp, Users, Package, CheckCircle2, Truck, AlertCircle, Clock } from "lucide-react";

const DonationsReceivedPage = ({ user, userType }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    received: 0,
    sent: 0
  });

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/donations/received');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des dons');
      }
      const data = await response.json();
      setDonations(data.donations || []);
      
      // Calculer les statistiques
      const total = data.donations.length;
      const pending = data.donations.filter(d => d.statut === 'EN_ATTENTE').length;
      const sent = data.donations.filter(d => d.statut === 'ENVOYE').length;
      const received = data.donations.filter(d => d.statut === 'RECEPTIONNE').length;
      
      setStats({ total, pending, sent, received });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  // Fonctions utilitaires intégrées
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (statut) => {
    const statusMap = {
      'EN_ATTENTE': {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        description: 'Don créé, en attente d\'envoi'
      },
      'ENVOYE': {
        label: 'Envoyé',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Truck,
        description: 'Don envoyé par le donateur'
      },
      'RECEPTIONNE': {
        label: 'Reçu',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
        description: 'Don reçu et confirmé'
      }
    };
    return statusMap[statut] || statusMap['EN_ATTENTE'];
  };

  const getTypeInfo = (type) => {
    const typeMap = {
      'MONETAIRE': { label: 'Monétaire', icon: '💰' },
      'VIVRES': { label: 'Vivres', icon: '🍎' },
      'NON_VIVRES': { label: 'Matériel', icon: '📚' }
    };
    return typeMap[type] || { label: type, icon: '📦' };
  };

  const getAvailableActions = (don) => {
    const actions = [];
    
    if (userType === "DONATEUR" && don.statut === "EN_ATTENTE") {
      actions.push({
        status: "ENVOYE",
        label: "Marquer comme envoyé",
        color: "bg-blue-600 hover:bg-blue-700",
        icon: Truck
      });
    }
    
    if ((userType === "ETABLISSEMENT" || userType === "ENSEIGNANT") && don.statut === "ENVOYE") {
      actions.push({
        status: "RECEPTIONNE",
        label: "Confirmer la réception",
        color: "bg-green-600 hover:bg-green-700",
        icon: CheckCircle2
      });
    }

    return actions;
  };

  const getDestinationDisplay = (don) => {
    if (don.project) {
      return {
        primary: don.project.titre,
        secondary: don.project.etablissement?.nom || 'Projet'
      };
    } else if (don.beneficiaireEtab) {
      return {
        primary: don.beneficiaireEtab.nom,
        secondary: 'Établissement'
      };
    } else if (don.beneficiairePersonnel) {
      return {
        primary: don.beneficiairePersonnel.fullName,
        secondary: 'Personnel éducatif'
      };
    }
    return { primary: 'Destination inconnue', secondary: '' };
  };

  const handleStatusUpdate = async (donId, newStatus) => {
    setUpdatingStatus(donId);
    
    try {
      const response = await fetch(`/api/donations/${donId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      const result = await response.json();
      
      // Mettre à jour la liste des dons
      setDonations(prevDonations => 
        prevDonations.map(don => 
          don.id === donId ? result.donation : don
        )
      );
      
      // Recalculer les stats
      loadDonations();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getTitle = () => {
    switch (userType) {
      case "ETABLISSEMENT":
        return "Dons reçus par l'établissement";
      case "ENSEIGNANT":
        return "Dons personnels reçus";
      default:
        return "Dons reçus";
    }
  };

  const getDescription = () => {
    switch (userType) {
      case "ETABLISSEMENT":
        return "Gérez les dons reçus pour vos projets et votre établissement";
      case "ENSEIGNANT":
        return "Suivez les dons que vous avez personnellement reçus";
      default:
        return "Suivez et gérez vos dons reçus";
    }
  };

  const renderDonationsList = () => {
    if (!donations || donations.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {userType === "DONATEUR" ? "Aucun don effectué" : "Aucun don reçu"}
          </h3>
          <p className="text-gray-500">
            {userType === "DONATEUR" 
              ? "Commencez par faire votre premier don"
              : "Les dons apparaîtront ici quand vous en recevrez"
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {donations.map((don) => {
          const statusInfo = getStatusInfo(don.statut);
          const typeInfo = getTypeInfo(don.type);
          const destination = getDestinationDisplay(don);
          const actions = getAvailableActions(don);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={don.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-800">{don.libelle}</h3>
                      <p className="text-sm text-slate-600">
                        vers {destination.primary}
                        {destination.secondary && (
                          <span className="text-slate-500"> • {destination.secondary}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {don.quantite && (
                    <p className="text-sm text-slate-600 mb-2">
                      Quantité: {don.quantite}
                    </p>
                  )}

                  {userType !== "DONATEUR" && don.donateur && (
                    <p className="text-sm text-slate-600 mb-2">
                      Don de: {don.donateur.fullName}
                    </p>
                  )}
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{statusInfo.label}</span>
                </div>
              </div>

              {/* Timeline des dates */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Suivi du don</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-600">
                      Créé le {formatDate(don.createdAt)}
                    </span>
                  </div>
                  
                  {don.dateEnvoi && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-600">
                        Envoyé le {formatDate(don.dateEnvoi)}
                      </span>
                    </div>
                  )}
                  
                  {don.dateReception && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600">
                        Reçu le {formatDate(don.dateReception)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions disponibles */}
              {actions.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">Actions disponibles:</span>
                  {actions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.status}
                        onClick={() => handleStatusUpdate(don.id, action.status)}
                        disabled={updatingStatus === don.id}
                        className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${action.color}`}
                      >
                        {updatingStatus === don.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Mise à jour...
                          </>
                        ) : (
                          <>
                            <ActionIcon className="w-4 h-4" />
                            {action.label}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Message d'état */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {statusInfo.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{getTitle()}</h1>
            <p className="text-slate-600">{getDescription()}</p>
          </div>
        </div>

        <button 
          onClick={loadDonations}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          {loading ? "⏳ Chargement..." : "🔄 Actualiser"}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-500">Total des dons</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">⏳</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-slate-500">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📤</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
              <div className="text-sm text-slate-500">Envoyés</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.received}</div>
              <div className="text-sm text-slate-500">Reçus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Gestion des dons</h2>
          <p className="text-slate-600 mt-1">
            Confirmez la réception des dons qui vous sont destinés
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Chargement des dons...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadDonations}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : (
            renderDonationsList()
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Comment ça marche
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p>• <strong>En attente</strong> : Le donateur a créé le don mais ne l'a pas encore envoyé</p>
          <p>• <strong>Envoyé</strong> : Le donateur a confirmé l'envoi, vous pouvez maintenant confirmer la réception</p>
          <p>• <strong>Reçu</strong> : Vous avez confirmé avoir bien reçu le don</p>
        </div>
      </div>
    </div>
  );
};

export default DonationsReceivedPage;