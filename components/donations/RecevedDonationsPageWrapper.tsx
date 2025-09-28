// components/donations/ReceivedDonationsPageWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DonationsReceivedPage from "./DonationsReceivedDetailPage";

export default function ReceivedDonationsPageWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const loadUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Erreur lors du chargement du profil');
      }
      
      const userData = await response.json();
      
      // Vérifier les permissions
      if (userData.user.type !== "ETABLISSEMENT" && userData.user.type !== "ENSEIGNANT") {
        router.push('/dashboard');
        return;
      }
      
      setUser(userData.user);
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-red-700 mb-2">Erreur</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirection en cours
  }

  return <DonationsReceivedPage />;
}