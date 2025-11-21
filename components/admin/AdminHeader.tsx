"use client";

import { useState } from "react";
import { Shield, Bell, Settings, LogOut, X, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  userId: string;
}

// Modal de confirmation de déconnexion Admin
const AdminLogoutModal = ({ isOpen, onClose, onConfirm, isLoading, userId }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userId: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
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
          {/* Icône Admin Shield avec animation */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <ShieldAlert className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Badge Super Admin */}
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border-2 border-indigo-200">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-indigo-900">SUPER ADMIN</span>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Confirmer la déconnexion
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            Voulez-vous vraiment quitter le <strong>panneau d'administration</strong> ?
          </p>
          <p className="text-sm text-gray-500 mb-1">
            ID Session: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{userId.substring(0, 12)}...</code>
          </p>
          <p className="text-xs text-amber-600 mb-6 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Vous devrez vous reconnecter pour accéder au panel admin
          </p>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de notification (succès/erreur)
const AdminNotificationModal = ({ isOpen, onClose, type, title, message }: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className={`relative p-3 rounded-full ${
              type === "error" ? "bg-red-100" : "bg-green-100"
            }`}>
              {type === "error" ? (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              ) : (
                <Shield className="w-8 h-8 text-green-500" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default function AdminHeader({ userId }: AdminHeaderProps) {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: ""
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        setIsLogoutModalOpen(false);
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Déconnexion réussie",
          message: "Vous allez être redirigé vers la page de connexion..."
        });
        
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      setIsLogoutModalOpen(false);
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur de déconnexion",
        message: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Administration</h1>
                <p className="text-xs text-indigo-100">Mada Social Network</p>
              </div>
            </div>

            {/* Navigation et actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Paramètres */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Profil admin */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                <div className="text-right">
                  <p className="text-sm font-medium">Super Admin</p>
                  <p className="text-xs text-indigo-100">
                    {userId.substring(0, 8)}...
                  </p>
                </div>
                <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold">
                  SA
                </div>
              </div>

              {/* Déconnexion */}
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de déconnexion */}
      <AdminLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        userId={userId}
      />

      {/* Modal de notification */}
      <AdminNotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => {
          setNotificationModal({ ...notificationModal, isOpen: false });
          if (notificationModal.type === "success") {
            router.push("/login");
          }
        }}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
      />
    </>
  );
}