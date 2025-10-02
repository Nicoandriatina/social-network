// //components/ Header.jsx

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";

// const HeaderWithDropdown = ({ user, userType = "etablissement" }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fermer le dropdown quand on clique ailleurs
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Couleurs selon le type d'utilisateur
//   const getAvatarColors = () => {
//     switch (userType) {
//       case "donateur":
//         return "from-emerald-500 to-teal-500";
//       case "enseignant":
//         return "from-indigo-500 to-purple-600";
//       default: // etablissement
//         return "from-indigo-500 to-purple-600";
//     }
//   };

//   const getAvatarLetters = () => {
//     if (userType === "etablissement" && user.etablissement?.nom) {
//       return user.etablissement.nom.slice(0, 2).toUpperCase();
//     }
//     return user.nom?.slice(0, 2).toUpperCase() || "U";
//   };

//   const getUserDisplayName = () => {
//     if (userType === "etablissement" && user.etablissement?.nom) {
//       return user.etablissement.nom;
//     }
//     return user.nom || "Utilisateur";
//   };

//   const getUserSubtitle = () => {
//     if (userType === "etablissement" && user.etablissement?.type) {
//       return user.etablissement.type;
//     }
//     return user.typeProfil || userType;
//   };

//   // Fonction de déconnexion avec confirmation
//   const handleLogout = async () => {
//     // Confirmation avant déconnexion
//     const confirmLogout = window.confirm(
//       'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre tableau de bord.'
//     );

//     if (!confirmLogout) {
//       return; // Annuler la déconnexion
//     }

//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         // Rediriger vers la page d'accueil (localhost:3000/)
//         window.location.href = '/';
//       } else {
//         console.error('Erreur lors de la déconnexion');
//         alert('Erreur lors de la déconnexion. Veuillez réessayer.');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la déconnexion:', error);
//       alert('Erreur de connexion. Veuillez vérifier votre connexion internet.');
//     }
//   };

//   return (
//     <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
//       <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-400 to-teal-400 text-white font-bold grid place-items-center">
//             MSN
//           </div>
//           <div>
//             <div className="font-semibold">Mada Social Network</div>
//             <div className="text-xs text-slate-500">Tableau de bord</div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Notifications */}
//           <button className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors">
//             🔔 
//             <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">
//               3
//             </span>
//           </button>

//           {/* Dropdown Menu */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
//             >
//               <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold`}>
//                 {getAvatarLetters()}
//               </div>
//               <div className="text-sm">
//                 <div className="font-semibold truncate max-w-[180px]">
//                   {getUserDisplayName()}
//                 </div>
//                 <div className="text-xs text-slate-500">
//                   {getUserSubtitle()}
//                 </div>
//               </div>
//               <ChevronDown 
//                 className={`w-4 h-4 text-slate-500 transition-transform ${
//                   isDropdownOpen ? 'rotate-180' : ''
//                 }`} 
//               />
//             </button>

//             {/* Dropdown Content */}
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
//                 {/* Profil utilisateur */}
//                 <div className="px-4 py-3 border-b border-slate-100">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold`}>
//                       {getAvatarLetters()}
//                     </div>
//                     <div>
//                       <div className="font-semibold text-slate-800">
//                         {getUserDisplayName()}
//                       </div>
//                       <div className="text-sm text-slate-500">
//                         {getUserSubtitle()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Voir tous les profils (pour les établissements qui ont plusieurs utilisateurs) */}
//                 {userType === "etablissement" && (
//                   <div className="px-2 py-1">
//                     <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
//                       <User className="w-4 h-4" />
//                       Voir tous les profils
//                     </button>
//                   </div>
//                 )}

//                 <div className="border-t border-slate-100 mt-1 pt-1">
//                   {/* Modification de profil */}
//                   <div className="px-2 py-1">
//                     <button 
//                       onClick={() => {
//                         setIsDropdownOpen(false);
//                         window.location.href = "/dashboard/edit";
//                       }}
//                       className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
//                     >
//                       <Settings className="w-4 h-4" />
//                       Modification de profil
//                     </button>
//                   </div>

//                   {/* Aide et assistance */}
//                   <div className="px-2 py-1">
//                     <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
//                       <HelpCircle className="w-4 h-4" />
//                       Aide et assistance
//                     </button>
//                   </div>
//                 </div>

//                 {/* Séparateur */}
//                 <div className="border-t border-slate-100 mt-1 pt-1">
//                   {/* Déconnexion */}
//                   <div className="px-2 py-1">
//                     <button 
//                       onClick={handleLogout}
//                       className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <LogOut className="w-4 h-4" />
//                       Se déconnecter
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default HeaderWithDropdown;

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Settings, HelpCircle, LogOut, Bell, X } from "lucide-react";
import { useSocket } from "@/app/contexts/SocketContext";


const HeaderWithDropdown = ({ user, userType = "etablissement" }) => {
  const { socket, isConnected } = useSocket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Charger les notifications au montage
  useEffect(() => {
    loadNotifications();
  }, []);

  // Écouter les nouvelles notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      console.log('🔔 Nouvelle notification reçue:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Notification du navigateur
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png'
        });
      }
    });

    return () => {
      socket.off('new-notification');
    };
  }, [socket]);

  // Demander la permission pour les notifications du navigateur
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
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
      console.error('❌ Erreur marquage lu:', error);
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
      console.error('❌ Erreur marquage tous lu:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Rediriger selon le type
    if (notification.type === 'message' && notification.relatedUserId) {
      window.location.href = `/dashboard/messages?chat=${notification.relatedUserId}`;
    } else if (notification.type === 'friend_request') {
      window.location.href = '/dashboard/friends';
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

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvatarColors = () => {
    switch (userType) {
      case "donateur":
        return "from-emerald-500 to-teal-500";
      case "enseignant":
        return "from-indigo-500 to-purple-600";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  const getAvatarLetters = () => {
    if (userType === "etablissement" && user.etablissement?.nom) {
      return user.etablissement.nom.slice(0, 2).toUpperCase();
    }
    return user.nom?.slice(0, 2).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (userType === "etablissement" && user.etablissement?.nom) {
      return user.etablissement.nom;
    }
    return user.nom || "Utilisateur";
  };

  const getUserSubtitle = () => {
    if (userType === "etablissement" && user.etablissement?.type) {
      return user.etablissement.type;
    }
    return user.typeProfil || userType;
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre tableau de bord.'
    );

    if (!confirmLogout) return;

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert('Erreur de connexion. Veuillez vérifier votre connexion internet.');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-400 to-teal-400 text-white font-bold grid place-items-center">
            MSN
          </div>
          <div>
            <div className="font-semibold">Mada Social Network</div>
            <div className="text-xs text-slate-500">Tableau de bord</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-30 max-h-[500px] flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            notif.read
                              ? 'hover:bg-slate-50'
                              : 'bg-indigo-50/50 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.read ? 'bg-slate-300' : 'bg-indigo-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm ${
                                  notif.read ? 'text-slate-700' : 'text-slate-900 font-semibold'
                                }`}>
                                  {notif.title}
                                </h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                  {formatTime(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold`}>
                {getAvatarLetters()}
              </div>
              <div className="text-sm">
                <div className="font-semibold truncate max-w-[180px]">
                  {getUserDisplayName()}
                </div>
                <div className="text-xs text-slate-500">
                  {getUserSubtitle()}
                </div>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-slate-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold`}>
                      {getAvatarLetters()}
                    </div>
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

                {userType === "etablissement" && (
                  <div className="px-2 py-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      Voir tous les profils
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <div className="px-2 py-1">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        window.location.href = "/dashboard/edit";
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Modification de profil
                    </button>
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
                      onClick={handleLogout}
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
  );
};

export default HeaderWithDropdown;