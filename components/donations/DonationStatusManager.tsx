"use client";

import { useState } from "react";
import { CheckCircle2, Package, Truck, AlertCircle, Clock } from "lucide-react";

const DonationStatusManager = ({ donations, onStatusUpdate, userType }) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);

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

  const canUpdateStatus = (don, newStatus) => {
    if (userType === "DONATEUR") {
      return don.donateurId === "current-user-id" && newStatus === "ENVOYE";
    } else if (userType === "ETABLISSEMENT") {
      return newStatus === "RECEPTIONNE";
    } else if (userType === "ENSEIGNANT") {
      return don.personnelId === "current-user-id" && newStatus === "RECEPTIONNE";
    }
    return false;
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
      onStatusUpdate(result.donation);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + error.message);
    } finally {
      setUpdatingStatus(null);
    }
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

export default DonationStatusManager;