// app/(dashboard)/admin/projects/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Eye, Ban, CheckCircle, Trash2,
  Heart, MessageSquare, Share2, TrendingUp, Calendar, Download,
  RefreshCw, Building2, User, Gift
} from 'lucide-react';

interface Project {
  id: string;
  reference: string;
  titre: string;
  categorie: string;
  datePublication: string | null;
  isCompleted: boolean;
  daysSinceCreation: number;
  auteur: any;
  etablissement: any;
  stats: {
    donations: number;
    totalAmount: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchProjects();
  }, [page, categoryFilter, statusFilter, searchQuery]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });

      if (categoryFilter) params.append("category", categoryFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/projects/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setProjects(result.data.projects);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.totalCount);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement projets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAction = async (action: string, projectId: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/projects/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, projectId, reason })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Action '${action}' effectuée avec succès`);
        fetchProjects();
      } else {
        alert(result.error || "Erreur lors de l'action");
      }
    } catch (error) {
      console.error("Erreur action projet:", error);
      alert("Erreur lors de l'exécution de l'action");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      INFRASTRUCTURE: 'bg-blue-100 text-blue-700',
      MATERIEL: 'bg-purple-100 text-purple-700',
      FORMATION: 'bg-green-100 text-green-700',
      ALIMENTATION: 'bg-orange-100 text-orange-700',
      SANTE: 'bg-red-100 text-red-700',
      AUTRE: 'bg-slate-100 text-slate-700'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category] || colors.AUTRE}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Gestion des Projets
          </h1>
          <p className="text-slate-600">
            {totalCount} projets au total
          </p>
        </div>

        {/* Stats */}
        {stats.byStatus && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600 mb-1">Publiés</p>
              <p className="text-2xl font-bold text-green-600">{stats.byStatus.published}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600 mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-amber-600">{stats.byStatus.draft}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600 mb-1">Terminés</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byStatus.completed}</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Toutes les catégories</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="MATERIEL">Matériel</option>
              <option value="FORMATION">Formation</option>
              <option value="ALIMENTATION">Alimentation</option>
              <option value="SANTE">Santé</option>
              <option value="AUTRE">Autre</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
              <option value="completed">Terminés</option>
            </select>

            <button
              onClick={fetchProjects}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Aucun projet trouvé</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Projet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      École
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Dons
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{project.titre}</p>
                          <p className="text-xs text-slate-500">{project.reference}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getCategoryBadge(project.categorie)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-800">
                            {project.etablissement.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
                            <Gift className="w-4 h-4 text-green-600" />
                            {project.stats.donations}
                          </div>
                          {project.stats.totalAmount > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              {formatAmount(project.stats.totalAmount)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {project.stats.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {project.stats.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {project.stats.shares}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {project.isCompleted ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            Terminé
                          </span>
                        ) : project.datePublication ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Publié
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                            Brouillon
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {project.datePublication ? (
                            <button
                              onClick={() => handleProjectAction('unpublish', project.id, "Dépublication admin")}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                              title="Dépublier"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleProjectAction('publish', project.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Publier"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {project.stats.donations === 0 && (
                            <button
                              onClick={() => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                                  handleProjectAction('delete', project.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}