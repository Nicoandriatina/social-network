"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Gift, FileText, AlertTriangle, 
  CheckCircle, Clock, Building2, GraduationCap,
  Heart, MessageSquare, Share2, Activity, MapPin,
  DollarSign, Package, Eye, Filter, Download,
  ArrowUp, ArrowDown, MoreVertical
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SuperAdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour toutes les données avec valeurs par défaut
  const [kpiData, setKpiData] = useState({
    totalUsers: 0,
    growth: 0,
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    pendingValidations: 0
  });
  
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [donationsByType, setDonationsByType] = useState([]);
  const [donationFunnel, setDonationFunnel] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [engagementStats, setEngagementStats] = useState({
    likes: 0,
    likesGrowth: 0,
    comments: 0,
    commentsGrowth: 0,
    shares: 0,
    sharesGrowth: 0
  });

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching data for period:', timeRange);

      // Récupérer les données en parallèle avec timeout
      const fetchWithTimeout = (url, timeout = 10000) => {
        return Promise.race([
          fetch(url),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);
      };

      const results = await Promise.allSettled([
        fetchWithTimeout(`/api/admin/stats/overview?period=${timeRange}`).then(r => r.json()),
        fetchWithTimeout(`/api/admin/stats/users?period=${timeRange}`).then(r => r.json()),
        fetchWithTimeout(`/api/admin/stats/donations?period=${timeRange}`).then(r => r.json()),
        fetchWithTimeout(`/api/admin/stats/projects?period=${timeRange}`).then(r => r.json()),
        fetchWithTimeout(`/api/admin/stats/engagements?period=${timeRange}`).then(r => r.json())
      ]);

      console.log('📊 API Results:', results);

      // Traiter chaque résultat
      const [overviewResult, usersResult, donationsResult, projectsResult, engagementResult] = results;

      // Overview Data
      if (overviewResult.status === 'fulfilled' && overviewResult.value?.kpis) {
        const overview = overviewResult.value;
        console.log('✅ Overview data:', overview);
        setKpiData({
          totalUsers: overview.kpis.totalUsers?.value || 0,
          growth: overview.kpis.totalUsers?.change || 0,
          totalDonations: overview.kpis.totalDonations?.value || 0,
          totalAmount: overview.kpis.totalAmount?.value || 0,
          activeProjects: overview.kpis.activeProjects?.value || 0,
          pendingValidations: overview.alerts?.pendingValidations || 0
        });
      } else {
        console.warn('⚠️ Overview failed:', overviewResult);
      }

      // Users Data
      if (usersResult.status === 'fulfilled' && usersResult.value?.success) {
        const users = usersResult.value.data;
        console.log('✅ Users data:', users);
        
        if (users.dailySignups && users.dailySignups.length > 0) {
          const transformedData = users.dailySignups.slice(-30).map((day) => ({
            date: new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            etablissements: day.etablissements || 0,
            enseignants: day.enseignants || 0,
            donateurs: day.donateurs || 0
          }));
          setUserGrowthData(transformedData);
        }
      } else {
        console.warn('⚠️ Users failed:', usersResult);
      }

      // Donations Data
      if (donationsResult.status === 'fulfilled' && donationsResult.value?.success) {
        const donations = donationsResult.value.data;
        console.log('✅ Donations data:', donations);

        // Donations by Type
        if (donations.donationsByType && donations.donationsByType.length > 0) {
          const typeColors = {
            MONETAIRE: '#10b981',
            VIVRES: '#f59e0b',
            NON_VIVRES: '#3b82f6'
          };
          
          const typeNames = {
            MONETAIRE: 'Monétaire',
            VIVRES: 'Vivres',
            NON_VIVRES: 'Matériel'
          };
          
          const transformedTypes = donations.donationsByType.map((item) => ({
            name: typeNames[item.type] || item.type,
            value: item.count || 0,
            color: typeColors[item.type] || '#6366f1'
          }));
          setDonationsByType(transformedTypes);
        }

        // Donation Funnel
        if (donations.funnel) {
          setDonationFunnel([
            { 
              stage: 'Créés', 
              count: donations.funnel.created || 0, 
              color: '#6366f1' 
            },
            { 
              stage: 'Envoyés', 
              count: donations.funnel.sent || 0, 
              color: '#3b82f6' 
            },
            { 
              stage: 'Reçus', 
              count: donations.funnel.received || 0, 
              color: '#10b981' 
            }
          ]);
        }
      } else {
        console.warn('⚠️ Donations failed:', donationsResult);
      }

      // Projects Data
      if (projectsResult.status === 'fulfilled' && projectsResult.value?.success) {
        const projects = projectsResult.value.data;
        console.log('✅ Projects data:', projects);

        if (projects.topProjects && projects.topProjects.length > 0) {
          setTopProjects(projects.topProjects.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title || p.titre || 'Projet sans titre',
            donations: p.donationsCount || 0,
            amount: p.totalAmount || 0
          })));
        }
      } else {
        console.warn('⚠️ Projects failed:', projectsResult);
      }

      // Engagement Data
      if (engagementResult.status === 'fulfilled' && engagementResult.value?.success) {
        const engagement = engagementResult.value.data;
        console.log('✅ Engagement data:', engagement);

        if (engagement.summary) {
          setEngagementStats({
            likes: engagement.summary.totalLikes || 0,
            likesGrowth: engagement.summary.growth?.likes || 0,
            comments: engagement.summary.totalComments || 0,
            commentsGrowth: engagement.summary.growth?.comments || 0,
            shares: engagement.summary.totalShares || 0,
            sharesGrowth: engagement.summary.growth?.shares || 0
          });
        }
      } else {
        console.warn('⚠️ Engagement failed:', engagementResult);
      }

      // Construire les activités récentes
      buildRecentActivity(usersResult, donationsResult, projectsResult, overviewResult);

    } catch (error) {
      console.error('❌ Erreur globale:', error);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const buildRecentActivity = (users, donations, projects, overview) => {
    const activities = [];

    try {
      // Nouveaux utilisateurs
      if (users.status === 'fulfilled' && users.value?.success) {
        const userData = users.value.data;
        if (userData.summary?.newUsersThisWeek > 0) {
          activities.push({
            type: 'user',
            message: `${userData.summary.newUsersThisWeek} nouveaux utilisateurs cette semaine`,
            time: 'Récent',
            icon: Building2,
            color: 'blue'
          });
        }
      }

      // Dons reçus
      if (donations.status === 'fulfilled' && donations.value?.success) {
        const donData = donations.value.data;
        if (donData.summary?.receivedDonations > 0) {
          activities.push({
            type: 'donation',
            message: `${donData.summary.receivedDonations} dons reçus`,
            time: 'Cette période',
            icon: Gift,
            color: 'green'
          });
        }
      }

      // Projets publiés
      if (projects.status === 'fulfilled' && projects.value?.success) {
        const projData = projects.value.data;
        if (projData.summary?.publishedProjects > 0) {
          activities.push({
            type: 'project',
            message: `${projData.summary.publishedProjects} projets publiés`,
            time: 'Cette période',
            icon: FileText,
            color: 'purple'
          });
        }
      }

      // Validations en attente
      if (overview.status === 'fulfilled' && overview.value?.alerts) {
        if (overview.value.alerts.pendingValidations > 0) {
          activities.push({
            type: 'validation',
            message: `${overview.value.alerts.pendingValidations} utilisateurs à valider`,
            time: 'En attente',
            icon: CheckCircle,
            color: 'emerald'
          });
        }

        if (overview.value.alerts.pendingDonations > 0) {
          activities.push({
            type: 'alert',
            message: `${overview.value.alerts.pendingDonations} dons en attente`,
            time: 'À gérer',
            icon: AlertTriangle,
            color: 'amber'
          });
        }
      }

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Erreur construction activités:', error);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">{value}</h3>
          {change !== undefined && change !== null && (
            <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
              <span className="text-slate-500">vs période précédente</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} 
             style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const AlertBanner = () => {
    if (kpiData.pendingValidations === 0) return null;

    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">Actions requises</h3>
            <div className="space-y-1 text-sm text-amber-800">
              <p>• {kpiData.pendingValidations} utilisateurs en attente de validation</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">
            Gérer
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Super Admin</h1>
                <p className="text-slate-600">Chargement des données...</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchAllData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard Super Admin</h1>
              <p className="text-slate-600">Gestion de la plateforme Mada Social Network</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
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
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Alertes */}
        <AlertBanner />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Utilisateurs Total"
            value={kpiData.totalUsers.toLocaleString()}
            change={kpiData.growth}
            icon={Users}
            color="#3b82f6"
          />
          <StatCard
            title="Dons Reçus"
            value={kpiData.totalDonations}
            icon={Gift}
            color="#10b981"
          />
          <StatCard
            title="Montant Total"
            value={formatAmount(kpiData.totalAmount)}
            icon={DollarSign}
            color="#059669"
          />
          <StatCard
            title="Projets Actifs"
            value={kpiData.activeProjects}
            icon={FileText}
            color="#8b5cf6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Graphique croissance utilisateurs */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Croissance des Utilisateurs</h3>
                <p className="text-sm text-slate-600">Par type de profil</p>
              </div>
            </div>
            
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="etablissements" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Établissements"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enseignants" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Enseignants"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="donateurs" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Donateurs"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Aucune donnée disponible pour cette période</p>
                </div>
              </div>
            )}
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Activité Récente</h3>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  const colorMap = {
                    blue: '#3b82f6',
                    green: '#10b981',
                    purple: '#8b5cf6',
                    emerald: '#059669',
                    amber: '#f59e0b'
                  };
                  const iconColor = colorMap[activity.color] || '#6366f1';
                  
                  return (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{ backgroundColor: `${iconColor}20` }}>
                        <Icon className="w-4 h-4" style={{ color: iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400 text-center py-8">Aucune activité récente</p>
              )}
            </div>
            
            <button 
              onClick={fetchAllData}
              className="w-full mt-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Répartition des dons */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Répartition des Dons</h3>
            
            {donationsByType.length > 0 ? (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={donationsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {donationsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                  {donationsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span className="text-sm font-medium text-slate-800">{type.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{type.value} dons</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Gift className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Aucun don enregistré</p>
                </div>
              </div>
            )}
          </div>

          {/* Entonnoir de conversion */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Parcours des Dons</h3>
            
            {donationFunnel.length > 0 && donationFunnel[0].count > 0 ? (
              <>
                <div className="space-y-4">
                  {donationFunnel.map((stage, index) => {
                    const percentage = donationFunnel[0].count > 0 
                      ? (stage.count / donationFunnel[0].count) * 100 
                      : 0;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                          <span className="text-sm font-bold text-slate-800">{stage.count}</span>
                        </div>
                        <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
                          <div 
                            className="absolute inset-y-0 left-0 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                            style={{ 
                              width: `${Math.max(percentage, 5)}%`,
                              backgroundColor: stage.color
                            }}
                          >
                            {percentage > 10 && `${percentage.toFixed(0)}%`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Taux de conversion</span>
                    <span className="text-2xl font-bold text-green-600">
                      {donationFunnel[0].count > 0 
                        ? ((donationFunnel[2].count / donationFunnel[0].count) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Aucun parcours de don disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top projets */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Top 5 Projets les Plus Soutenus</h3>
              <p className="text-sm text-slate-600">Classés par montant collecté</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Eye className="w-4 h-4" />
              Voir tous les projets
            </button>
          </div>
          
          {topProjects.length > 0 ? (
            <div className="space-y-3">
              {topProjects.map((project, index) => (
                <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{project.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-600">
                        <Gift className="w-3 h-3 inline mr-1" />
                        {project.donations} dons
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatAmount(project.amount)}
                    </div>
                  </div>
                  
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p>Aucun projet disponible</p>
            </div>
          )}
        </div>

        {/* Statistiques engagement social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600">Likes Total</h3>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {engagementStats.likes.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${engagementStats.likesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {engagementStats.likesGrowth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(engagementStats.likesGrowth).toFixed(1)}% cette période</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600">Commentaires</h3>
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {engagementStats.comments.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${engagementStats.commentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {engagementStats.commentsGrowth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(engagementStats.commentsGrowth).toFixed(1)}% cette période</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-600">Partages</h3>
              <Share2 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {engagementStats.shares.toLocaleString()}
            </div>
            <div className={`flex items-center gap-1 text-sm ${engagementStats.sharesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {engagementStats.sharesGrowth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{Math.abs(engagementStats.sharesGrowth).toFixed(1)}% cette période</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;