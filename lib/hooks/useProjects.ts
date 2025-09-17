// hooks/useProjects.ts
import { useState, useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  school: string;
  category: string;
  description: string;
  target?: number;
  raised?: number;
  donors?: number;
  date: string;
  region?: string;
  level?: string;
  reference: string;
  photos: string[];
  author: {
    fullName: string;
    avatar?: string;
  };
  establishment: {
    nom: string;
    type: string;
    niveau: string;
    adresse?: string;
  };
  _count?: {
    dons: number;
  };
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des projets');
      }

      const data = await response.json();
      
      // Transformer les données de l'API vers le format attendu par le composant
      const transformedProjects = data.projects.map((project: any) => ({
        id: project.id,
        title: project.titre,
        school: project.etablissement.nom,
        category: getCategoryLabel(project.categorie),
        description: project.description,
        target: 0, // À calculer selon vos besoins
        raised: 0, // À calculer selon les dons reçus
        donors: project._count?.dons || 0,
        date: new Date(project.datePublication || project.createdAt).toISOString().split('T')[0],
        region: getRegionFromAddress(project.etablissement.adresse),
        level: getNiveauLabel(project.etablissement.niveau),
        reference: project.reference,
        photos: project.photos,
        author: project.auteur,
        establishment: project.etablissement,
        _count: project._count
      }));

      setProjects(transformedProjects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors de la récupération des projets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir les projets
  const refreshProjects = () => {
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refreshProjects
  };
};

// Fonctions utilitaires pour transformer les données
const getCategoryLabel = (category: string) => {
  const categoryMap: Record<string, string> = {
    'CONSTRUCTION': 'Construction',
    'REHABILITATION': 'Réhabilitation',
    'AUTRES': 'Autres'
  };
  return categoryMap[category] || category;
};

const getNiveauLabel = (niveau: string) => {
  const niveauMap: Record<string, string> = {
    'EPP': 'epp',
    'CEG': 'ceg',
    'LYCEE': 'lycee',
    'COLLEGE': 'college',
    'UNIVERSITE': 'universite',
    'ORGANISME': 'organisme'
  };
  return niveauMap[niveau] || niveau.toLowerCase();
};

const getRegionFromAddress = (adresse?: string) => {
  if (!adresse) return '';
  
  // Logique simple pour extraire la région de l'adresse
  // Vous pouvez l'améliorer selon vos besoins
  const regions = [
    'Antananarivo', 'Vakinankaratra', 'Haute Matsiatra', 
    'Boeny', 'Atsinanana', 'Analamanga'
  ];
  
  for (const region of regions) {
    if (adresse.toLowerCase().includes(region.toLowerCase())) {
      return region;
    }
  }
  
  return '';
};