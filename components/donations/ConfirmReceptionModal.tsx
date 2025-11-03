"use client";

import { CheckCircle2, X, AlertCircle, Package } from "lucide-react";

interface ConfirmReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  donation: {
    libelle: string;
    type: string;
    montant?: number;
    quantite?: number;
    donateur: {
      fullName: string;
    };
  } | null;
  isLoading?: boolean;
}

const ConfirmReceptionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  donation,
  isLoading = false 
}: ConfirmReceptionModalProps) => {
  if (!isOpen || !donation) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MONETAIRE': return '💰';
      case 'VIVRES': return '🍎';
      case 'NON_VIVRES': return '📚';
      default: return '📦';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MONETAIRE': return 'Monétaire';
      case 'VIVRES': return 'Vivres';
      case 'NON_VIVRES': return 'Matériel';
      default: return 'Don';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône animée */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
              <Package className="w-4 h-4" />
              Confirmation de réception
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            Confirmer la réception ?
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Vous êtes sur le point de confirmer la réception de ce don. Le donateur sera informé.
          </p>

          {/* Détails du don */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
            <div className="flex items-start gap-3 text-left">
              <span className="text-3xl">{getTypeIcon(donation.type)}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 mb-1">{donation.libelle}</p>
                <p className="text-sm text-slate-600 mb-2">
                  De <span className="font-medium">{donation.donateur.fullName}</span>
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-white rounded-lg border border-green-200 text-slate-700">
                    {getTypeLabel(donation.type)}
                  </span>
                  {donation.type === 'MONETAIRE' && donation.montant && (
                    <span className="px-2 py-1 bg-green-100 rounded-lg text-green-700 font-semibold">
                      {formatAmount(donation.montant)} Ar
                    </span>
                  )}
                  {donation.quantite && (
                    <span className="px-2 py-1 bg-green-100 rounded-lg text-green-700 font-semibold">
                      {donation.quantite} unités
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Avertissement */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm text-blue-800">
                <p className="font-semibold mb-1">Important</p>
                <p>Assurez-vous d'avoir bien reçu le don avant de confirmer. Cette action est irréversible.</p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirmation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReceptionModal;