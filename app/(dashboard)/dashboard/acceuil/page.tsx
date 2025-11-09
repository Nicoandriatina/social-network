"use client";

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Send, Bookmark, MoreHorizontal, MapPin, Calendar, Users, TrendingUp, Plus, Trash2, Edit2, AlertTriangle, X, Loader2, CheckCircle2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AvatarDisplay, AvatarBadge } from '@/components/AvatarDisplay';

// Composant Tooltip
interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

// Modal de confirmation de suppression
interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  commentAuthor: string;
  commentContent: string;
}

const DeleteCommentModal = ({ isOpen, onClose, onConfirm, isLoading, commentAuthor, commentContent }: DeleteCommentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <Trash2 className="w-12 h-12 text-red-500" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Supprimer le commentaire
          </h2>

          <p className="text-gray-600 mb-4">
            Êtes-vous sûr de vouloir supprimer ce commentaire ?
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
            <p className="text-xs text-gray-500 mb-1">Commentaire de {commentAuthor}</p>
            <p className="text-sm text-gray-700 line-clamp-3">{commentContent}</p>
          </div>

          <p className="text-sm text-red-600 mb-6">
            Cette action est irréversible.
          </p>

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
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de confirmation de sauvegarde
interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle: string;
  projectImage?: string;
  isSaving: boolean;
}

const SaveProjectModal = ({ isOpen, onClose, onConfirm, projectTitle, projectImage, isSaving }: SaveProjectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <Bookmark className="w-12 h-12 text-indigo-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Sauvegarder le projet
          </h2>

          <p className="text-gray-600 mb-4">
            Voulez-vous ajouter ce projet à vos favoris ?
          </p>

          {projectImage && (
            <div className="mb-4">
              <img 
                src={projectImage} 
                alt={projectTitle}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-indigo-50 rounded-lg p-3 mb-6 text-left border border-indigo-200">
            <p className="text-sm font-semibold text-indigo-900 line-clamp-2">{projectTitle}</p>
            <p className="text-xs text-indigo-600 mt-1">
              <Bookmark className="w-3 h-3 inline mr-1" />
              Vous pourrez retrouver ce projet dans vos favoris
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de confirmation de partage
interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle: string;
  projectImage?: string;
  establishmentName: string;
  isSharing: boolean;
}

const ShareProjectModal = ({ isOpen, onClose, onConfirm, projectTitle, projectImage, establishmentName, isSharing }: ShareProjectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          disabled={isSharing}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <Share2 className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Partager le projet
          </h2>

          <p className="text-gray-600 mb-4">
            Voulez-vous partager ce projet avec votre réseau ?
          </p>

          {projectImage && (
            <div className="mb-4">
              <img 
                src={projectImage} 
                alt={projectTitle}
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 line-clamp-2">{projectTitle}</p>
            <p className="text-xs text-blue-600 mt-1">Par {establishmentName}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 mb-6 border border-blue-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
              <Users className="w-4 h-4" />
              <span>Ce projet sera partagé avec tous vos amis</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSharing}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isSharing}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Partage...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Partager
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de notification
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}

const NotificationModal = ({ isOpen, onClose, type, title, message }: NotificationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
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
                <CheckCircle2 className="w-8 h-8 text-green-500" />
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

const MadaSocialFeed = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [commentInputs, setCommentInputs] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({
    friends: 0,
    projects: 0,
    donations: 0
  });
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
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // États pour les modals
  const [deleteCommentModal, setDeleteCommentModal] = useState({
    isOpen: false,
    projectId: null,
    commentId: null,
    commentAuthor: '',
    commentContent: '',
    isDeleting: false
  });

  const [saveProjectModal, setSaveProjectModal] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: '',
    projectImage: '',
    isSaving: false
  });

  const [shareProjectModal, setShareProjectModal] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: '',
    projectImage: '',
    establishmentName: '',
    isSharing: false
  });

  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: ""
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Utilisateur connecté:', data.user);
          setCurrentUser(data.user);
          
          const statsResponse = await fetch('/api/user/stats');
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setUserStats(statsData.stats);
          }
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Erreur');
        
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
            avatar: project.etablissement.avatar,
            location: project.etablissement.adresse || 'Madagascar',
            id: project.etablissement.id
          },
          images: project.photos || [],
          startDate: project.dateDebut,
          endDate: project.dateFin,
          publishedDate: project.datePublication || project.createdAt,
          stats: project.stats,
          liked: project.liked,
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
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const loadComments = async (projectId) => {
    setLoadingComments(prev => ({ ...prev, [projectId]: true }));
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setProjectComments(prev => ({ ...prev, [projectId]: data.comments }));
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleLike = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(projects.map(p => 
          p.id === projectId 
            ? { ...p, liked: data.liked, stats: { ...p.stats, likes: data.likesCount }}
            : p
        ));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

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
      console.error('Erreur:', error);
    }
  };

  const handleShare = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setShareProjectModal({
      isOpen: true,
      projectId,
      projectTitle: project.title,
      projectImage: project.images?.[0] || '',
      establishmentName: project.establishment.name,
      isSharing: false
    });
  };

  const handleConfirmShare = async () => {
    const { projectId } = shareProjectModal;
    
    setShareProjectModal(prev => ({ ...prev, isSharing: true }));

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
        
        setShareProjectModal({ isOpen: false, projectId: null, projectTitle: '', projectImage: '', establishmentName: '', isSharing: false });
        
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Projet partagé !",
          message: "Le projet a été partagé avec succès avec votre réseau."
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setShareProjectModal(prev => ({ ...prev, isSharing: false }));
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur",
        message: "Impossible de partager le projet."
      });
    }
  };

  const handleSave = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setSaveProjectModal({
      isOpen: true,
      projectId,
      projectTitle: project.title,
      projectImage: project.images?.[0] || '',
      isSaving: false
    });
  };

  const handleConfirmSave = () => {
    const { projectId } = saveProjectModal;
    
    setSaveProjectModal(prev => ({ ...prev, isSaving: true }));
    
    setTimeout(() => {
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, saved: !p.saved } : p
      ));
      
      setSaveProjectModal({ isOpen: false, projectId: null, projectTitle: '', projectImage: '', isSaving: false });
      
      setNotificationModal({
        isOpen: true,
        type: "success",
        title: "Projet sauvegardé !",
        message: "Le projet a été ajouté à vos favoris."
      });
    }, 500);
  };

  const handleCommentChange = (projectId, value) => {
    setCommentInputs({ ...commentInputs, [projectId]: value });
  };

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
      console.error('Erreur:', error);
    }
  };

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
      console.error('Erreur:', error);
    }
  };

  const handleDeleteComment = (projectId, commentId) => {
    const comment = projectComments[projectId]?.find(c => c.id === commentId);
    if (!comment) return;

    setDeleteCommentModal({
      isOpen: true,
      projectId,
      commentId,
      commentAuthor: comment.user.fullName,
      commentContent: comment.content,
      isDeleting: false
    });
  };

  const handleConfirmDelete = async () => {
    const { projectId, commentId } = deleteCommentModal;
    
    setDeleteCommentModal(prev => ({ ...prev, isDeleting: true }));

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
        
        setDeleteCommentModal({ isOpen: false, projectId: null, commentId: null, commentAuthor: '', commentContent: '', isDeleting: false });
        
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Commentaire supprimé",
          message: "Le commentaire a été supprimé avec succès."
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setDeleteCommentModal(prev => ({ ...prev, isDeleting: false }));
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer le commentaire."
      });
    }
  };

  const toggleComments = (projectId) => {
    const isShowing = !showComments[projectId];
    setShowComments(prev => ({ ...prev, [projectId]: isShowing }));
    
    if (isShowing) {
      loadComments(projectId);
    }
  };

  const handlePublishProject = () => {
    router.push('/projects/new');
  };

  const handlePreviousImage = (projectId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: Math.max(0, (prev[projectId] || 0) - 1)
    }));
  };

  const handleNextImage = (projectId, maxIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: Math.min(maxIndex, (prev[projectId] || 0) + 1)
    }));
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
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
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
            
            {/* Sidebar gauche */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-4">
                
                {currentUser && (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="px-4 pb-4 -mt-8">
                      <Link href={`/dashboard/profile/${currentUser.id}`} className="block">
                        <Tooltip text={`Voir le profil de ${currentUser.fullName || currentUser.nom || 'Utilisateur'}`}>
                          <div className="cursor-pointer inline-block">
                            <AvatarDisplay
                              name={currentUser.fullName || currentUser.nom || 'Utilisateur'}
                              avatar={currentUser.avatar}
                              size="lg"
                              showBorder={true}
                            />
                          </div>
                        </Tooltip>
                      </Link>
                      <Link href={`/dashboard/profile/${currentUser.id}`}>
                        <h3 className="mt-2 font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors cursor-pointer">
                          {currentUser.fullName || currentUser.nom || 'Utilisateur'}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-lg font-bold text-indigo-600">{userStats.friends}</p>
                          <p className="text-xs text-gray-500">Amis</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{userStats.projects}</p>
                          <p className="text-xs text-gray-500">
                            {currentUser.typeProfil === 'DONATEUR' ? 'Soutenus' : 'Projets'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{userStats.donations}</p>
                          <p className="text-xs text-gray-500">
                            {currentUser.typeProfil === 'DONATEUR' ? 'Dons' : 'Reçus'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
                    Catégories
                  </h3>
                  <div className="space-y-1">
                    {[
                      { key: 'all', label: 'Tous', count: projects.length },
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

                {currentUser?.typeProfil === 'ETABLISSEMENT' && (
                  <button
                    onClick={handlePublishProject}
                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Publier un Projet
                  </button>
                )}
              </div>
            </div>

            {/* Feed principal */}
            <div className="lg:col-span-6 space-y-4">
              
              {currentUser?.typeProfil === 'ETABLISSEMENT' && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center space-x-3">
                    <AvatarBadge
                      name={currentUser.fullName || currentUser.nom || 'Utilisateur'}
                      avatar={currentUser.avatar}
                      size="md"
                    />
                    <button
                      onClick={handlePublishProject}
                      className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition text-sm"
                    >
                      Publier un nouveau projet...
                    </button>
                  </div>
                </div>
              )}

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

              {filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
                  <p className="text-gray-500 mb-4 text-sm">Pas encore de projets dans cette catégorie.</p>
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
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link href={`/dashboard/profile/${project.auteur?.id || project.establishment.id}`}>
                          <Tooltip text={`Voir le profil de ${project.establishment.name}`}>
                            <div className="cursor-pointer">
                              <AvatarBadge
                                name={project.establishment.name}
                                avatar={project.establishment.avatar}
                                size="md"
                              />
                            </div>
                          </Tooltip>
                        </Link>
                        <div>
                          <Link href={`/dashboard/profile/${project.auteur?.id || project.establishment.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                              {project.establishment.name}
                            </h3>
                          </Link>
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

                    {project.images && project.images.length > 0 && (
                      <div className="relative group">
                        <img 
                          src={project.images[currentImageIndex[project.id] || 0]} 
                          alt={project.title}
                          className="w-full h-96 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800';
                          }}
                        />
                        
                        {/* Indicateurs de photos */}
                        {project.images.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                            {(currentImageIndex[project.id] || 0) + 1} / {project.images.length}
                          </div>
                        )}

                        {/* Bouton précédent */}
                        {project.images.length > 1 && (currentImageIndex[project.id] || 0) > 0 && (
                          <button
                            onClick={() => handlePreviousImage(project.id)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}

                        {/* Bouton suivant */}
                        {project.images.length > 1 && (currentImageIndex[project.id] || 0) < project.images.length - 1 && (
                          <button
                            onClick={() => handleNextImage(project.id, project.images.length - 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}

                        {/* Points indicateurs */}
                        {project.images.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {project.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(prev => ({ ...prev, [project.id]: index }))}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  (currentImageIndex[project.id] || 0) === index
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Tooltip text={project.liked ? "Vous aimez cette publication" : "Aimer cette publication"}>
                          <button 
                            onClick={() => handleLike(project.id)}
                            className="flex items-center space-x-1 hover:text-red-600 transition"
                          >
                            <Heart className={`w-4 h-4 ${project.liked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span className="font-medium">{project.stats.likes}</span>
                          </button>
                        </Tooltip>
                        <Tooltip text="Voir les commentaires">
                          <button 
                            onClick={() => toggleComments(project.id)}
                            className="hover:text-indigo-600 transition cursor-pointer"
                          >
                            {project.stats.comments} commentaires
                          </button>
                        </Tooltip>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>{project.stats.shares} partages</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{project.stats.donations} dons</span>
                      </div>
                    </div>

                    <div className="px-4 py-2 flex items-center justify-around border-t border-gray-100">
                      <Tooltip text={project.liked ? "Vous aimez déjà" : "Aimer la publication"}>
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
                      </Tooltip>
                      <Tooltip text="Commenter la publication">
                        <button 
                          onClick={() => toggleComments(project.id)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-medium text-sm">Commenter</span>
                        </button>
                      </Tooltip>
                      <Tooltip text="Partager avec vos amis">
                        <button 
                          onClick={() => handleShare(project.id)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="font-medium text-sm">Partager</span>
                        </button>
                      </Tooltip>
                      <Tooltip text={project.saved ? "Retirer des favoris" : "Enregistrer dans les favoris"}>
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
                      </Tooltip>
                    </div>

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
                                  <Link href={`/dashboard/profile/${comment.user.id}`}>
                                    <Tooltip text={`Voir le profil de ${comment.user.fullName}`}>
                                      <div className="cursor-pointer">
                                        <AvatarBadge
                                          name={comment.user.fullName}
                                          avatar={comment.user.avatar}
                                          size="sm"
                                        />
                                      </div>
                                    </Tooltip>
                                  </Link>
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
                                            <Link href={`/dashboard/profile/${comment.user.id}`}>
                                              <span className="font-semibold text-sm text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                                                {comment.user.fullName}
                                              </span>
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                              {formatDate(comment.createdAt)}
                                            </span>
                                          </div>
                                          {currentUser?.id === comment.user.id && (
                                            <div className="flex items-center space-x-1">
                                              <Tooltip text="Modifier le commentaire">
                                                <button
                                                  onClick={() => {
                                                    setEditingComment(comment.id);
                                                    setEditCommentText(comment.content);
                                                  }}
                                                  className="p-1 hover:bg-gray-100 rounded text-gray-600"
                                                >
                                                  <Edit2 className="w-3 h-3" />
                                                </button>
                                              </Tooltip>
                                              <Tooltip text="Supprimer le commentaire">
                                                <button
                                                  onClick={() => handleDeleteComment(project.id, comment.id)}
                                                  className="p-1 hover:bg-gray-100 rounded text-red-600"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </Tooltip>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                        <div className="flex items-center space-x-3 mt-2">
                                          <Tooltip text={comment.liked ? "Vous aimez ce commentaire" : "Aimer ce commentaire"}>
                                            <button
                                              onClick={() => handleLikeComment(project.id, comment.id)}
                                              className={`flex items-center space-x-1 text-xs ${
                                                comment.liked ? 'text-red-600' : 'text-gray-500'
                                              } hover:text-red-600 transition`}
                                            >
                                              <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                                              <span>{comment.likesCount || 0}</span>
                                            </button>
                                          </Tooltip>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 text-sm py-4">
                              Aucun commentaire. Soyez le premier !
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="px-4 py-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Link href={`/dashboard/profile/${currentUser?.id}`}>
                          <Tooltip text="Votre profil">
                            <div className="cursor-pointer">
                              <AvatarBadge
                                name={currentUser?.fullName || currentUser?.nom || 'Utilisateur'}
                                avatar={currentUser?.avatar}
                                size="sm"
                              />
                            </div>
                          </Tooltip>
                        </Link>
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Ajouter un commentaire..."
                            value={commentInputs[project.id] || ''}
                            onChange={(e) => handleCommentChange(project.id, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(project.id)}
                            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <Tooltip text="Envoyer le commentaire">
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
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Sidebar droite - Statistiques */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-4">
                
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
                  <h3 className="font-semibold mb-3 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Statistiques
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

                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-between">
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Projets Populaires
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                        <Link href={`/dashboard/profile/${project.auteur?.id || project.establishment.id}`} className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden">
                            {project.images?.[0] ? (
                              <img 
                                src={project.images[0]} 
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-indigo-400" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{project.title}</h4>
                          <Link href={`/dashboard/profile/${project.auteur?.id || project.establishment.id}`}>
                            <p className="text-xs text-gray-500 line-clamp-1 mb-1 hover:text-indigo-600 transition-colors cursor-pointer">
                              {project.establishment.name}
                            </p>
                          </Link>
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

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">Notre Impact</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Ensemble pour l'éducation à Madagascar
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
                        <p className="text-xs text-gray-600">Dons</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-2 px-2">
                  <div className="flex flex-wrap gap-2">
                    <a href="#" className="hover:underline">À propos</a>
                    <span>•</span>
                    <a href="#" className="hover:underline">Aide</a>
                    <span>•</span>
                    <a href="#" className="hover:underline">Confidentialité</a>
                  </div>
                  <p className="text-gray-400">© 2025 Mada Social Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteCommentModal
        isOpen={deleteCommentModal.isOpen}
        onClose={() => setDeleteCommentModal({ isOpen: false, projectId: null, commentId: null, commentAuthor: '', commentContent: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteCommentModal.isDeleting}
        commentAuthor={deleteCommentModal.commentAuthor}
        commentContent={deleteCommentModal.commentContent}
      />

      <SaveProjectModal
        isOpen={saveProjectModal.isOpen}
        onClose={() => setSaveProjectModal({ isOpen: false, projectId: null, projectTitle: '', projectImage: '', isSaving: false })}
        onConfirm={handleConfirmSave}
        projectTitle={saveProjectModal.projectTitle}
        projectImage={saveProjectModal.projectImage}
        isSaving={saveProjectModal.isSaving}
      />

      <ShareProjectModal
        isOpen={shareProjectModal.isOpen}
        onClose={() => setShareProjectModal({ isOpen: false, projectId: null, projectTitle: '', projectImage: '', establishmentName: '', isSharing: false })}
        onConfirm={handleConfirmShare}
        projectTitle={shareProjectModal.projectTitle}
        projectImage={shareProjectModal.projectImage}
        establishmentName={shareProjectModal.establishmentName}
        isSharing={shareProjectModal.isSharing}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
      />
    </>
  );
};

export default MadaSocialFeed;