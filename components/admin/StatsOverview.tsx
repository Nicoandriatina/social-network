"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Gift, FileText,
  ArrowUp, ArrowDown, DollarSign
} from 'lucide-react';

interface KPIData {
  totalUsers: {
    value: number;
    change: number;
    newThisPeriod: number;
  };
  totalDonations: {
    value: number;
    newThisPeriod: number;
  };
  totalAmount: {
    value: number;
    formatted: string;
  };
  activeProjects: {
    value: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    total: number;
  };
}

const StatsOverview = ({ period = '30d' }: { period?: string }) => {
  const [stats, setStats] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/admin/stats/overview?period=${period}`);
        const result = await response.json();
        
        if (response.ok && result.kpis) {
          setStats(result.kpis);
        } else {
          setError(result.error || 'Erreur lors du chargement');
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    subtitle 
  }: { 
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
              <span className="text-slate-500">vs période précédente</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <p className="text-red-800">{error || 'Erreur lors du chargement des statistiques'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Utilisateurs Total"
        value={stats.totalUsers.value.toLocaleString()}
        change={stats.totalUsers.change}
        subtitle={`+${stats.totalUsers.newThisPeriod} nouveaux`}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="Dons Reçus"
        value={stats.totalDonations.value}
        subtitle={`+${stats.totalDonations.newThisPeriod} cette période`}
        icon={Gift}
        color="green"
      />
      <StatCard
        title="Montant Total"
        value={stats.totalAmount.formatted}
        icon={DollarSign}
        color="emerald"
      />
      <StatCard
        title="Projets Actifs"
        value={stats.activeProjects.value}
        icon={FileText}
        color="purple"
      />
    </div>
  );
};

export default StatsOverview;