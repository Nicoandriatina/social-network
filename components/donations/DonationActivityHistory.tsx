// components/donations/DonationActivityHistory.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  User, 
  CheckCircle2, 
  Truck, 
  Plus, 
  Edit3, 
  MessageSquare,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar
} from "lucide-react";

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  metadata?: any;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    type: string;
    avatar?: string;
  };
  donation: {
    id: string;
    libelle: string;
    type: string;
    montant?: number;
    statut: string;
    donateurName: string;
  };
}

interface DonationActivityHistoryProps {
  donationId?: string; // Si fourni, affiche uniquement l'historique de ce don
  limit?: number;
  showDonationInfo?: boolean; // Afficher les infos du don dans chaque entrée
}

const ACTION_ICONS = {
  'CREATED': Plus,
  'STATUS_UPDATED': CheckCircle2,
  'COMMENT_ADDED': MessageSquare,
  'PHOTO_ADDED': FileText,
  'EDITED': Edit3,
  'SHIPPED': Truck,
  'RECEIVED': CheckCircle2,
  'DEFAULT': Clock
};

const ACTION_COLORS = {
  'CREATED': 'text-blue-600 bg-blue-50',
  'STATUS_UPDATED': 'text-green-600 bg-green-50',
  'COMMENT_ADDED': 'text-purple-600 bg-purple-50',
  'PHOTO_ADDED': 'text-orange-600 bg-orange-50',
  'EDITED': 'text-yellow-600 bg-yellow-50',
  'SHIPPED': 'text-indigo-600 bg-indigo-50',
  'RECEIVED': 'text-emerald-600 bg-emerald-50',
  'DEFAULT': 'text-slate-600 bg-slate-50'
};

export default function DonationActivityHistory({ 
  donationId, 
  limit = 20,
  showDonationInfo = false 
}: DonationActivityHistoryProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [filterAction, setFilterAction] = useState<string>('all');

  const loadActivities = async (resetOffset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (resetOffset ? 0 : offset).toString()
      });
      
      if (donationId) {
        params.append('donationId', donationId);
      }

      const response = await fetch(`/api/donations/activity-log?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de l\'historique');
      }
      
      const data = await response.json();
      
      if (resetOffset) {
        setActivities(data.activities);
        setOffset(data.activities.length);
      } else {
        setActivities(prev => [...prev, ...data.activities]);
        setOffset(prev => prev + data.activities.length);
      }
      
      setHasMore(data.hasMore);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(true);
  }, [donationId]);

  const toggleExpanded = (activityId: string) => {
    setExpanded(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getActionIcon = (action: string) => {
    return ACTION_ICONS[action] || ACTION_ICONS.DEFAULT;
  };

  const getActionColor = (action: string) => {
    return ACTION_COLORS[action] || ACTION_COLORS.DEFAULT;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG').format(amount);
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      'DONATEUR': 'Donateur',
      'ETABLISSEMENT': 'Établissement',
      'ENSEIGNANT': 'Enseignant',
      'ADMIN': 'Administrateur'
    };
    return labels[type] || type;
  };

  const filteredActivities = filterAction === 'all' 
    ? activities 
    : activities.filter(activity => activity.action === filterAction);

  const availableActions = Array.from(new Set(activities.map(a => a.action)));

  if (loading && activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadActivities(true)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historique des actions
            </h3>
            <p className="text-sm text-slate-600">
              {filteredActivities.length} action{filteredActivities.length > 1 ? 's' : ''} 
              {filteredActivities.length !== activities.length && ` sur ${activities.length}`}
            </p>
          </div>
          
          {/* Filtre par action */}
          {availableActions.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Toutes les actions</option>
                {availableActions.map(action => (
                  <option key={action} value={action}>
                    {action.replace('_', ' ').toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Liste des activités */}
      <div className="p-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune activité</h3>
            <p className="text-slate-500">
              {filterAction !== 'all' 
                ? "Aucune action de ce type trouvée" 
                : "L'historique des actions apparaîtra ici"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const ActionIcon = getActionIcon(activity.action);
              const isExpanded = expanded.includes(activity.id);
              const hasMetadata = activity.metadata && Object.keys(activity.metadata).length > 0;

              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                  {/* Icône d'action */}
                  <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                    <ActionIcon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Description principale */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {activity.user.fullName}
                            <span className="text-slate-500">
                              ({getUserTypeLabel(activity.user.type)})
                            </span>
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatRelativeTime(activity.createdAt)}
                          </span>
                        </div>

                        {/* Informations du don si demandées */}
                        {showDonationInfo && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-700">
                                {activity.donation.libelle}
                              </span>
                              <span className="text-sm text-slate-500">
                                Don de {activity.donation.donateurName}
                              </span>
                            </div>
                            {activity.donation.montant && (
                              <div className="text-sm text-green-600 font-medium">
                                {formatAmount(activity.donation.montant)} Ar
                              </div>
                            )}
                          </div>
                        )}

                        {/* Métadonnées expandables */}
                        {hasMetadata && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleExpanded(activity.id)}
                              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Masquer les détails
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Voir les détails
                                </>
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                                <pre className="text-sm text-slate-600 whitespace-pre-wrap">
                                  {JSON.stringify(activity.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bouton charger plus */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => loadActivities(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Charger plus d\'activités'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}