"use client";

import { useState, useEffect } from 'react';

import styles from './projects.module.css';
import Header from '@/components/ProjectComponent/Header';
import HeroSection from '@/components/ProjectComponent/HeroSection';
import FilterSection from '@/components/ProjectComponent/FilterSection';
import ProjectsGrid from '@/components/ProjectComponent/ProjectGrid';
import { useProjects } from '@/lib/hooks/useProjects';

const ProjectPage = () => {
  const [currentView, setCurrentView] = useState('grid');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    category: '', 
    region: '',
    level: '',
    search: ''
  });

  // Utiliser le hook pour récupérer les projets
  const { projects, loading, error, refreshProjects } = useProjects();

  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    }
  }, [filters, projects]);

  const filterProjects = () => {
    if (!projects || projects.length === 0) {
      setFilteredProjects([]);
      return;
    }

    const filtered = projects.filter(project => {
      return (
        (filters.category === '' || project.category === filters.category) &&
        (filters.region === '' || project.region === filters.region) &&
        (filters.level === '' || project.level === filters.level) &&
        (filters.search === '' || 
         project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
         project.school.toLowerCase().includes(filters.search.toLowerCase()) ||
         project.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    });
    setFilteredProjects(filtered);
  };

  const donate = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // Redirection vers la page de don avec l'ID du projet
      window.location.href = `/donate/${projectId}`;
      // Ou utiliser Next.js router
      // router.push(`/donate/${projectId}`);
    }
  };

  const viewDetails = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // Redirection vers la page de détails du projet
      window.location.href = `/projects/${projectId}`;
      // Ou utiliser Next.js router
      // router.push(`/projects/${projectId}`);
    }
  };

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <>
        <Header />
        <HeroSection />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des projets...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <HeroSection />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refreshProjects}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Gestion du cas où aucun projet n'est trouvé
  if (projects.length === 0) {
    return (
      <>
        <Header />
        <HeroSection />
        <FilterSection 
          filters={filters} 
          handleFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))} 
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun projet disponible</h3>
              <p className="text-gray-500 mb-4">
                Il n'y a actuellement aucun projet publié. Soyez le premier à partager votre projet !
              </p>
              <a
                href="/projects/create"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Créer un projet
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <HeroSection />
      <FilterSection 
        filters={filters} 
        handleFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))} 
      />
      <ProjectsGrid 
        projects={filteredProjects} 
        currentView={currentView} 
        donate={donate} 
        viewDetails={viewDetails} 
      />
      
      {/* Bouton pour rafraîchir les projets (optionnel) */}
      <div className="text-center py-8">
        <button
          onClick={refreshProjects}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Actualiser les projets
        </button>
      </div>
    </>
  );
};

export default ProjectPage;