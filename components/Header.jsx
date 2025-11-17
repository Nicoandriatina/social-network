"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, User, Settings, HelpCircle, LogOut, Bell, X,
  MessageCircle, Users, FolderKanban, Gift, Inbox, Search, Menu, Command, Home,
  AlertTriangle, Loader2
} from "lucide-react";
import { useSocket } from "@/app/contexts/SocketContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationsDropdown from "./Notifications";
import { AvatarDisplay } from "./AvatarDisplay";

// Modal de confirmation de déconnexion moderne
const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading, userName, userAvatar }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône d'avertissement */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-white rounded-full p-3 shadow-lg">
                <AlertTriangle className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Avatar et nom */}
          <div className="mb-4 flex justify-center">
            <AvatarDisplay
              name={userName}
              avatar={userAvatar}
              size="lg"
              showBorder={true}
            />
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Confirmer la déconnexion
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">{userName}</span>, êtes-vous sûr de vouloir vous déconnecter ?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vous devrez vous reconnecter pour accéder à votre compte.
          </p>

          {/* Boutons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de notification (succès/erreur)
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
  useEffect(() => {
    if (isOpen && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className={`relative p-3 rounded-full ${
              type === "error" ? "bg-red-100" : "bg-green-100"
            }`}>
              {type === "error" ? (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              ) : (
                <LogOut className="w-8 h-8 text-green-500" />
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

const HeaderWithDropdown = ({ user, userType = "etablissement", avatar = null }) => {
  const { socket, isConnected } = useSocket();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [friendRequests, setFriendRequests] = useState(0);
  const [currentUserWithAvatar, setCurrentUserWithAvatar] = useState(null);
  
  // États pour les modals
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // 🔍 Récupérer l'utilisateur complet avec son avatar
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserWithAvatar(data.user);
        }
      } catch (error) {
        console.error('❌ Erreur récupération utilisateur:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    loadNotifications();
    loadUnreadMessages();
    loadFriendRequests();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      if (notification.type === 'MESSAGE') {
        setUnreadMessages(prev => prev + 1);
      } else if (notification.type === 'FRIEND_REQUEST') {
        setFriendRequests(prev => prev + 1);
      }
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/logo.png'
        });
      }
    });

    socket.on('new-message', () => {
      setUnreadMessages(prev => prev + 1);
    });

    return () => {
      socket.off('new-notification');
      socket.off('new-message');
    };
  }, [socket]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery("");
        setIsLogoutModalOpen(false);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/dashboard/acceuil');
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        router.push('/dashboard/messages');
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
        e.preventDefault();
        router.push('/dashboard/friends');
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        router.push('/dashboard/projects');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Erreur recherche:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const loadUnreadMessages = async () => {
    try {
      const response = await fetch('/api/messages/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadMessages(data.count || 0);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/pending-count');
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.count || 0);
      }
    } catch (error) {
      console.error('Erreur chargement demandes amis:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE'
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erreur marquage tous lu:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.type === 'MESSAGE' && notification.relatedUserId) {
      window.location.href = `/dashboard/messages?chat=${notification.relatedUserId}`;
    } else if (notification.type === 'FRIEND_REQUEST') {
      window.location.href = '/dashboard/friends';
    } else if (notification.type === 'PROJECT_PUBLISHED' || notification.type === 'PROJECT_COMMENT') {
      window.location.href = '/dashboard/projects';
    } else if (notification.type === 'DONATION_RECEIVED') {
      window.location.href = '/dashboard/donations';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return notifDate.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserDisplayName = () => {
    if (currentUserWithAvatar?.nom) return currentUserWithAvatar.nom;
    if (currentUserWithAvatar?.fullName) return currentUserWithAvatar.fullName;
    
    if (userType === "ETABLISSEMENT" && user?.etablissement?.nom) {
      return user.etablissement.nom;
    }
    return user?.fullName || user?.nom || user?.name || "Utilisateur";
  };

  const getUserAvatar = () => {
    if (currentUserWithAvatar?.avatar) {
      return currentUserWithAvatar.avatar;
    }

    if (avatar) return avatar;

    if (userType === "ETABLISSEMENT") {
      if (user?.etablissement?.logo) return user.etablissement.logo;
      if (user?.etablissement?.avatar) return user.etablissement.avatar;
      if (currentUserWithAvatar?.etablissement?.logo) return currentUserWithAvatar.etablissement.logo;
    }
    
    return user?.avatar || 
           user?.photo || 
           user?.image || 
           currentUserWithAvatar?.photo ||
           currentUserWithAvatar?.image ||
           null;
  };

  const getUserSubtitle = () => {
    if (userType === "ETABLISSEMENT" && user?.etablissement?.type) {
      return user.etablissement.type;
    }
    switch(userType) {
      case "ETABLISSEMENT":
        return "Établissement";
      case "DONATEUR":
        return "Donateur";
      case "ENSEIGNANT":
        return "Enseignant";
      default:
        return userType;
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setIsLogoutModalOpen(false);
        setNotificationModal({
          isOpen: true,
          type: "success",
          title: "Déconnexion réussie",
          message: "À bientôt ! Vous allez être redirigé..."
        });
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setIsLogoutModalOpen(false);
      setNotificationModal({
        isOpen: true,
        type: "error",
        title: "Erreur de déconnexion",
        message: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path) => pathname === path;

  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "Accueil",
        href: "/dashboard/acceuil",
        badge: 0,
        color: "text-blue-600",
        shortcut: "⌘H"
      },
      {
        icon: MessageCircle,
        label: "Messages",
        href: "/dashboard/messages",
        badge: unreadMessages,
        color: "text-blue-600",
        shortcut: "⌘M"
      },
      {
        icon: Users,
        label: "Amis",
        href: "/dashboard/friends",
        badge: friendRequests,
        color: "text-purple-600",
        shortcut: "⌘U"
      }
    ];

    const type = (userType || "").toUpperCase();

    if (type === "DONATEUR") {
      return [
        ...baseItems,
        
        {
          icon: Gift,
          label: "Mes Donations",
          href: "/dashboard",
          badge: 0,
          color: "text-green-600"
        }
      ];
    } else if (type === "ETABLISSEMENT") {
      return [
        ...baseItems,
        {
          icon: FolderKanban,
          label: "Mes Projets",
          href: "/dashboard",
          badge: 0,
          color: "text-orange-600",
          shortcut: "⌘P"
        },
        {
          icon: Inbox,
          label: "Dons reçus",
          href: "/dashboard/donations/received",
          badge: 0,
          color: "text-green-600"
        }
      ];
    } else if (type === "ENSEIGNANT") {
      return [
        ...baseItems,
        // {
        //   icon: FolderKanban,
        //   label: "Projets",
        //   href: "/projects",
        //   badge: 0,
        //   color: "text-orange-600",
        //   shortcut: "⌘P"
        // },
        {
          icon: Inbox,
          label: "Dons reçus",
          href: "/dashboard/donations/received",
          badge: 0,
          color: "text-green-600"
        }
      ];
    } else {
      return [
        ...baseItems,
        // {
        //   icon: FolderKanban,
        //   label: "Projets",
        //   href: "/projects",
        //   badge: 0,
        //   color: "text-orange-600",
        //   shortcut: "⌘P"
        // }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-400 to-teal-400 text-white font-bold grid place-items-center">
                MSN
              </div>
            </Link>
            
            <div className="hidden sm:block">
              <div className="font-semibold">Mada Social Network</div>
              <div className="text-xs text-slate-500">Réseau social éducatif</div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? item.color : ''}`} />
                <span className="text-sm">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Recherche */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-sm text-slate-500"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Rechercher...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
              >
                <AvatarDisplay
                  name={getUserDisplayName()}
                  avatar={getUserAvatar()}
                  size="sm"
                  showBorder={false}
                />
                <div className="text-sm hidden lg:block">
                  <div className="font-semibold truncate max-w-[180px]">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {getUserSubtitle()}
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-500 transition-transform hidden sm:block ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <AvatarDisplay
                        name={getUserDisplayName()}
                        avatar={getUserAvatar()}
                        size="md"
                        showBorder={true}
                      />
                      <div>
                        <div className="font-semibold text-slate-800">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-sm text-slate-500">
                          {getUserSubtitle()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {userType === "ETABLISSEMENT" && (
                    <div className="px-2 py-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        Voir tous les profils
                      </button>
                    </div>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <div className="px-2 py-1">
                      <Link 
                        href="/dashboard/edit"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Modification de profil
                      </Link>
                    </div>

                    <div className="px-2 py-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        Aide et assistance
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <div className="px-2 py-1">
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="bg-white w-[280px] h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Navigation</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.href) ? item.color : ''}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto min-w-[24px] h-6 px-2 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Modal de recherche */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-20" onClick={() => setIsSearchOpen(false)}>
          <div 
            ref={searchRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des utilisateurs, projets, messages..."
                className="flex-1 outline-none text-slate-800 placeholder:text-slate-400"
              />
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500">ESC</kbd>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {searchQuery && searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>Aucun résultat trouvé</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
                    >
                      <AvatarDisplay
                        name={result.name}
                        avatar={result.avatar}
                        size="sm"
                        showBorder={false}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">{result.name}</div>
                        <div className="text-sm text-slate-500 truncate">{result.description}</div>
                      </div>
                      <div className="text-xs text-slate-400">{result.type}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Commencez à taper pour rechercher</p>
                  <div className="mt-4 space-y-2 text-xs">
                    <p className="text-slate-400">Raccourcis clavier :</p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 rounded">⌘H</kbd>
                        <span>Accueil</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 rounded">⌘M</kbd>
                        <span>Messages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 rounded">⌘U</kbd>
                        <span>Amis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-slate-100 rounded">⌘P</kbd>
                        <span>Projets</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de déconnexion */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        userName={getUserDisplayName()}
        userAvatar={getUserAvatar()}
      />

      {/* Modal de notification (succès/erreur) */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal({ ...notificationModal, isOpen: false })}
        type={notificationModal.type}
        title={notificationModal.title}
        message={notificationModal.message}
      />
    </>
  );
};

export default HeaderWithDropdown;