// app/(dashboard)/admin/users/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, GraduationCap, Heart, Search, Filter,
  MoreVertical, Ban, CheckCircle, Trash2, Eye, TrendingUp,
  AlertTriangle, Download, RefreshCw, UserX, Activity
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface User {
  id: string;
  fullName: string;
  email: string;
  type: string;
  isValidated: boolean;
  isSuspended: boolean;
  createdAt: string;
  daysSinceCreation: number;
  activityScore: number;
  stats: {
    projects: number;
    donationsMade: number;
    donationsReceived: number;
    likes: number;
    comments: number;
  };
  etablissement?: any;
  enseignant?: any;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Données graphique
  const [growthData, setGrowthData] = useState([]);
  const [stats, setStats] = useState<any>({});
  
  // Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchUserGrowth();
  }, [page, typeFilter, statusFilter, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });

      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data.users);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.totalCount);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGrowth = async () => {
    try {
      const response = await fetch('/api/admin/stats/users?period=30d');
      const result = await response.json();
      
      if (result.success && result.data.dailySignups) {
        setGrowthData(result.data.dailySignups.slice(-15));
      }
    } catch (error) {
      console.error("Erreur chargement croissance:", error);
    }
  };

  const handleUserAction = async (action: string, userId: string, reason?: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, reason })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Action '${action}' effectuée avec succès`);
        fetchUsers(); // Recharger la liste
        setShowActionModal(false);
      } else {
        alert(result.error || "Erreur lors de l'action");
      }
    } catch (error) {
      console.error("Erreur action utilisateur:", error);
      alert("Erreur lors de l'exécution de l'action");
    }
  };

  const openActionModal = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'ETABLISSEMENT': return <Building2 className="w-4 h-4" />;
      case 'ENSEIGNANT': return <GraduationCap className="w-4 h-4" />;
      case 'DONATEUR': return <Heart className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'ETABLISSEMENT': return 'bg-blue-100 text-blue-700';
      case 'ENSEIGNANT': return 'bg-purple-100 text-purple-700';
      case 'DONATEUR': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.isSuspended) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center gap-1">
        <Ban className="w-3 h-3" /> Suspendu
      </span>;
    }
    if (!user.isValidated) {
      return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> En attente
      </span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
      <CheckCircle className="w-3 h-3" /> Actif
    </span>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-slate-600">
            {totalCount} utilisateurs au total
          </p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats && Array.isArray(stats) && stats.map((stat: any) => (
            <div key={stat.type} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(stat.type)}`}>
                  {getTypeIcon(stat.type)}
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.type}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphique croissance */}
        {growthData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Croissance des 15 derniers jours
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip />
                <Line type="monotone" dataKey="etablissements" stroke="#3b82f6" name="Établissements" />
                <Line type="monotone" dataKey="enseignants" stroke="#8b5cf6" name="Enseignants" />
                <Line type="monotone" dataKey="donateurs" stroke="#10b981" name="Donateurs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filtres et actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filtre type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les types</option>
              <option value="ETABLISSEMENT">Établissements</option>
              <option value="ENSEIGNANT">Enseignants</option>
              <option value="DONATEUR">Donateurs</option>
            </select>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">En attente</option>
              <option value="suspended">Suspendus</option>
            </select>

            <button
              onClick={fetchUsers}
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

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-slate-600">Chargement...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Activité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Inscription
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{user.fullName}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                          {user.etablissement && (
                            <p className="text-xs text-slate-400 mt-1">
                              {user.etablissement.nom}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(user.type)}`}>
                          {getTypeIcon(user.type)}
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-800">
                            {user.activityScore}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({user.stats.projects}P {user.stats.donationsMade}D)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          Il y a {user.daysSinceCreation}j
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!user.isValidated && (
                            <button
                              onClick={() => handleUserAction('validate', user.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Valider"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {user.isSuspended ? (
                            <button
                              onClick={() => handleUserAction('activate', user.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Activer"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionModal(user, 'suspend')}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                              title="Suspendre"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          
                          {user.activityScore === 0 && user.daysSinceCreation > 90 && (
                            <button
                              onClick={() => openActionModal(user, 'delete')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
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

      {/* Modal de confirmation */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Confirmer l'action
            </h3>
            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir {actionType === 'suspend' ? 'suspendre' : 'supprimer'} 
              l'utilisateur <strong>{selectedUser.fullName}</strong> ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUserAction(actionType, selectedUser.id, "Action admin")}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}