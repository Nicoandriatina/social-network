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
  FileText,
  Building2,
  GraduationCap,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const ImprovedDonationDetailModal = ({ 
  donation, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!isOpen || !donation) return null;

  const getStatusInfo = (statut) => {
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

  const getTypeInfo = (type) => {
    const typeMap = {
      'MONETAIRE': { label: 'Don monétaire', icon: '💰', color: 'text-green-600' },
      'VIVRES': { label: 'Don alimentaire', icon: '🍎', color: 'text-orange-600' },
      'NON_VIVRES': { label: 'Don matériel', icon: '📚', color: 'text-blue-600' }
    };
    return typeMap[type] || { label: type, icon: '📦', color: 'text-gray-600' };
  };

  const getDestinationInfo = (donation) => {
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!onStatusUpdate) return;
    
    setUpdatingStatus(true);
    try {
      await onStatusUpdate(donation.id, newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const nextImage = () => {
    if (donation.photos && donation.photos.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === donation.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (donation.photos && donation.photos.length > 0) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? donation.photos.length - 1 : prev - 1
      );
    }
  };

  const statusInfo = getStatusInfo(donation.statut);
  const typeInfo = getTypeInfo(donation.type);
  const destinationInfo = getDestinationInfo(donation);
  const StatusIcon = statusInfo.icon;
  const DestinationIcon = destinationInfo.icon;
  const hasItems = donation.items && donation.items.length > 0;
  const totalQuantity = hasItems ? donation.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-slate-200 rounded-t-2xl">
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updatingStatus ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Confirmation...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmer la réception
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations du don */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Informations du don</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeInfo.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${typeInfo.color}`}>{typeInfo.label}</div>
                    
                    {/* Affichage selon le type */}
                    {donation.type === 'MONETAIRE' && donation.montant && (
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {formatAmount(donation.montant)} Ar
                      </div>
                    )}
                    
                    {hasItems && (
                      <div className="text-slate-600 mt-1">
                        {donation.items.length} article{donation.items.length > 1 ? 's' : ''} • {totalQuantity} unités au total
                      </div>
                    )}
                  </div>
                </div>

                {/* Liste des articles détaillée */}
                {hasItems && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Détail des articles
                    </h4>
                    <div className="space-y-2">
                      {donation.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-xl">{typeInfo.icon}</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{item.name}</p>
                              <p className="text-sm text-slate-500">Article {index + 1}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                              {item.quantity}
                            </div>
                            <div className="text-xs text-slate-500">unités</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Total</span>
                      <span className="text-xl font-bold text-blue-600">{totalQuantity} unités</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 pt-3 border-t">
                  <DestinationIcon className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">{destinationInfo.type}</div>
                    <div className="text-slate-600">{destinationInfo.name}</div>
                    {destinationInfo.subtitle && (
                      <div className="text-sm text-slate-500">{destinationInfo.subtitle}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t">
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
                        En cours d'acheminement, en attente de confirmation
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photos avec navigation */}
          {donation.photos && donation.photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Photos du don</h3>
              
              {/* Photo principale avec navigation */}
              <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden group">
                <img
                  src={donation.photos[selectedImageIndex]}
                  alt="Photo du don"
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation si plusieurs photos */}
                {donation.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Indicateur de position */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                      {selectedImageIndex + 1} / {donation.photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniatures */}
              {donation.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {donation.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-indigo-500 shadow-lg scale-105' 
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
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Fermer
            </button>
            
            {donation.photos && donation.photos.length > 0 && (
              <button
                onClick={() => window.open(donation.photos[selectedImageIndex], '_blank')}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2 transition-colors"
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
};

export default ImprovedDonationDetailModal;