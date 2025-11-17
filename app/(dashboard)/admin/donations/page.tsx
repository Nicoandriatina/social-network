// app/(dashboard)/admin/donations/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gift, DollarSign, Package, TrendingUp, Search, Filter,
  Download, RefreshCw, Eye, Clock, CheckCircle, AlertCircle,
  ArrowUpRight, Calendar, User, Building2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Donation {
  id: string;
  reference: string;
  libelle: string;
  type: string;
  statut: string;
  montant: number | null;
  quantite: number | null;
  createdAt: string;
  daysSinceCreation: number;
  processingTime: number | null;
  donateur: any;
  recipient: any;
  isStuck: boolean;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtres
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Stats
  const [stats, setStats] = useState<any>({});
  const [viewMode, setViewMode] = useState<'list' | 'transactions'>('list');

  // Données transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<any>({});

  useEffect(() => {
    if (viewMode === 'list') {
      fetchDonations();
    } else {
      fetchTransactions();
    }
  }, [page, typeFilter, statusFilter, searchQuery, startDate, endDate, viewMode]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });

      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/admin/donations/list?${params}`);
      const result = await response.json();

      if (result.success) {
        setDonations(result.data.donations);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.totalCount);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error("Erreur chargement dons:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50"
      });

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`/api/admin/donations/transactions?${params}`);
      const result = await response.json();

      if (result.success) {
        setTransactions(result.data.transactions);
        setMonthlyData(result.data.monthlyData);
        setTopDonors(result.data.topDonors);
        setTransactionSummary(result.data.summary);
        setTotalPages(result.data.pagination.totalPages);
        setTotalCount(result.data.pagination.totalCount);
      }
    } catch (error) {
      console.error("Erreur chargement transactions:", error);
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

  const getTypeBadge = (type: string) => {
    const config = {
      MONETAIRE: { color: 'bg-green-100 text-green-700', icon: DollarSign },
      VIVRES: { color: 'bg-orange-100 text-orange-700', icon: Package },
      NON_VIVRES: { color: 'bg-blue-100 text-blue-700', icon: Gift }
    };
    const { color, icon: Icon } = config[type as keyof typeof config] || config.NON_VIVRES;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        <Icon className="w-3 h-3" />
        {type}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      EN_ATTENTE: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'En attente' },
      ENVOYE: { color: 'bg-blue-100 text-blue-700', icon: ArrowUpRight, label: 'Envoyé' },
      RECEPTIONNE: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Reçu' }
    };
    const { color, icon: Icon, label } = config[status as keyof typeof config] || config.EN_ATTENTE;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-600">{title}</p>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Gestion des Dons
            </h1>
            <p className="text-slate-600">
              {totalCount} dons au total
            </p>
          </div>

          {/* Toggle vue */}
          <div className="flex gap-2 bg-white rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Liste des dons
            </button>
            <button
              onClick={() => setViewMode('transactions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'transactions'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Transactions monétaires
            </button>
          </div>
        </div>

        {/* Stats rapides */}
        {viewMode === 'list' && stats.byType && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total dons"
              value={totalCount}
              icon={Gift}
              color="#6366f1"
            />
            {stats.byType.map((stat: any) => (
              <StatCard
                key={stat.type}
                title={stat.type}
                value={stat.count}
                subtitle={stat.type === 'MONETAIRE' ? formatAmount(stats.totalMonetary || 0) : null}
                icon={
                  stat.type === 'MONETAIRE' ? DollarSign :
                  stat.type === 'VIVRES' ? Package : Gift
                }
                color={
                  stat.type === 'MONETAIRE' ? '#10b981' :
                  stat.type === 'VIVRES' ? '#f59e0b' : '#3b82f6'
                }
              />
            ))}
          </div>
        )}

        {viewMode === 'transactions' && transactionSummary.totalAmount && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Montant total"
              value={formatAmount(transactionSummary.totalAmount)}
              subtitle={`${transactionSummary.transactionCount} transactions`}
              icon={DollarSign}
              color="#10b981"
            />
            <StatCard
              title="Moyenne"
              value={formatAmount(transactionSummary.averageAmount)}
              subtitle="par transaction"
              icon={TrendingUp}
              color="#3b82f6"
            />
            <StatCard
              title="Maximum"
              value={formatAmount(transactionSummary.maxAmount)}
              subtitle="transaction la plus élevée"
              icon={ArrowUpRight}
              color="#8b5cf6"
            />
            <StatCard
              title="Minimum"
              value={formatAmount(transactionSummary.minAmount)}
              subtitle="transaction la plus faible"
              icon={Clock}
              color="#f59e0b"
            />
          </div>
        )}

        {/* Graphiques pour les transactions */}
        {viewMode === 'transactions' && monthlyData.length > 0 && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Évolution mensuelle */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Évolution mensuelle des transactions
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(value: any) => formatAmount(value)}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="totalAmount" fill="#10b981" name="Montant" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top donateurs */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Top 5 Donateurs
              </h3>
              <div className="space-y-3">
                {topDonors.slice(0, 5).map((donor, index) => (
                  <div key={donor.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{donor.name}</p>
                      <p className="text-xs text-slate-500">{donor.transactionCount} transactions</p>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      {formatAmount(donor.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {viewMode === 'list' && (
              <>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tous les types</option>
                  <option value="MONETAIRE">Monétaire</option>
                  <option value="VIVRES">Vivres</option>
                  <option value="NON_VIVRES">Matériel</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="ENVOYE">Envoyé</option>
                  <option value="RECEPTIONNE">Reçu</option>
                </select>
              </>
            )}

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Date début"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Date fin"
            />

            <div className="flex gap-2">
              <button
                onClick={() => viewMode === 'list' ? fetchDonations() : fetchTransactions()}
                className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {viewMode === 'list' ? (
          // Liste des dons
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-slate-600">Chargement...</p>
              </div>
            ) : donations.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Gift className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>Aucun don trouvé</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Don
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Donateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Bénéficiaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Montant/Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.map((don) => (
                      <tr key={don.id} className={`hover:bg-slate-50 ${don.isStuck ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-800">{don.libelle}</p>
                            <p className="text-xs text-slate-500">{don.reference}</p>
                            {don.isStuck && (
                              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Bloqué depuis {don.daysSinceCreation}j
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getTypeBadge(don.type)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(don.statut)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-800">{don.donateur.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {don.recipient && (
                            <div className="flex items-center gap-2">
                              {don.recipient.type === 'project' ? (
                                <Building2 className="w-4 h-4 text-slate-400" />
                              ) : (
                                <User className="w-4 h-4 text-slate-400" />
                              )}
                              <span className="text-sm text-slate-800">{don.recipient.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {don.type === 'MONETAIRE' && don.montant ? (
                            <span className="font-semibold text-green-600">
                              {formatAmount(don.montant)}
                            </span>
                          ) : don.quantite ? (
                            <span className="text-sm text-slate-700">
                              {don.quantite} {don.unite}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(don.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
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
        ) : (
          // Vue transactions monétaires
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-slate-600">Chargement...</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-slate-800">
                            {tx.donor.name}
                          </p>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                          <p className="font-semibold text-slate-800">
                            {tx.recipient.name}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600">{tx.libelle}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">
                            {new Date(tx.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-xs text-slate-500">
                            Réf: {tx.reference}
                          </span>
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatAmount(tx.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}