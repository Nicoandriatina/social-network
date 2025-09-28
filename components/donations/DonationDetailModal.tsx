// components/donations/DonationDetailModal.tsx
"use client";

import { useState } from "react";
import { 
  X, 
  User, 
  Calendar, 
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  FileText,
  Building2,
  GraduationCap,
  Image as ImageIcon,
  Download
} from "lucide-react";

interface DonationDetailModalProps {
  donation: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (donationId: string, newStatus: string) => void;
}

export default function DonationDetailModal({ 
  donation, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: DonationDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!isOpen || !donation) return null;

  const getStatusInfo = (statut: string) => {
    const statusMap = {
      'EN_ATTENTE': { 
        label: 'En attente', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        description: 'Le don a été créé mais pas encore envoyé'
      },
      'ENVOYE': { 
        label: 'Envoyé', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Truck,
        description: 'Le donateur a confirmé l\'envoi du don'
      },
      'RECEPTIONNE': { 
        label: 'Reçu', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
        description: 'Le don a été reçu et confirmé'
      }
    };
    return statusMap[statut] || statusMap['EN_ATTENTE'];
  };

  const getTypeInfo = (type: string) => {
    const typeMap = {
      'MONETAIRE': { label: 'Don monétaire', icon: '💰', color: 'text-green-600' },
      'VIVRES': { label: 'Don alimentaire', icon: '🍎', color: 'text-orange-600' },
      'NON_VIVRES': { label: 'Don matériel', icon: '📚', color: 'text-blue-600' }
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
        subtitle: 'Don général à l\'établissement',
        icon: Building2
      };
    } else if (donation.beneficiairePersonnel) {
      return {
        type: 'Personnel',
        name: donation.beneficiairePersonnel.fullName,
        subtitle: 'Don personnel à un enseignant',
        icon: GraduationCap
      };
    }
    return { type: 'Inconnu', name: 'Destination inconnue', icon: Package };
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!onStatusUpdate) return;
    
    setUpdatingStatus(true);
    try {
      await onStatusUpdate(donation.id, newStatus);
      // Le modal sera fermé par le parent après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusInfo = getStatusInfo(donation.statut);
  const typeInfo = getTypeInfo(donation.type);
  const destinationInfo = getDestinationInfo(donation);
  const StatusIcon = statusInfo.icon;
  const DestinationIcon = destinationInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
              {donation.donateur.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{donation.libelle}</h2>
              <p className="text-slate-600">Don de {donation.donateur.fullName}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statut et Actions */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${statusInfo.color}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-medium">{statusInfo.label}</span>
              </div>
              <span className="text-sm text-slate-600">{statusInfo.description}</span>
            </div>

            {donation.statut === 'ENVOYE' && (
              <button
                onClick={() => handleStatusUpdate('RECEPTIONNE')}
                disabled={updatingStatus}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Confirmation...' : 'Confirmer la réception'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations du don */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Informations du don</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div>
                    <div className={`font-medium ${typeInfo.color}`}>{typeInfo.label}</div>
                    {donation.type === 'MONETAIRE' && donation.montant && (
                      <div className="text-lg font-bold text-green-600">
                        {formatAmount(donation.montant)} Ar
                      </div>
                    )}
                    {donation.quantite && (
                      <div className="text-slate-600">
                        Quantité: {donation.quantite} unités
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DestinationIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">{destinationInfo.type}</div>
                    <div className="text-slate-600">{destinationInfo.name}</div>
                    {destinationInfo.subtitle && (
                      <div className="text-sm text-slate-500">{destinationInfo.subtitle}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-800">Donateur</div>
                    <div className="text-slate-600">{donation.donateur.fullName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Chronologie</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-slate-800">Don créé</div>
                    <div className="text-sm text-slate-600">
                      {formatDate(donation.createdAt)}
                    </div>
                  </div>
                </div>

                {donation.dateEnvoi && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-slate-800">Don envoyé</div>
                      <div className="text-sm text-slate-600">
                        {formatDate(donation.dateEnvoi)}
                      </div>
                    </div>
                  </div>
                )}

                {donation.dateReception && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-slate-800">Don reçu</div>
                      <div className="text-sm text-slate-600">
                        {formatDate(donation.dateReception)}
                      </div>
                    </div>
                  </div>
                )}

                {donation.statut === 'EN_ATTENTE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <div className="text-sm text-slate-500">
                        En attente de l'envoi par le donateur
                      </div>
                    </div>
                  </div>
                )}

                {donation.statut === 'ENVOYE' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <div className="text-sm text-slate-500">
                        En attente de confirmation de réception
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photos */}
          {donation.photos && donation.photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Photos du don</h3>
              
              {/* Photo principale */}
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <img
                  src={donation.photos[selectedImageIndex]}
                  alt="Photo du don"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Miniatures */}
              {donation.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {donation.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-indigo-500' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Fermer
            </button>
            
            {donation.photos && donation.photos.length > 0 && (
              <button
                onClick={() => window.open(donation.photos[selectedImageIndex], '_blank')}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger la photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}