// hooks/useProjectDetails.ts
import { useState, useEffect } from 'react';

export interface ProjectDetails {
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
  auteur: {
    id: string;
    fullName: string;
    avatar?: string;
    email: string;
  };
  etablissement: {
    id: string;
    nom: string;
    type: string;
    niveau: string;
    adresse?: string;
  };
  dons: Array<{
    id: string;
    libelle: string;
    type: string;
    quantite?: number;
    statut: string;
    dateEnvoi?: string;
    dateReception?: string;
    createdAt: string;
    donateur: {
      id: string;
      fullName: string;
      avatar?: string;
    };
  }>;
  stats: {
    donCount: number;
    totalRaised: number;
    uniqueDonors: number;
  };
}

export const useProjectDetails = (projectId: string) => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    if (!projectId) {
      setError("ID du projet requis");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet non trouvé');
        }
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour voir ce projet');
        }
        throw new Error('Erreur lors de la récupération du projet');
      }

      const data = await response.json();
      setProject(data.project);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des détails du projet:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updateData: {
    title?: string;
    description?: string;
    category?: 'CONSTRUCTION' | 'REHABILITATION' | 'AUTRES';
    startDate?: string;
    endDate?: string;
    photos?: string[];
  }) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la modification');
      }

      // Rafraîchir les détails du projet après modification
      await fetchProjectDetails();
      
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const refreshProject = () => {
    fetchProjectDetails();
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    updateProject,
    refreshProject
  };
};