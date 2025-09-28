// lib/hooks/useDonationStats.ts
import { useState, useEffect } from 'react';

export interface DonationStats {
  totalDonations: number;
  totalMonetaire: number;
  enAttente: number;
  envoyes: number;
  recus: number;
  montantEnAttente: number;
  montantEnvoye: number;
  montantRecu: number;
  donationsMonetaires: number;
  donationsVivres: number;
  donationsMateriels: number;
  donateurUniques: number;
  thisMonth: number;
  montantThisMonth: number;
}

export const useDonationStats = () => {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/donations/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des statistiques');
      }
      
      const data = await response.json();
      setStats(data.stats);
      
    } catch (err) {
      console.error('Erreur chargement stats donations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats
  };
};