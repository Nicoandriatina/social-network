'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Check, X, Search, Users, Clock } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  avatar: string | null;
  type: string;
  telephone?: string;
  email?: string;
}

interface FriendRequest {
  id: string;
  from: User;
  createdAt: string;
}

interface Friend extends User {}

export default function FriendsManagementPage({ currentUserId }: { currentUserId: string }) {
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'suggestions'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        fetch('/api/friends'),
        fetch('/api/friends/pending')
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friends || []);
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        setPendingRequests(data.requests || []);
      }

      // Charger les suggestions (tous les utilisateurs sauf amis et demandes en cours)
      await loadSuggestions();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      // Vous devrez créer cette route API
      const response = await fetch('/api/users/suggestions');
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.users || []);
      }
    } catch (error) {
      console.error('Erreur suggestions:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/friends/${requestId}`, {
        method: 'PUT'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'acceptation');
      }

      await loadData();
      alert('Demande acceptée !');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/friends/${requestId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus');
      }

      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: userId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      await loadData();
      alert('Demande envoyée !');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-blue-500 to-cyan-600',
      'from-pink-500 to-rose-600'
    ];
    return colors[index % colors.length];
  };

  const filteredFriends = friends.filter(f =>
    f.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestion des amis</h1>
              <p className="text-slate-600 mt-1">
                Gérez vos connexions et découvrez de nouveaux contacts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{friends.length}</div>
                <div className="text-xs text-slate-500">Amis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{pendingRequests.length}</div>
                <div className="text-xs text-slate-500">En attente</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
              placeholder="Rechercher un contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'friends'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users size={18} />
              Mes amis ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Clock size={18} />
              Demandes ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'suggestions'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserPlus size={18} />
              Suggestions
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Liste des amis */}
            {activeTab === 'friends' && (
              filteredFriends.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun ami</h3>
                  <p className="text-slate-500">Commencez par envoyer des demandes d'amis</p>
                </div>
              ) : (
                filteredFriends.map((friend, index) => (
                  <div key={friend.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(index)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                        {getInitials(friend.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">{friend.fullName}</h3>
                        <p className="text-sm text-slate-500">{friend.type}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>📧</span>
                        <span className="truncate">{friend.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>📱</span>
                        <span>{friend.telephone || 'Non renseigné'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => window.location.href = '/dashboard/messages'}
                        className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                      >
                        Envoyer un message
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Demandes en attente */}
            {activeTab === 'pending' && (
              pendingRequests.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune demande</h3>
                  <p className="text-slate-500">Vous n'avez pas de demandes d'amis en attente</p>
                </div>
              ) : (
                pendingRequests.map((request, index) => (
                  <div key={request.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(index)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                        {getInitials(request.from.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">{request.from.fullName}</h3>
                        <p className="text-sm text-slate-500">{request.from.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        Accepter
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={actionLoading === request.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                        Refuser
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Suggestions */}
            {activeTab === 'suggestions' && (
              filteredSuggestions.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <UserPlus size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune suggestion</h3>
                  <p className="text-slate-500">Nous n'avons pas de suggestions pour le moment</p>
                </div>
              ) : (
                filteredSuggestions.map((user, index) => (
                  <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(index)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                        {getInitials(user.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">{user.fullName}</h3>
                        <p className="text-sm text-slate-500">{user.type}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      disabled={actionLoading === user.id}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      <UserPlus size={16} />
                      {actionLoading === user.id ? 'Envoi...' : 'Ajouter'}
                    </button>
                  </div>
                ))
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}