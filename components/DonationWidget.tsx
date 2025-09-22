// components/dashboard/DonationsWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { Gift, Package, CheckCircle2, Truck, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

const DonationsWidget = ({ userType }) => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    received: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDonations = async () => {
    if (userType !== "ETABLISSEMENT" && userType !== "ENSEIGNANT") {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/donations/received');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }
      
      const data = await response.json();
      setDonations(data.donations || []);
      setStats(data.stats || { total: 0, pending: 0, sent: 0, received: 0 });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [userType]);

  const getStatusIcon = (statut) => {
    const statusMap = {
      'EN_ATTENTE': Clock,
      'ENVOYE': Truck,
      'RECEPTIONNE': CheckCircle2
    };
    return statusMap[statut] || Clock;
  };

  const getStatusColor = (statut) => {
    const colorMap = {
      'EN_ATTENTE': 'text-yellow-600',
      'ENVOYE': 'text-blue-600',
      'RECEPTIONNE': 'text-green-600'
    };
    return colorMap[statut] || 'text-gray-600';
  };

  if (userType !== "ETABLISSEMENT" && userType !== "ENSEIGNANT") {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Gift className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Dons reçus</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Gift className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Dons reçus</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadDonations}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const pendingActions = donations.filter(d => d.statut === 'ENVOYE').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Gift className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Dons reçus</h3>
        </div>
        <Link
          href="/dashboard/donations/received"
          className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {stats.total === 0 ? (
        <div className="text-center py-4">
          <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Aucun don reçu</p>
        </div>
      ) : (
        <>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{stats.sent}</div>
              <div className="text-xs text-slate-500">Envoyés</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.received}</div>
              <div className="text-xs text-slate-500">Reçus</div>
            </div>
          </div>

          {/* Alerte actions à effectuer */}
          {pendingActions > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {pendingActions} don{pendingActions > 1 ? 's' : ''} à confirmer
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Des dons ont été envoyés et attendent votre confirmation de réception
              </p>
            </div>
          )}

          {/* Liste des derniers dons */}
          <div className="space-y-2">
            {donations.slice(0, 3).map((don) => {
              const StatusIcon = getStatusIcon(don.statut);
              const statusColor = getStatusColor(don.statut);
              
              return (
                <div key={don.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {don.libelle}
                    </p>
                    <p className="text-xs text-slate-500">
                      de {don.donateur?.fullName}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 ${statusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="text-xs">
                      {don.statut === 'EN_ATTENTE' && 'En attente'}
                      {don.statut === 'ENVOYE' && 'Envoyé'}
                      {don.statut === 'RECEPTIONNE' && 'Reçu'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {donations.length > 3 && (
            <div className="text-center mt-3 pt-3 border-t border-slate-100">
              <Link
                href="/dashboard/donations/received"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                +{donations.length - 3} autre{donations.length - 3 > 1 ? 's' : ''}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonationsWidget;