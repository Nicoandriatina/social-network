// app/(dashboard)/admin/moderation/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, Ban, CheckCircle, Eye, Trash2,
  User, FileText, MessageSquare, RefreshCw, Clock
} from 'lucide-react';

export default function AdminModerationPage() {
  const [loading, setLoading] = useState(true);
  const [suspendedUsers, setSuspendedUsers] = useState<any[]>([]);
  const [unpublishedProjects, setUnpublishedProjects] = useState<any[]>([]);
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'comments'>('users');

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/moderation');
      const result = await response.json();

      if (result.success) {
        setSuspendedUsers(result.data.suspendedUsers);
        setUnpublishedProjects(result.data.unpublishedProjects);
        setRecentComments(result.data.recentComments);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement modération:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (action: string, targetType: string, targetId: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetType, targetId, reason })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Action '${action}' effectuée avec succès`);
        fetchModerationData();
      } else {
        alert(result.error || "Erreur lors de l'action");
      }
    } catch (error) {
      console.error("Erreur action modération:", error);
      alert("Erreur lors de l'exécution de l'action");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-600">{title}</p>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Centre de Modération
            </h1>
            <p className="text-slate-600">
              Gérer les contenus et utilisateurs signalés
            </p>
          </div>
          <button
            onClick={fetchModerationData}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Actions totales"
            value={stats.totalActions || 0}
            icon={Shield}
            color="#6366f1"
          />
          <StatCard
            title="Utilisateurs suspendus"
            value={stats.suspendedUsers || 0}
            icon={Ban}
            color="#ef4444"
          />
          <StatCard
            title="Projets dépubliés"
            value={stats.unpublishedProjects || 0}
            icon={FileText}
            color="#f59e0b"
          />
          <StatCard
            title="Validations en attente"
            value={stats.pendingValidations || 0}
            icon={Clock}
            color="#10b981"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border border-b-0 border-slate-200 p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Utilisateurs suspendus ({suspendedUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Projets dépubliés ({unpublishedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'comments'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Commentaires récents ({recentComments.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl border border-slate-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement...</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Utilisateurs suspendus */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  {suspendedUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300" />
                      <p>Aucun utilisateur suspendu</p>
                    </div>
                  ) : (
                    suspendedUsers.map((user) => (
                      <div key={user.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Ban className="w-6 h-6 text-red-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-800">{user.name}</h3>
                            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                              {user.type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{user.email}</p>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                            <p className="text-xs font-medium text-amber-900 mb-1">
                              Raison de la suspension:
                            </p>
                            <p className="text-sm text-amber-800">{user.reason}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Suspendu le: {new Date(user.suspendedAt).toLocaleDateString('fr-FR')}</span>
                            <span>Activités: {user.activityCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleModeration('unsuspend', 'user', user.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Réactiver
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Projets dépubliés */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {unpublishedProjects.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300" />
                      <p>Aucun projet dépublié</p>
                    </div>
                  ) : (
                    unpublishedProjects.map((project) => (
                      <div key={project.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{project.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">
                            Par: {project.author} • Réf: {project.reference}
                          </p>
                          
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                            <p className="text-xs font-medium text-amber-900 mb-1">
                              Raison de la dépublication:
                            </p>
                            <p className="text-sm text-amber-800">{project.reason}</p>
                          </div>
                          
                          <p className="text-xs text-slate-500">
                            Dépublié le: {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleModeration('publish', 'project', project.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Republier
                          </button>
                          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Commentaires récents */}
              {activeTab === 'comments' && (
                <div className="space-y-3">
                  {recentComments.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <p>Aucun commentaire récent</p>
                    </div>
                  ) : (
                    recentComments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                          {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt={comment.author.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-bold">
                              {comment.author.fullName[0]}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-800">{comment.author.fullName}</p>
                            <span className="text-xs text-slate-500">
                              • {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            Sur le projet: <span className="font-medium">{comment.project.titre}</span>
                          </p>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-sm text-slate-700">{comment.content}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
                                handleModeration('delete', 'comment', comment.id, "Contenu inapproprié");
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}