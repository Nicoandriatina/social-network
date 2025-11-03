import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Package, 
  Send, 
  Truck,
  Heart,
  Sparkles,
  Clock
} from 'lucide-react';

// Modal de confirmation avant d'envoyer un don
interface ConfirmStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  donation: {
    libelle: string;
    type: string;
    destination?: {
      primary: string;
      secondary: string;
    };
  };
  isLoading?: boolean;
}

export const ConfirmStatusChangeModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  donation,
  isLoading = false 
}: ConfirmStatusChangeModalProps) => {
  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MONETAIRE': return '💰';
      case 'VIVRES': return '🍎';
      case 'NON_VIVRES': return '📚';
      default: return '📦';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <Truck className="w-16 h-16 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <Send className="w-4 h-4" />
              Confirmation d'envoi
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Marquer comme envoyé ?
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Vous êtes sur le point de marquer ce don comme envoyé. Cette action informera le bénéficiaire.
          </p>

          {/* Détails du don */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start gap-3 text-left">
              <span className="text-3xl">{getTypeIcon(donation.type)}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 mb-1">{donation.libelle}</p>
                {donation.destination && (
                  <p className="text-sm text-slate-600">
                    Pour {donation.destination.primary}
                    {donation.destination.secondary && (
                      <span className="text-slate-500"> • {donation.destination.secondary}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Avertissement */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm text-amber-800">
                <p className="font-semibold mb-1">Important</p>
                <p>Assurez-vous d'avoir bien expédié le don avant de confirmer.</p>
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
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
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

// Modal de succès après création d'un don
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
  };
}

export const DonationSuccessModal = ({ 
  isOpen, 
  onClose, 
  donation 
}: DonationSuccessModalProps) => {
  if (!isOpen) return null;

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
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône animée */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${getTypeColor(donation.type)} rounded-full blur-xl opacity-50 animate-pulse`} />
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <CheckCircle2 className={`w-16 h-16 text-${donation.type === 'MONETAIRE' ? 'green' : donation.type === 'VIVRES' ? 'orange' : 'blue'}-500`} />
              </div>
            </div>
          </div>

          {/* Badge type de don */}
          <div className="mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getTypeColor(donation.type)} shadow-lg`}>
              <span className="text-lg">{getTypeIcon(donation.type)}</span>
              {getTypeLabel(donation.type)}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
            Don créé avec succès !
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Votre générosité fait la différence ! Votre don a été enregistré et est maintenant en attente d'envoi.
          </p>

          {/* Détails du don */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border-2 border-emerald-200">
            <div className="space-y-3">
              {/* Titre du don */}
              <div className="flex items-center gap-3 justify-center">
                <span className="text-3xl">{getTypeIcon(donation.type)}</span>
                <p className="font-bold text-slate-800 text-lg">{donation.libelle}</p>
              </div>

              {/* Montant ou articles */}
              {donation.type === 'MONETAIRE' && donation.montant && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <span className="text-2xl">💰</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatAmount(donation.montant)} Ar
                  </span>
                </div>
              )}

              {donation.items && donation.items.length > 0 && (
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-800 mb-2">
                    {donation.items.length} article{donation.items.length > 1 ? 's' : ''} • {totalItems} unités
                  </p>
                  <div className="space-y-1">
                    {donation.items.slice(0, 3).map((item, index) => (
                      <p key={index} className="text-xs text-slate-600">
                        • {item.name} ({item.quantity})
                      </p>
                    ))}
                    {donation.items.length > 3 && (
                      <p className="text-xs text-slate-500 italic">
                        +{donation.items.length - 3} autre{donation.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Destination */}
              {donation.destination && (
                <div className="pt-2 border-t border-emerald-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Destinataire:</span> {donation.destination.primary}
                  </p>
                  {donation.destination.secondary && (
                    <p className="text-xs text-slate-500">{donation.destination.secondary}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Prochaine étape */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm text-blue-800">
                <p className="font-semibold mb-1">Prochaine étape</p>
                <p>N'oubliez pas de marquer votre don comme "Envoyé" une fois que vous l'aurez expédié !</p>
              </div>
            </div>
          </div>

          {/* Message de gratitude */}
          <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
            <div className="flex items-center justify-center gap-2 text-pink-700">
              <Heart className="w-5 h-5 fill-current" />
              <p className="font-semibold text-sm">Merci pour votre contribution à l'éducation !</p>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-r ${getTypeColor(donation.type)} hover:shadow-xl flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-5 h-5" />
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

// Exemple d'utilisation
export default function DonationModalsDemo() {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const sampleDonation = {
    libelle: "Fournitures scolaires pour la rentrée",
    type: "NON_VIVRES",
    items: [
      { name: "Cahiers", quantity: 50 },
      { name: "Stylos", quantity: 100 },
      { name: "Crayons", quantity: 75 }
    ],
    destination: {
      primary: "École Primaire Publique Ambohipo",
      secondary: "Établissement"
    }
  };

  const sampleMonetaryDonation = {
    libelle: "Contribution financière",
    type: "MONETAIRE",
    montant: 500000,
    destination: {
      primary: "Projet: Bibliothèque Numérique",
      secondary: "Lycée Moderne d'Antsirabe"
    }
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfirm(false);
      alert("Don marqué comme envoyé !");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
            Modals de Confirmation pour Dons
          </h1>
          
          <p className="text-slate-600 mb-8">
            Découvrez les nouvelles modals élégantes pour confirmer les actions sur les dons et célébrer les créations de dons.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Confirmation d'envoi */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Modal de Confirmation</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Demande confirmation avant de marquer un don comme envoyé
              </p>
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Tester la confirmation
              </button>
            </div>

            {/* Card 2: Succès matériel */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Succès Don Matériel</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Célèbre la création d'un don avec articles
              </p>
              <button
                onClick={() => setShowSuccess(true)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Voir don matériel
              </button>
            </div>

            {/* Card 3: Succès monétaire */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Succès Don Monétaire</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Affiche le montant donné avec style
              </p>
              <button
                onClick={() => {
                  // On utilise temporairement le state showSuccess avec une donation différente
                  setShowSuccess(true);
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Voir don monétaire
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Caractéristiques
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Design moderne avec animations fluides</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Confirmation avant actions critiques</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>États de chargement intégrés</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Affichage adapté selon le type de don</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Messages contextuels et encourageants</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmStatusChangeModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        donation={{
          ...sampleDonation,
          destination: sampleDonation.destination || { primary: '', secondary: '' }
        }}
        isLoading={isLoading}
      />

      <DonationSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        donation={sampleDonation}
      />
    </div>
  );
}