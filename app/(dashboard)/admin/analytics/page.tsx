// app/(dashboard)/admin/analytics/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Gift, FileText, Heart, MessageSquare, Share2,
  Download, Calendar, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  
  // Données
  const [usersData, setUsersData] = useState<any>({});
  const [donationsData, setDonationsData] = useState<any>({});
  const [projectsData, setProjectsData] = useState<any>({});
  const [engagementData, setEngagementData] = useState<any>({});

  useEffect(() => {
    fetchAllAnalytics();
  }, [period]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [users, donations, projects, engagement] = await Promise.all([
        fetch(`/api/admin/stats/users?period=${period}`).then(r => r.json()),
        fetch(`/api/admin/stats/donations?period=${period}`).then(r => r.json()),
        fetch(`/api/admin/stats/projects?period=${period}`).then(r => r.json()),
        fetch(`/api/admin/stats/engagements?period=${period}`).then(r => r.json())
      ]);

      console.log("📊 Users Data:", users);
      console.log("📊 Donations Data:", donations);
      console.log("📊 Projects Data:", projects);
      console.log("📊 Engagement Data:", engagement);

      if (users.success) {
        console.log("✅ UsersByType:", users.data.usersByType);
        setUsersData(users.data);
      }
      if (donations.success) setDonationsData(donations.data);
      if (projects.success) setProjectsData(projects.data);
      if (engagement.success) setEngagementData(engagement.data);

    } catch (error) {
      console.error("Erreur chargement analytics:", error);
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

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Analytics & Rapports
            </h1>
            <p className="text-slate-600">
              Vue détaillée des performances de la plateforme
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">Année en cours</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Exporter rapport
            </button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Total Utilisateurs</p>
              <Users className="w-6 h-6 text-blue-200" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {usersData.summary?.totalUsers.toLocaleString() || 0}
            </p>
            <p className="text-sm text-blue-100">
              +{usersData.summary?.newUsersThisWeek || 0} cette semaine
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100">Dons Reçus</p>
              <Gift className="w-6 h-6 text-green-200" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {donationsData.summary?.receivedDonations || 0}
            </p>
            <p className="text-sm text-green-100">
              Taux de réception: {donationsData.summary?.satisfactionRate || 0}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100">Projets Actifs</p>
              <FileText className="w-6 h-6 text-purple-200" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {projectsData.summary?.publishedProjects || 0}
            </p>
            <p className="text-sm text-purple-100">
              Taux de succès: {projectsData.summary?.successRate || 0}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100">Montant Total</p>
              <TrendingUp className="w-6 h-6 text-orange-200" />
            </div>
            <p className="text-3xl font-bold mb-1">
              {formatAmount(donationsData.summary?.totalAmount || 0)}
            </p>
            <p className="text-sm text-orange-100">
              Moyenne: {formatAmount(donationsData.summary?.averageDonationAmount || 0)}
            </p>
          </div>
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Croissance utilisateurs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Croissance des Utilisateurs
            </h3>
            {usersData.dailySignups && usersData.dailySignups.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={usersData.dailySignups.slice(-30)}>
                  <defs>
                    <linearGradient id="colorEtab" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="etablissements" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEtab)" name="Établissements" />
                  <Area type="monotone" dataKey="enseignants" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEns)" name="Enseignants" />
                  <Area type="monotone" dataKey="donateurs" stroke="#10b981" fillOpacity={1} fill="url(#colorDon)" name="Donateurs" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                Aucune donnée disponible
              </div>
            )}
          </div>

          {/* Dons quotidiens */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Évolution des Dons
            </h3>
            {donationsData.dailyDonations && donationsData.dailyDonations.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={donationsData.dailyDonations.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'amount') return formatAmount(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Nombre de dons" />
                  <Bar dataKey="amount" fill="#3b82f6" name="Montant (Ar)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Répartitions */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Types de dons */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Répartition des Dons
            </h3>
            {donationsData.donationsByType && donationsData.donationsByType.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={donationsData.donationsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {donationsData.donationsByType.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {donationsData.donationsByType.map((type: any, index: number) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-slate-700">{type.type}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{type.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                Aucune donnée
              </div>
            )}
          </div>

          {/* Types d'utilisateurs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Répartition Utilisateurs
            </h3>
            {usersData.usersByType && usersData.usersByType.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={usersData.usersByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {usersData.usersByType.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {usersData.usersByType.map((type: any, index: number) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-slate-700">{type.type}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{type.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Aucune donnée disponible</p>
                  <p className="text-xs mt-1">
                    {usersData.summary?.totalUsers > 0 
                      ? "Les utilisateurs n'ont pas de type défini" 
                      : "Aucun utilisateur inscrit"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Engagement social */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Engagement Social
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-slate-700">Likes</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">
                    {engagementData.summary?.totalLikes || 0}
                  </p>
                  <p className="text-xs text-green-600">
                    +{engagementData.summary?.growth?.likes || 0}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Commentaires</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">
                    {engagementData.summary?.totalComments || 0}
                  </p>
                  <p className="text-xs text-green-600">
                    +{engagementData.summary?.growth?.comments || 0}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">Partages</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">
                    {engagementData.summary?.totalShares || 0}
                  </p>
                  <p className="text-xs text-green-600">
                    +{engagementData.summary?.growth?.shares || 0}%
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Total Interactions</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {engagementData.summary?.totalInteractions || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top projets */}
        {projectsData.topProjects && projectsData.topProjects.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Top 5 Projets les Plus Soutenus
            </h3>
            <div className="space-y-3">
              {projectsData.topProjects.map((project: any, index: number) => (
                <div key={project.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{project.title}</h4>
                    <p className="text-sm text-slate-600">{project.schoolName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {formatAmount(project.totalAmount)}
                    </p>
                    <p className="text-xs text-slate-500">{project.donationsCount} dons</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}