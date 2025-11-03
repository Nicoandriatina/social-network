"use client";

import { CheckCircle2, X, Clock, Heart, Sparkles } from "lucide-react";

interface DonationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: {
    libelle: string;
    type: string;
    montant?: number;
    items?: Array<{ name: string; quantity: number }>;
    destination?: {
      primary: string;
      secondary: string;
    };
  } | null;
}

const DonationSuccessModal = ({ 
  isOpen, 
  onClose, 
  donation 
}: DonationSuccessModalProps) => {
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
      case 'MONETAIRE': return 'Don Monétaire';
      case 'VIVRES': return 'Don Alimentaire';
      case 'NON_VIVRES': return 'Don Matériel';
      default: return 'Don';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MONETAIRE': return 'from-green-500 to-emerald-500';
      case 'VIVRES': return 'from-orange-500 to-amber-500';
      case 'NON_VIVRES': return 'from-blue-500 to-indigo-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  const totalItems = donation.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - Plus compacte */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Contenu */}
        <div className="p-6">
          {/* Icône animée - Plus petite */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(donation.type)} rounded-full blur-lg opacity-40 animate-pulse`} />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Badge type de don */}
          <div className="mb-3 text-center">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(donation.type)} shadow-lg`}>
              <span className="text-base">{getTypeIcon(donation.type)}</span>
              {getTypeLabel(donation.type)}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
            Don créé avec succès !
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-sm text-center leading-relaxed mb-4">
            Votre générosité fait la différence ! Votre don a été enregistré.
          </p>

          {/* Détails du don - Compact */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border-2 border-emerald-200">
            {/* Titre du don */}
            <div className="flex items-center gap-2 justify-center mb-3">
              <span className="text-2xl">{getTypeIcon(donation.type)}</span>
              <p className="font-bold text-slate-800 text-base">{donation.libelle}</p>
            </div>

            {/* Montant ou articles */}
            {donation.type === 'MONETAIRE' && donation.montant && (
              <div className="flex items-center justify-center gap-2 py-2 mb-2">
                <span className="text-xl">💰</span>
                <span className="text-xl font-bold text-green-600">
                  {formatAmount(donation.montant)} Ar
                </span>
              </div>
            )}

            {donation.items && donation.items.length > 0 && (
              <div className="bg-white rounded-lg p-3 mb-2 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-800 mb-2 text-center">
                  {donation.items.length} article{donation.items.length > 1 ? 's' : ''} • {totalItems} unités
                </p>
                <div className="space-y-1">
                  {donation.items.slice(0, 2).map((item, index) => (
                    <p key={index} className="text-xs text-slate-600 text-center">
                      • {item.name} ({item.quantity})
                    </p>
                  ))}
                  {donation.items.length > 2 && (
                    <p className="text-xs text-slate-500 italic text-center">
                      +{donation.items.length - 2} autre{donation.items.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Destination */}
            {donation.destination && (
              <div className="pt-2 border-t border-emerald-200 text-center">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Pour:</span> {donation.destination.primary}
                </p>
                {donation.destination.secondary && (
                  <p className="text-xs text-slate-500">{donation.destination.secondary}</p>
                )}
              </div>
            )}
          </div>

          {/* Prochaine étape - Compact */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-xs text-blue-800">
                <p className="font-semibold mb-1">Prochaine étape</p>
                <p>Marquez votre don comme "Envoyé" une fois expédié !</p>
              </div>
            </div>
          </div>

          {/* Message de gratitude - Compact */}
          <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
            <div className="flex items-center justify-center gap-2 text-pink-700">
              <Heart className="w-4 h-4 fill-current" />
              <p className="font-semibold text-xs">Merci pour votre contribution !</p>
            </div>
          </div>

          {/* Bouton OK */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r ${getTypeColor(donation.type)} hover:shadow-xl flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-5 h-5" />
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessModal;