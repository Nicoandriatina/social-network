// hooks/useUserProjects.ts
import { useState, useEffect } from 'react';

export interface UserProject {
  id: string;
  reference: string;
  titre: string;
  description: string;
  categorie: 'CONSTRUCTION' | 'REHABILITATION' | 'AUTRES';
  photos: string[];
  datePublication: string;
  dateDebut?: string;
  dateFin?: string;
  createdAt: string;
  updatedAt: string;
  donCount: number;
  totalRaised: number;
}

export interface ProjectStats {
  totalProjects: number;
  activeDonors: number;
  totalRaised: number;
  newDonationsThisMonth: number;
}

export const useUserProjects = () => {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeDonors: 0,
    totalRaised: 0,
    newDonationsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour voir vos projets');
        }
        throw new Error('Erreur lors de la récupération des projets');
      }

      const data = await response.json();
      setProjects(data.projects || []);
      setStats(data.stats || {
        totalProjects: 0,
        activeDonors: 0,
        totalRaised: 0,
        newDonationsThisMonth: 0
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des projets utilisateur:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    fetchUserProjects();
  };

  useEffect(() => {
    fetchUserProjects();
  }, []);

  return {
    projects,
    stats,
    loading,
    error,
    refreshProjects
  };
};