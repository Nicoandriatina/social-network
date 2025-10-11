"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Heart, MessageCircle, Gift, Users, FileText, CheckCheck } from 'lucide-react';
import { useSocket } from '@/app/contexts/SocketContext';

const NotificationsDropdown = () => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Charger les notifications initiales
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ÉCOUTER LES NOUVELLES NOTIFICATIONS EN TEMPS RÉEL
  useEffect(() => {
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      console.log('🔔 Nouvelle notification reçue:', notification);
      
      // Ajouter la notification en haut de la liste
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Notification navigateur
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }

      // Son de notification (optionnel)
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(err => console.log('Son non disponible'));
      } catch (err) {
        console.log('Son non disponible');
      }
    });

    return () => {
      socket.off('new-notification');
    };
  }, [socket]);

  // Charger au montage
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Demander la permission pour les notifications navigateur
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Permission notifications:', permission);
      });
    }
  }, []);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(notifications.filter(n => n.id !== notificationId));
        if (!notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      
      if (response.ok) {
        setNotifications(notifications.map(n => ({ 
          ...n, 
          read: true, 
          readAt: new Date() 
        })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  };

  // Icône selon le type de notification
  const getNotificationIcon = (type) => {
    const icons = {
      MESSAGE: <MessageCircle className="w-5 h-5 text-blue-600" />,
      FRIEND_REQUEST: <Users className="w-5 h-5 text-purple-600" />,
      FRIEND_ACCEPT: <Users className="w-5 h-5 text-green-600" />,
      PROJECT_COMMENT: <MessageCircle className="w-5 h-5 text-indigo-600" />,
      DONATION_RECEIVED: <Gift className="w-5 h-5 text-green-600" />,
      PROJECT_PUBLISHED: <FileText className="w-5 h-5 text-blue-600" />,
    };
    return icons[type] || <Bell className="w-5 h-5 text-gray-600" />;
  };

  // Format de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* 🔥 INDICATEUR DE CONNEXION SOCKET.IO */}
        <span 
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={isConnected ? 'Connecté - Notifications en temps réel' : 'Déconnecté'}
        />
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-600">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
                <span 
                  className={`text-xs ${isConnected ? 'text-green-600' : 'text-gray-500'}`}
                >
                  • {isConnected ? 'En direct' : 'Hors ligne'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 hover:bg-white rounded-lg transition text-indigo-600 hover:text-indigo-700"
                  title="Tout marquer comme lu"
                >
                  <CheckCheck className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-lg transition text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Aucune notification</p>
                <p className="text-xs text-gray-400 mt-1">Vous êtes à jour !</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                      !notification.read ? 'bg-indigo-50/50' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icône */}
                      <div className="flex-shrink-0 mt-1 relative">
                        {notification.relatedUser?.avatar ? (
                          <img 
                            src={notification.relatedUser.avatar} 
                            alt={notification.relatedUser.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full absolute -top-1 -left-1"></div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.content}
                        </p>
                        
                        {/* Informations additionnelles */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.project && (
                            <span className="text-xs text-indigo-600 font-medium">
                              • {notification.project.reference}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center space-x-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition text-green-600"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button 
                className="w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-700 py-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;