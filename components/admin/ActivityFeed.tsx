"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Gift, FileText, CheckCircle, 
  AlertTriangle, Building2, Activity, Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'donation' | 'project' | 'validation' | 'alert';
  message: string;
  time: string;
  timestamp: Date;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivities();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentActivities = async () => {
    try {
      // Récupérer les données récentes des différentes API
      const [users, donations, projects] = await Promise.all([
        fetch('/api/admin/stats/users?period=7d').then(r => r.json()),
        fetch('/api/admin/stats/donations?period=7d').then(r => r.json()),
        fetch('/api/admin/stats/projects?period=7d').then(r => r.json())
      ]);

      const recentActivities: ActivityItem[] = [];

      // Nouveaux utilisateurs
      if (users.success && users.data.summary.newUsersThisWeek > 0) {
        recentActivities.push({
          id: 'user-1',
          type: 'user',
          message: `${users.data.summary.newUsersThisWeek} nouveaux utilisateurs cette semaine`,
          time: 'Récent',
          timestamp: new Date()
        });
      }

      // Validations en attente
      if (users.success && users.data.pendingValidation?.length > 0) {
        const total = users.data.pendingValidation.reduce((sum: number, item: any) => sum + item.count, 0);
        recentActivities.push({
          id: 'validation-1',
          type: 'validation',
          message: `${total} utilisateurs en attente de validation`,
          time: 'En attente',
          timestamp: new Date()
        });
      }

      // Nouveaux dons
      if (donations.success && donations.data.summary.receivedDonations > 0) {
        recentActivities.push({
          id: 'donation-1',
          type: 'donation',
          message: `${donations.data.summary.receivedDonations} dons reçus`,
          time: 'Cette période',
          timestamp: new Date()
        });
      }

      // Dons bloqués
      if (donations.success && donations.data.stuckDonations?.length > 0) {
        recentActivities.push({
          id: 'alert-1',
          type: 'alert',
          message: `${donations.data.stuckDonations.length} dons bloqués > 14 jours`,
          time: 'À gérer',
          timestamp: new Date()
        });
      }

      // Nouveaux projets
      if (projects.success && projects.data.summary.publishedProjects > 0) {
        recentActivities.push({
          id: 'project-1',
          type: 'project',
          message: `${projects.data.summary.publishedProjects} projets publiés`,
          time: 'Cette période',
          timestamp: new Date()
        });
      }

      // Projets inactifs
      if (projects.success && projects.data.inactiveProjects?.length > 0) {
        recentActivities.push({
          id: 'alert-2',
          type: 'alert',
          message: `${projects.data.inactiveProjects.length} projets sans activité`,
          time: 'À vérifier',
          timestamp: new Date()
        });
      }

      setActivities(recentActivities);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return { Icon: Building2, color: 'blue' };
      case 'donation':
        return { Icon: Gift, color: 'green' };
      case 'project':
        return { Icon: FileText, color: 'purple' };
      case 'validation':
        return { Icon: CheckCircle, color: 'emerald' };
      case 'alert':
        return { Icon: AlertTriangle, color: 'amber' };
      default:
        return { Icon: Activity, color: 'slate' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Activité Récente</h3>
        </div>
        <Clock className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>Aucune activité récente</p>
          </div>
        ) : (
          activities.map((activity) => {
            const { Icon, color } = getActivityIcon(activity.type);
            return (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <button 
        onClick={fetchRecentActivities}
        className="w-full mt-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
      >
        Actualiser →
      </button>
    </div>
  );
};

export default ActivityFeed;