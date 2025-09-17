// "use client";

// import { useState, useEffect } from 'react';

// import styles from './projects.module.css';
// import Header from '@/components/ProjectComponent/Header';
// import HeroSection from '@/components/ProjectComponent/HeroSection';
// import FilterSection from '@/components/ProjectComponent/FilterSection';
// import ProjectsGrid from '@/components/ProjectComponent/ProjectGrid';

// const ProjectPage = () => {
//   const [currentView, setCurrentView] = useState('grid');
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [filters, setFilters] = useState({
//     category: '', 
//     region: '',
//     level: '',
//     search: ''
//   });

//   const projects = [
//   {
//     id: 1,
//     title: "Rénovation de la bibliothèque",
//     school: "Lycée Antananarivo",
//     category: "Réhabilitation",
//     description: "Projet de rénovation complète de notre bibliothèque pour offrir un meilleur environnement d'apprentissage à nos 1,200 élèves. Modernisation de l'espace, ajout d'ordinateurs et création d'espaces de travail collaboratif.",
//     target: 5000000,
//     raised: 2500000,
//     donors: 8,
//     date: "2024-03-15",
//     region: "Antananarivo",
//     level: "lycee"
//   },
//   {
//     id: 2,
//     title: "Construction salle informatique",
//     school: "CEG Antsirabe",
//     category: "Construction",
//     description: "Construction d'une nouvelle salle informatique équipée de 30 ordinateurs pour initier nos élèves aux nouvelles technologies et à la programmation.",
//     target: 8000000,
//     raised: 3200000,
//     donors: 5,
//     date: "2024-03-08",
//     region: "Vakinankaratra",
//     level: "ceg"
//   },
//   {
//     id: 3,
//     title: "Programme de bourses d'excellence",
//     school: "Université d'Antananarivo",
//     category: "Formation",
//     description: "Création d'un programme de bourses pour accompagner les étudiants méritants issus de familles défavorisées dans leur parcours universitaire.",
//     target: 10000000,
//     raised: 6800000,
//     donors: 15,
//     date: "2024-03-01",
//     region: "Antananarivo",
//     level: "universite"
//   },
//   {
//     id: 4,
//     title: "Équipement d'un laboratoire de sciences",
//     school: "Lycée Fianarantsoa",
//     category: "Équipement",
//     description: "Acquisition d'équipements modernes pour notre laboratoire de sciences afin d'améliorer la qualité de l'enseignement des matières scientifiques.",
//     target: 4500000,
//     raised: 1200000,
//     donors: 3,
//     date: "2024-02-28",
//     region: "Haute Matsiatra",
//     level: "lycee"
//   },
//   {
//     id: 5,
//     title: "Réfection de la cantine scolaire",
//     school: "EPP Mahajanga",
//     category: "Réhabilitation",
//     description: "Rénovation complète de notre cantine scolaire pour offrir des repas dans de meilleures conditions d'hygiène à nos 800 élèves.",
//     target: 3000000,
//     raised: 1800000,
//     donors: 6,
//     date: "2024-02-25",
//     region: "Boeny",
//     level: "epp"
//   },
//   {
//     id: 6,
//     title: "Création d'une ferme pédagogique",
//     school: "Collège Toamasina",
//     category: "Autres",
//     description: "Mise en place d'une ferme pédagogique pour enseigner l'agriculture durable et sensibiliser nos élèves à l'environnement.",
//     target: 6000000,
//     raised: 2100000,
//     donors: 4,
//     date: "2024-02-20",
//     region: "Atsinanana",
//     level: "college"
//   }
// ];


//   useEffect(() => {
//     filterProjects();
//   }, [filters]);

//   const filterProjects = () => {
//     const filtered = projects.filter(project => {
//       return (
//         (filters.category === '' || project.category === filters.category) &&
//         (filters.region === '' || project.region === filters.region) &&
//         (filters.level === '' || project.level === filters.level) &&
//         (filters.search === '' || 
//          project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//          project.school.toLowerCase().includes(filters.search.toLowerCase()) ||
//          project.description.toLowerCase().includes(filters.search.toLowerCase()))
//       );
//     });
//     setFilteredProjects(filtered);
//   };

//   const donate = (projectId) => {
//     const project = projects.find(p => p.id === projectId);
//     if (project) {
//       alert(`Redirection vers la page de don pour "${project.title}"`);
//     }
//   };

//   const viewDetails = (projectId) => {
//     const project = projects.find(p => p.id === projectId);
//     if (project) {
//       alert(`Affichage des détails du projet "${project.title}"`);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <HeroSection />
//       <FilterSection filters={filters} handleFilterChange={(type, value) => setFilters(prev => ({ ...prev, [type]: value }))} />
//       <ProjectsGrid projects={filteredProjects} currentView={currentView} donate={donate} viewDetails={viewDetails} />
//     </>
//   );
// };

// export default ProjectPage;
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