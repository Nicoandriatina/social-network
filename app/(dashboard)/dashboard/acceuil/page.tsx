// export default MadaSocialFeed;

"use client";

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send, Bookmark, MoreHorizontal, MapPin, Calendar, Users, TrendingUp, Plus, Trash2, Edit2, X, Bell, Search, Home, Compass, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MadaSocialFeed = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [commentInputs, setCommentInputs] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [projectComments, setProjectComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalDonors: 0,
    totalReactions: 0
  });

  // Charger l'utilisateur connecté
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Erreur lors du chargement des projets');
        
        const data = await response.json();
        
        const transformedProjects = data.projects.map(project => ({
          id: project.id,
          reference: project.reference,
          title: project.titre,
          description: project.description,
          category: project.categorie,
          establishment: {
            name: project.etablissement.nom,
            type: project.etablissement.type === 'PUBLIC' ? 'Établissement Public' : 'Établissement Privé',
            level: project.etablissement.niveau,
            avatar: project.etablissement.nom.substring(0, 2).toUpperCase(),
            location: project.etablissement.adresse || 'Madagascar'
          },
          images: project.photos || [],
          startDate: project.dateDebut,
          endDate: project.dateFin,
          publishedDate: project.datePublication || project.createdAt,
          stats: {
            likes: project.stats?.likes || project._count?.likes || 0,
            comments: project.stats?.comments || project._count?.comments || 0,
            shares: project.stats?.shares || project._count?.shares || 0,
            donations: project.stats?.donations || project._count?.dons || 0
          },
          liked: project.liked || false,
          saved: false,
          auteur: project.auteur
        }));

        setProjects(transformedProjects);
        
        const totalReactions = transformedProjects.reduce((sum, p) => 
          sum + p.stats.likes + p.stats.comments + p.stats.shares, 0
        );

        setStats({
          activeProjects: transformedProjects.length,
          totalDonors: 156,
          totalReactions
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Charger les commentaires d'un projet
  const loadComments = async (projectId) => {
    setLoadingComments(prev => ({ ...prev, [projectId]: true }));
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setProjectComments(prev => ({ ...prev, [projectId]: data.comments }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Liker/Unliker un projet
  const handleLike = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { 
                ...p, 
                liked: data.liked, 
                stats: { ...p.stats, likes: data.likesCount }
              }
            : p
        ));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  // Liker un commentaire
  const handleLikeComment = async (projectId, commentId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setProjectComments(prev => ({
          ...prev,
          [projectId]: prev[projectId]?.map(c => 
            c.id === commentId 
              ? { ...c, liked: data.liked, likesCount: data.likesCount }
              : c
          )
        }));
      }
    } catch (error) {
      console.error('Erreur lors du like du commentaire:', error);
    }
  };

  // Partager un projet
  const handleShare = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/share`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { ...p, stats: { ...p.stats, shares: data.sharesCount }}
            : p
        ));
        
        alert('Projet partagé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleSave = (projectId) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, saved: !p.saved } : p
    ));
  };

  const handleCommentChange = (projectId, value) => {
    setCommentInputs({ ...commentInputs, [projectId]: value });
  };

  // Poster un commentaire
  const handleCommentSubmit = async (projectId) => {
    const content = commentInputs[projectId]?.trim();
    if (!content) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        const data = await response.json();
        
        setProjectComments(prev => ({
          ...prev,
          [projectId]: [data.comment, ...(prev[projectId] || [])]
        }));
        
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { ...p, stats: { ...p.stats, comments: p.stats.comments + 1 }}
            : p
        ));
        
        setCommentInputs({ ...commentInputs, [projectId]: '' });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  // Modifier un commentaire
  const handleEditComment = async (projectId, commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editCommentText })
      });

      if (response.ok) {
        const data = await response.json();
        
        setProjectComments(prev => ({
          ...prev,
          [projectId]: prev[projectId]?.map(c => 
            c.id === commentId ? data.comment : c
          )
        }));
        
        setEditingComment(null);
        setEditCommentText('');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (projectId, commentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjectComments(prev => ({
          ...prev,
          [projectId]: prev[projectId]?.filter(c => c.id !== commentId)
        }));
        
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { ...p, stats: { ...p.stats, comments: Math.max(0, p.stats.comments - 1) }}
            : p
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Toggle affichage des commentaires
  const toggleComments = (projectId) => {
    const isShowing = !showComments[projectId];
    setShowComments(prev => ({ ...prev, [projectId]: isShowing }));
    
    if (isShowing) {
      loadComments(projectId);
    }
  };

  const handlePublishProject = () => {
    router.push('/project/new');
  };

  const CategoryBadge = ({ category }) => {
    const colors = {
      'CONSTRUCTION': 'bg-blue-100 text-blue-700',
      'REHABILITATION': 'bg-green-100 text-green-700',
      'AUTRES': 'bg-purple-100 text-purple-700'
    };
    
    const labels = {
      'CONSTRUCTION': 'Construction',
      'REHABILITATION': 'Réhabilitation',
      'AUTRES': 'Autres'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
        {labels[category] || category}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Récemment";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    if (diff < 7) return `Il y a ${diff} jours`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du fil d'actualité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bouton Publier Flottant (Mobile uniquement) */}
      {currentUser?.typeProfil === 'ETABLISSEMENT' && (
        <button
          onClick={handlePublishProject}
          className="fixed bottom-8 right-8 z-50 lg:hidden w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ====== COLONNE GAUCHE - Navigation et Profil (3/12) ====== */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              
              {/* Carte Profil Utilisateur */}
              {currentUser && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  <div className="px-4 pb-4 -mt-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {currentUser.nom ? currentUser.nom.substring(0, 2).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900 truncate">{currentUser.nom || 'Utilisateur'}</h3>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">0</p>
                        <p className="text-xs text-gray-500">Amis</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">0</p>
                        <p className="text-xs text-gray-500">Projets</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">0</p>
                        <p className="text-xs text-gray-500">Dons</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Catégories */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
                  Catégories de Projets
                </h3>
                <div className="space-y-1">
                  {[
                    { key: 'all', label: 'Tous les projets', count: projects.length },
                    { key: 'construction', label: 'Construction', count: projects.filter(p => p.category === 'CONSTRUCTION').length },
                    { key: 'rehabilitation', label: 'Réhabilitation', count: projects.filter(p => p.category === 'REHABILITATION').length },
                    { key: 'autres', label: 'Autres', count: projects.filter(p => p.category === 'AUTRES').length }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition text-sm ${
                        activeTab === cat.key
                          ? 'bg-indigo-50 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(cat.key)}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        activeTab === cat.key ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-600'
                      }`}>{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton Publier (Desktop) */}
              {currentUser?.typeProfil === 'ETABLISSEMENT' && (
                <button
                  onClick={handlePublishProject}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Publier un Projet
                </button>
              )}

              {/* Raccourcis Rapides */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Accès Rapide</h3>
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Mes Amis</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Projets Aimés</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                    <Bookmark className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Enregistrés</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition flex items-center">
                    <Compass className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Explorer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ====== COLONNE CENTRALE - Fil d'actualité (6/12) ====== */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Zone de création de post (Établissements uniquement) */}
            {currentUser?.typeProfil === 'ETABLISSEMENT' && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {currentUser.nom ? currentUser.nom.substring(0, 2).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <button
                    onClick={handlePublishProject}
                    className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition text-sm"
                  >
                    Publier un nouveau projet...
                  </button>
                </div>
              </div>
            )}

            {/* Onglets mobiles */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-2 flex space-x-2 overflow-x-auto">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'construction', label: 'Construction' },
                { key: 'rehabilitation', label: 'Réhabilitation' },
                { key: 'autres', label: 'Autres' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition text-sm ${
                    activeTab === cat.key
                      ? 'bg-indigo-600 text-white font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setActiveTab(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Feed des projets */}
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet disponible</h3>
                <p className="text-gray-500 mb-4 text-sm">Il n'y a pas encore de projets dans cette catégorie.</p>
                {currentUser?.typeProfil === 'ETABLISSEMENT' && (
                  <button
                    onClick={handlePublishProject}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Publier le premier projet
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <article key={project.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* En-tête du post */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{project.establishment.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.establishment.name}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{project.establishment.type} • {project.establishment.level}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span>{project.establishment.location}</span>
                          <span>•</span>
                          <span>{formatDate(project.publishedDate)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Contenu */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <CategoryBadge category={project.category} />
                      <span className="text-xs text-gray-500">Ref: {project.reference}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h2>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                    
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        {project.startDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Fin: {new Date(project.endDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  {project.images && project.images.length > 0 && (
                    <div className="relative">
                      <img 
                        src={project.images[0]} 
                        alt={project.title}
                        className="w-full h-96 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800';
                        }}
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(project.id)}
                        className="flex items-center space-x-1 hover:text-red-600 transition"
                      >
                        <Heart className={`w-4 h-4 ${project.liked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="font-medium">{project.stats.likes}</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(project.id)}
                        className="hover:text-indigo-600 transition"
                      >
                        {project.stats.comments} commentaires
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{project.stats.shares} partages</span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">{project.stats.donations} dons</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-2 flex items-center justify-around border-t border-gray-100">
                    <button 
                      onClick={() => handleLike(project.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                        project.liked 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${project.liked ? 'fill-current' : ''}`} />
                      <span className="font-medium text-sm">J'aime</span>
                    </button>
                    <button 
                      onClick={() => toggleComments(project.id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">Commenter</span>
                    </button>
                    <button 
                      onClick={() => handleShare(project.id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium text-sm">Partager</span>
                    </button>
                    <button 
                      onClick={() => handleSave(project.id)}
                      className={`p-2 rounded-lg transition ${
                        project.saved 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${project.saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Section Commentaires */}
                  {showComments[project.id] && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      <div className="px-4 py-3 max-h-96 overflow-y-auto">
                        {loadingComments[project.id] ? (
                          <div className="text-center py-4">
                            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          </div>
                        ) : projectComments[project.id]?.length > 0 ? (
                          <div className="space-y-3">
                            {projectComments[project.id].map((comment) => (
                              <div key={comment.id} className="flex space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">
                                    {comment.user.fullName.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  {editingComment === comment.id ? (
                                    <div className="bg-white rounded-lg p-3">
                                      <input
                                        type="text"
                                        value={editCommentText}
                                        onChange={(e) => setEditCommentText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      />
                                      <div className="flex items-center space-x-2 mt-2">
                                        <button
                                          onClick={() => handleEditComment(project.id, comment.id)}
                                          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                                        >
                                          Sauvegarder
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingComment(null);
                                            setEditCommentText('');
                                          }}
                                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                                        >
                                          Annuler
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-white rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-semibold text-sm text-gray-900">
                                            {comment.user.fullName}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {formatDate(comment.createdAt)}
                                          </span>
                                        </div>
                                        {currentUser?.id === comment.user.id && (
                                          <div className="flex items-center space-x-1">
                                            <button
                                              onClick={() => {
                                                setEditingComment(comment.id);
                                                setEditCommentText(comment.content);
                                              }}
                                              className="p-1 hover:bg-gray-100 rounded text-gray-600"
                                            >
                                              <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteComment(project.id, comment.id)}
                                              className="p-1 hover:bg-gray-100 rounded text-red-600"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.content}</p>
                                      <div className="flex items-center space-x-3 mt-2">
                                        <button
                                          onClick={() => handleLikeComment(project.id, comment.id)}
                                          className={`flex items-center space-x-1 text-xs ${
                                            comment.liked ? 'text-red-600' : 'text-gray-500'
                                          } hover:text-red-600 transition`}
                                        >
                                          <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                                          <span>{comment.likesCount || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 text-sm py-4">
                            Aucun commentaire pour le moment. Soyez le premier à commenter !
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Zone de commentaire */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {currentUser?.nom ? currentUser.nom.substring(0, 2).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Ajouter un commentaire..."
                          value={commentInputs[project.id] || ''}
                          onChange={(e) => handleCommentChange(project.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(project.id)}
                          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(project.id)}
                          disabled={!commentInputs[project.id]?.trim()}
                          className={`p-2 rounded-full transition ${
                            commentInputs[project.id]?.trim()
                              ? 'text-indigo-600 hover:bg-indigo-50'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* ====== COLONNE DROITE - Suggestions et Activités (3/12) ====== */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-4">
              
              {/* Stats en temps réel */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
                <h3 className="font-semibold mb-3 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Statistiques en Direct
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Projets actifs</span>
                    <span className="text-2xl font-bold">{stats.activeProjects}</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Donateurs</span>
                    <span className="text-2xl font-bold">{stats.totalDonors}</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Réactions</span>
                    <span className="text-2xl font-bold">{stats.totalReactions}</span>
                  </div>
                </div>
              </div>

              {/* Projets populaires */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    Projets Populaires
                  </span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700">Voir tout</button>
                </h3>
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {project.images?.[0] ? (
                          <img 
                            src={project.images[0]} 
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{project.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-1">{project.establishment.name}</p>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-red-500 flex items-center">
                            <Heart className="w-3 h-3 mr-0.5 fill-current" />
                            {project.stats.likes}
                          </span>
                          <span className="text-xs text-indigo-500 flex items-center">
                            <MessageCircle className="w-3 h-3 mr-0.5" />
                            {project.stats.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Établissements suggérés */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-between">
                  <span className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2 text-indigo-600" />
                    Établissements Suggérés
                  </span>
                </h3>
                <div className="space-y-3">
                  {[...new Set(projects.map(p => p.establishment.name))].slice(0, 4).map((name, idx) => {
                    const project = projects.find(p => p.establishment.name === name);
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                            <p className="text-xs text-gray-500">{project?.establishment.level}</p>
                          </div>
                        </div>
                        <button className="ml-2 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition whitespace-nowrap">
                          Suivre
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Appel à l'action donateurs */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Faites la différence</h3>
                    <p className="text-xs text-gray-600">
                      Soutenez l'éducation à Madagascar en contribuant aux projets des établissements
                    </p>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm">
                  Explorer les projets
                </button>
              </div>

              {/* Activités récentes */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-purple-600" />
                  Activités Récentes
                </h3>
                <div className="space-y-3">
                  {projects.slice(0, 4).map((project, idx) => (
                    <div key={project.id} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          <span className="font-medium text-gray-900">{project.establishment.name}</span>
                          {' '}a publié{' '}
                          <span className="font-medium text-gray-900">{project.title.substring(0, 30)}...</span>
                        </p>
                        <span className="text-xs text-gray-400">{formatDate(project.publishedDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact et mission */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">Notre Impact</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Ensemble, construisons l'avenir de l'éducation à Madagascar
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-lg font-bold text-purple-600">{projects.length}</p>
                      <p className="text-xs text-gray-600">Projets</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <p className="text-lg font-bold text-purple-600">
                        {projects.reduce((sum, p) => sum + p.stats.donations, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Dons reçus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="text-xs text-gray-500 space-y-2 px-2">
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="hover:underline">À propos</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Aide</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Confidentialité</a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="hover:underline">Conditions</a>
                  <span>•</span>
                  <a href="#" className="hover:underline">Contact</a>
                </div>
                <p className="text-gray-400">© 2025 Mada Social Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MadaSocialFeed;