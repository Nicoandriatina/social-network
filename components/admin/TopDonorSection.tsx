"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Heart, DollarSign, 
  Building2, Calendar, Award, Star,
  ChevronRight, Gift, Zap
} from 'lucide-react';

interface DonorStats {
  totalDonations: number;
  totalAmount: number;
  donationsByType: {
    MONETAIRE: number;
    VIVRES: number;
    NON_VIVRES: number;
  };
  uniqueSchools: number;
  donationFrequency: number;
  lastDonationDate: string | null;
  lastDonationProject: string | null;
}

interface TopDonor {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  memberSince: string;
  stats: DonorStats;
}

interface GlobalStats {
  totalDonations: number;
  totalAmount: number;
  averagePerDonor: number;
}

const TopDonorsSection = () => {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    fetchTopDonors();
  }, [period]);

  const fetchTopDonors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats/top-donors?limit=5&period=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setTopDonors(result.data.topDonors);
        setGlobalStats(result.data.globalStats);
      }
    } catch (error) {
      console.error('Erreur chargement top donateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMedalColor = (rank: number) => {
    switch(rank) {
      case 0: return 'from-yellow-400 to-amber-500';
      case 1: return 'from-slate-300 to-slate-400';
      case 2: return 'from-orange-400 to-amber-600';
      default: return 'from-indigo-400 to-purple-500';
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank < 3) return <Trophy className="w-5 h-5 text-white" />;
    return <Award className="w-5 h-5 text-white" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats globales */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold">Top 5 Donateurs Exceptionnels</h2>
            </div>
            <p className="text-indigo-100">Les héros de notre communauté</p>
          </div>
          
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium focus:ring-2 focus:ring-white/50"
          >
            <option value="all" className="text-slate-800">Tout le temps</option>
            <option value="30d" className="text-slate-800">30 derniers jours</option>
            <option value="90d" className="text-slate-800">3 derniers mois</option>
            <option value="1y" className="text-slate-800">Cette année</option>
          </select>
        </div>

        {globalStats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-indigo-100 mb-1">Dons totaux</div>
              <div className="text-2xl font-bold">{globalStats.totalDonations}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-indigo-100 mb-1">Montant collecté</div>
              <div className="text-2xl font-bold">{formatAmount(globalStats.totalAmount)}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-indigo-100 mb-1">Moyenne/donateur</div>
              <div className="text-2xl font-bold">{formatAmount(globalStats.averagePerDonor)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des top donateurs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {topDonors.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Gift className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">Aucun donateur pour cette période</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {topDonors.map((donor, index) => (
              <div 
                key={donor.id}
                className="p-6 hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Médaille de rang */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${getMedalColor(index)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:scale-110 transition-transform`}>
                    {getMedalIcon(index)}
                  </div>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200">
                      {donor.avatar ? (
                        <img 
                          src={donor.avatar} 
                          alt={donor.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {donor.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                        <Zap className="w-3 h-3 text-yellow-900" />
                      </div>
                    )}
                  </div>

                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 truncate">
                          {donor.fullName}
                        </h3>
                        <p className="text-sm text-slate-500">{donor.email}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatAmount(donor.stats.totalAmount)}
                        </div>
                        <div className="text-xs text-slate-500">montant total</div>
                      </div>
                    </div>

                    {/* Statistiques en grille */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Gift className="w-4 h-4" />
                          <span className="text-xs font-medium">Dons</span>
                        </div>
                        <div className="text-xl font-bold text-blue-900">
                          {donor.stats.totalDonations}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <Building2 className="w-4 h-4" />
                          <span className="text-xs font-medium">École</span>
                        </div>
                        <div className="text-xl font-bold text-purple-900">
                          {donor.stats.uniqueSchools}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-medium">Fréquence</span>
                        </div>
                        <div className="text-xl font-bold text-green-900">
                          {donor.stats.donationFrequency.toFixed(1)}
                          <span className="text-xs font-normal text-green-600">/mois</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs font-medium">Type</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          {donor.stats.donationsByType.MONETAIRE > 0 && (
                            <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              {donor.stats.donationsByType.MONETAIRE}
                            </span>
                          )}
                          {donor.stats.donationsByType.VIVRES > 0 && (
                            <span className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              {donor.stats.donationsByType.VIVRES}
                            </span>
                          )}
                          {donor.stats.donationsByType.NON_VIVRES > 0 && (
                            <span className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                              {donor.stats.donationsByType.NON_VIVRES}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dernier don */}
                    {donor.stats.lastDonationDate && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                        <Calendar className="w-4 h-4" />
                        <span>Dernier don: {formatDate(donor.stats.lastDonationDate)}</span>
                        {donor.stats.lastDonationProject && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="truncate">{donor.stats.lastDonationProject}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Flèche */}
                  <div className="flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group">
            <span>Voir tous les donateurs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Légende des types de dons */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-700">Dons monétaires</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-slate-700">Vivres</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-slate-700">Matériel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDonorsSection;