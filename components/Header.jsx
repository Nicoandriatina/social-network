// "use client";

// import { useState, useRef, useEffect } from "react";
// import { 
//   ChevronDown, User, Settings, HelpCircle, LogOut, Bell, X,
//   MessageCircle, Users, FolderKanban, Gift, Inbox, Search, Menu, Command
// } from "lucide-react";
// import { useSocket } from "@/app/contexts/SocketContext";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import NotificationsDropdown from "./Notifications";

// const HeaderWithDropdown = ({ user, userType = "etablissement" }) => {
//   const { socket, isConnected } = useSocket();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [unreadMessages, setUnreadMessages] = useState(0);
//   const [friendRequests, setFriendRequests] = useState(0);
//   const dropdownRef = useRef(null);
//   const notificationRef = useRef(null);
//   const searchRef = useRef(null);
//   const searchInputRef = useRef(null);

//   // 🔍 DEBUG : Afficher les props reçues
//   useEffect(() => {
//     console.log('🔍 Header Props:', {
//       user,
//       userType,
//       userName: user?.fullName || user?.nom || user?.name,
//       etablissement: user?.etablissement
//     });
//   }, [user, userType]);

//   useEffect(() => {
//     loadNotifications();
//     loadUnreadMessages();
//     loadFriendRequests();
//   }, []);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on('new-notification', (notification) => {
//       setNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
      
//       if (notification.type === 'MESSAGE') {
//         setUnreadMessages(prev => prev + 1);
//       } else if (notification.type === 'FRIEND_REQUEST') {
//         setFriendRequests(prev => prev + 1);
//       }
      
//       if ('Notification' in window && Notification.permission === 'granted') {
//         new Notification(notification.title, {
//           body: notification.content,
//           icon: '/logo.png'
//         });
//       }
//     });

//     socket.on('new-message', () => {
//       setUnreadMessages(prev => prev + 1);
//     });

//     return () => {
//       socket.off('new-notification');
//       socket.off('new-message');
//     };
//   }, [socket]);

//   // Raccourcis clavier
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Cmd/Ctrl + K pour ouvrir la recherche
//       if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
//         e.preventDefault();
//         setIsSearchOpen(true);
//         setTimeout(() => searchInputRef.current?.focus(), 100);
//       }
      
//       // ESC pour fermer la recherche
//       if (e.key === 'Escape') {
//         setIsSearchOpen(false);
//         setSearchQuery("");
//       }

//       // Cmd/Ctrl + M pour aller aux messages
//       if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
//         e.preventDefault();
//         router.push('/dashboard/messages');
//       }

//       // Cmd/Ctrl + U pour aller aux amis (Users)
//       if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
//         e.preventDefault();
//         router.push('/dashboard/friends');
//       }

//       // Cmd/Ctrl + P pour aller aux projets
//       if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
//         e.preventDefault();
//         router.push('/dashboard/projects');
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [router]);

//   // Demander la permission pour les notifications
//   useEffect(() => {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, []);

//   // Recherche avec debounce
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
//         if (response.ok) {
//           const data = await response.json();
//           setSearchResults(data.results || []);
//         }
//       } catch (error) {
//         console.error('Erreur recherche:', error);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const loadNotifications = async () => {
//     try {
//       const response = await fetch('/api/notifications');
//       if (!response.ok) throw new Error('Erreur chargement');
//       const data = await response.json();
//       setNotifications(data.notifications || []);
//       setUnreadCount(data.unreadCount || 0);
//     } catch (error) {
//       console.error('Erreur chargement notifications:', error);
//     }
//   };

//   const loadUnreadMessages = async () => {
//     try {
//       const response = await fetch('/api/messages/unread-count');
//       if (response.ok) {
//         const data = await response.json();
//         setUnreadMessages(data.count || 0);
//       }
//     } catch (error) {
//       console.error('Erreur chargement messages:', error);
//     }
//   };

//   const loadFriendRequests = async () => {
//     try {
//       const response = await fetch('/api/friends/pending-count');
//       if (response.ok) {
//         const data = await response.json();
//         setFriendRequests(data.count || 0);
//       }
//     } catch (error) {
//       console.error('Erreur chargement demandes amis:', error);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const response = await fetch('/api/notifications', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ notificationIds: [notificationId] })
//       });

//       if (response.ok) {
//         setNotifications(prev =>
//           prev.map(notif =>
//             notif.id === notificationId ? { ...notif, read: true } : notif
//           )
//         );
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       }
//     } catch (error) {
//       console.error('Erreur marquage lu:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const response = await fetch('/api/notifications', {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         setNotifications(prev =>
//           prev.map(notif => ({ ...notif, read: true }))
//         );
//         setUnreadCount(0);
//       }
//     } catch (error) {
//       console.error('Erreur marquage tous lu:', error);
//     }
//   };

//   const handleNotificationClick = (notification) => {
//     markAsRead(notification.id);
    
//     if (notification.type === 'MESSAGE' && notification.relatedUserId) {
//       window.location.href = `/dashboard/messages?chat=${notification.relatedUserId}`;
//     } else if (notification.type === 'FRIEND_REQUEST') {
//       window.location.href = '/dashboard/friends';
//     } else if (notification.type === 'PROJECT_PUBLISHED' || notification.type === 'PROJECT_COMMENT') {
//       window.location.href = '/dashboard/projects';
//     } else if (notification.type === 'DONATION_RECEIVED') {
//       window.location.href = '/dashboard/donations';
//     }
//   };

//   const formatTime = (date) => {
//     const now = new Date();
//     const notifDate = new Date(date);
//     const diffMs = now - notifDate;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 1) return "À l'instant";
//     if (diffMins < 60) return `Il y a ${diffMins}min`;
//     if (diffHours < 24) return `Il y a ${diffHours}h`;
//     if (diffDays < 7) return `Il y a ${diffDays}j`;
//     return notifDate.toLocaleDateString('fr-FR');
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setIsNotificationOpen(false);
//       }
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setIsSearchOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const getAvatarColors = () => {
//     switch (userType) {
//       case "DONATEUR":
//         return "from-emerald-500 to-teal-500";
//       case "ENSEIGNANT":
//         return "from-indigo-500 to-purple-600";
//       default:
//         return "from-indigo-500 to-purple-600";
//     }
//   };

//   const getAvatarLetters = () => {
//     if (userType === "ETABLISSEMENT" && user?.etablissement?.nom) {
//       return user.etablissement.nom.slice(0, 2).toUpperCase();
//     }
//     // Essayer différentes propriétés de nom
//     const name = user?.fullName || user?.nom || user?.name || user?.email;
//     return name?.slice(0, 2).toUpperCase() || "U";
//   };

//   const getUserDisplayName = () => {
//     if (userType === "ETABLISSEMENT" && user?.etablissement?.nom) {
//       return user.etablissement.nom;
//     }
//     // Essayer différentes propriétés de nom
//     return user?.fullName || user?.nom || user?.name || "Utilisateur";
//   };

//   const getUserSubtitle = () => {
//     if (userType === "ETABLISSEMENT" && user?.etablissement?.type) {
//       return user.etablissement.type;
//     }
//     // Formater le type pour l'affichage
//     switch(userType) {
//       case "ETABLISSEMENT":
//         return "Établissement";
//       case "DONATEUR":
//         return "Donateur";
//       case "ENSEIGNANT":
//         return "Enseignant";
//       default:
//         return userType;
//     }
//   };

//   const handleLogout = async () => {
//     const confirmLogout = window.confirm(
//       'Êtes-vous sûr de vouloir vous déconnecter ?'
//     );

//     if (!confirmLogout) return;

//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.ok) {
//         window.location.href = '/';
//       } else {
//         alert('Erreur lors de la déconnexion. Veuillez réessayer.');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la déconnexion:', error);
//       alert('Erreur de connexion.');
//     }
//   };

//   const isActive = (path) => pathname === path;

//   const getNavigationItems = () => {
//     const baseItems = [
//       {
//         icon: MessageCircle,
//         label: "Messages",
//         href: "/dashboard/messages",
//         badge: unreadMessages,
//         color: "text-blue-600",
//         shortcut: "⌘M"
//       },
//       {
//         icon: Users,
//         label: "Amis",
//         href: "/dashboard/friends",
//         badge: friendRequests,
//         color: "text-purple-600",
//         shortcut: "⌘U"
//       }
//     ];

//     // Vérifier le type exact (insensible à la casse)
//     const type = (userType || "").toUpperCase();

//     if (type === "DONATEUR") {
//       return [
//         ...baseItems,
//         {
//           icon: FolderKanban,
//           label: "Projets",
//           href: "/projects",
//           badge: 0,
//           color: "text-orange-600",
//           shortcut: "⌘P"
//         },
//         {
//           icon: Gift,
//           label: "Mes Donations",
//           href: "/dashboard",
//           badge: 0,
//           color: "text-green-600"
//         }
//       ];
//     } else if (type === "ETABLISSEMENT") {
//       return [
//         ...baseItems,
//         {
//           icon: FolderKanban,
//           label: "Mes Projets",
//           href: "/dashboard",
//           badge: 0,
//           color: "text-orange-600",
//           shortcut: "⌘P"
//         },
//         {
//           icon: Inbox,
//           label: "Dons reçus",
//           href: "/dashboard/donations/received",
//           badge: 0,
//           color: "text-green-600"
//         }
//       ];
//     } else if (type === "ENSEIGNANT") {
//       return [
//         ...baseItems,
//         {
//           icon: FolderKanban,
//           label: "Projets",
//           href: "/projects",
//           badge: 0,
//           color: "text-orange-600",
//           shortcut: "⌘P"
//         },
//         {
//           icon: Inbox,
//           label: "Dons reçus",
//           href: "/dashboard/donations/received",
//           badge: 0,
//           color: "text-green-600"
//         }
//       ];
//     } else {
//       // Fallback par défaut
//       return [
//         ...baseItems,
//         {
//           icon: FolderKanban,
//           label: "Projets",
//           href: "/projects",
//           badge: 0,
//           color: "text-orange-600",
//           shortcut: "⌘P"
//         }
//       ];
//     }
//   };

//   const navigationItems = getNavigationItems();

//   return (
//     <>
//       <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
//             >
//               <Menu className="w-5 h-5" />
//             </button>
            
//             <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
//               <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-rose-400 to-teal-400 text-white font-bold grid place-items-center">
//                 MSN
//               </div>
//             </Link>
            
//             <div className="hidden sm:block">
//               <div className="font-semibold">Mada Social Network</div>
//               <div className="text-xs text-slate-500">Réseau social éducatif</div>
//             </div>
//           </div>

//           {/* Navigation Desktop */}
//           <nav className="hidden md:flex items-center gap-2">
//             {navigationItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
//                   isActive(item.href)
//                     ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium'
//                     : 'text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 <item.icon className={`w-5 h-5 ${isActive(item.href) ? item.color : ''}`} />
//                 <span className="text-sm">{item.label}</span>
//                 {item.badge > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
//                     {item.badge > 9 ? '9+' : item.badge}
//                   </span>
//                 )}
//               </Link>
//             ))}
//           </nav>

//           {/* Actions */}
//           <div className="flex items-center gap-2">
//             {/* Recherche */}
//             <button
//               onClick={() => {
//                 setIsSearchOpen(true);
//                 setTimeout(() => searchInputRef.current?.focus(), 100);
//               }}
//               className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-sm text-slate-500"
//             >
//               <Search className="w-4 h-4" />
//               <span className="hidden lg:inline">Rechercher...</span>
//               <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-xs">
//                 <Command className="w-3 h-3" />K
//               </kbd>
//             </button>

//             {/* Recherche mobile */}
//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="sm:hidden p-2 hover:bg-slate-100 rounded-lg"
//             >
//               <Search className="w-5 h-5" />
//             </button>

//             {/* Notifications */}
//             <NotificationsDropdown />
//             {/* <div className="relative" ref={notificationRef}>
//               <button 
//                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                 className="relative rounded-lg border border-slate-200 bg-slate-50 p-2 hover:bg-slate-100 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-slate-600" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center font-semibold">
//                     {unreadCount > 9 ? '9+' : unreadCount}
//                   </span>
//                 )}
//               </button>

//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-slate-200 z-30 max-h-[500px] flex flex-col">
//                   <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
//                     <h3 className="font-semibold text-slate-800">Notifications</h3>
//                     <div className="flex items-center gap-2">
//                       {unreadCount > 0 && (
//                         <button
//                           onClick={markAllAsRead}
//                           className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
//                         >
//                           Tout marquer
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setIsNotificationOpen(false)}
//                         className="p-1 hover:bg-slate-100 rounded-lg"
//                       >
//                         <X className="w-4 h-4 text-slate-500" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="overflow-y-auto flex-1">
//                     {notifications.length === 0 ? (
//                       <div className="text-center py-12 text-slate-500">
//                         <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
//                         <p className="text-sm">Aucune notification</p>
//                       </div>
//                     ) : (
//                       <div className="divide-y divide-slate-100">
//                         {notifications.map((notif) => (
//                           <div
//                             key={notif.id}
//                             onClick={() => handleNotificationClick(notif)}
//                             className={`px-4 py-3 cursor-pointer transition-colors ${
//                               notif.read ? 'hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50'
//                             }`}
//                           >
//                             <div className="flex items-start gap-3">
//                               <div className={`w-2 h-2 rounded-full mt-2 ${
//                                 notif.read ? 'bg-slate-300' : 'bg-indigo-500'
//                               }`}></div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-start justify-between gap-2">
//                                   <h4 className={`text-sm ${
//                                     notif.read ? 'text-slate-700' : 'text-slate-900 font-semibold'
//                                   }`}>
//                                     {notif.title}
//                                   </h4>
//                                   <span className="text-xs text-slate-400 whitespace-nowrap">
//                                     {formatTime(notif.createdAt)}
//                                   </span>
//                                 </div>
//                                 <p className="text-sm text-slate-600 mt-1">
//                                   {notif.content}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div> */}

//             {/* User Dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors"
//               >
//                 <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold text-sm`}>
//                   {getAvatarLetters()}
//                 </div>
//                 <div className="text-sm hidden lg:block">
//                   <div className="font-semibold truncate max-w-[180px]">
//                     {getUserDisplayName()}
//                   </div>
//                   <div className="text-xs text-slate-500">
//                     {getUserSubtitle()}
//                   </div>
//                 </div>
//                 <ChevronDown 
//                   className={`w-4 h-4 text-slate-500 transition-transform hidden sm:block ${
//                     isDropdownOpen ? 'rotate-180' : ''
//                   }`} 
//                 />
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
//                   <div className="px-4 py-3 border-b border-slate-100">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold`}>
//                         {getAvatarLetters()}
//                       </div>
//                       <div>
//                         <div className="font-semibold text-slate-800">
//                           {getUserDisplayName()}
//                         </div>
//                         <div className="text-sm text-slate-500">
//                           {getUserSubtitle()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {userType === "ETABLISSEMENT" && (
//                     <div className="px-2 py-1">
//                       <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
//                         <User className="w-4 h-4" />
//                         Voir tous les profils
//                       </button>
//                     </div>
//                   )}

//                   <div className="border-t border-slate-100 mt-1 pt-1">
//                     <div className="px-2 py-1">
//                       <Link 
//                         href="/dashboard/edit"
//                         onClick={() => setIsDropdownOpen(false)}
//                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
//                       >
//                         <Settings className="w-4 h-4" />
//                         Modification de profil
//                       </Link>
//                     </div>

//                     <div className="px-2 py-1">
//                       <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
//                         <HelpCircle className="w-4 h-4" />
//                         Aide et assistance
//                       </button>
//                     </div>
//                   </div>

//                   <div className="border-t border-slate-100 mt-1 pt-1">
//                     <div className="px-2 py-1">
//                       <button 
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         Se déconnecter
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Menu Mobile */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
//           <div 
//             className="bg-white w-[280px] h-full shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-4 border-b border-slate-200 flex items-center justify-between">
//               <h2 className="font-semibold text-lg">Navigation</h2>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-slate-100 rounded-lg"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <nav className="p-4 space-y-2">
//               {navigationItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                     isActive(item.href)
//                       ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium'
//                       : 'text-slate-600 hover:bg-slate-50'
//                   }`}
//                 >
//                   <item.icon className={`w-5 h-5 ${isActive(item.href) ? item.color : ''}`} />
//                   <span>{item.label}</span>
//                   {item.badge > 0 && (
//                     <span className="ml-auto min-w-[24px] h-6 px-2 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center justify-center">
//                       {item.badge > 9 ? '9+' : item.badge}
//                     </span>
//                   )}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//         </div>
//       )}

//       {/* Modal de recherche */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-20" onClick={() => setIsSearchOpen(false)}>
//           <div 
//             ref={searchRef}
//             className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-4 border-b border-slate-200 flex items-center gap-3">
//               <Search className="w-5 h-5 text-slate-400" />
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Rechercher des utilisateurs, projets, messages..."
//                 className="flex-1 outline-none text-slate-800 placeholder:text-slate-400"
//               />
//               <kbd className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500">ESC</kbd>
//             </div>

//             <div className="max-h-[400px] overflow-y-auto">
//               {searchQuery && searchResults.length === 0 ? (
//                 <div className="p-8 text-center text-slate-500">
//                   <p>Aucun résultat trouvé</p>
//                 </div>
//               ) : searchResults.length > 0 ? (
//                 <div className="divide-y divide-slate-100">
//                   {searchResults.map((result) => (
//                     <Link
//                       key={result.id}
//                       href={result.url}
//                       onClick={() => {
//                         setIsSearchOpen(false);
//                         setSearchQuery("");
//                       }}
//                       className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
//                     >
//                       <div className={`w-10 h-10 rounded-lg ${result.colorClass || 'bg-slate-200'} text-white grid place-items-center font-semibold`}>
//                         {result.avatar || result.name?.slice(0, 2).toUpperCase()}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="font-medium text-slate-800 truncate">{result.name}</div>
//                         <div className="text-sm text-slate-500 truncate">{result.description}</div>
//                       </div>
//                       <div className="text-xs text-slate-400">{result.type}</div>
//                     </Link>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-slate-500">
//                   <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
//                   <p className="text-sm">Commencez à taper pour rechercher</p>
//                   <div className="mt-4 space-y-2 text-xs">
//                     <p className="text-slate-400">Raccourcis clavier :</p>
//                     <div className="flex items-center justify-center gap-4">
//                       <div className="flex items-center gap-2">
//                         <kbd className="px-2 py-1 bg-slate-100 rounded">⌘M</kbd>
//                         <span>Messages</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <kbd className="px-2 py-1 bg-slate-100 rounded">⌘U</kbd>
//                         <span>Amis</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <kbd className="px-2 py-1 bg-slate-100 rounded">⌘P</kbd>
//                         <span>Projets</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default HeaderWithDropdown;
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, User, Settings, HelpCircle, LogOut, Bell, X,
  MessageCircle, Users, FolderKanban, Gift, Inbox, Search, Menu, Command, Home
} from "lucide-react";
import { useSocket } from "@/app/contexts/SocketContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationsDropdown from "./Notifications";
// import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
// import LanguageSwitcher from "./LangageSwitcher";

const HeaderWithDropdown = ({ user, userType = "etablissement" }) => {
  const { t } = useTranslation('common');
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
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // 🔍 DEBUG : Afficher les props reçues
  useEffect(() => {
    console.log('🔍 Header Props:', {
      user,
      userType,
      userName: user?.fullName || user?.nom || user?.name,
      etablissement: user?.etablissement
    });
  }, [user, userType]);

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
      // Cmd/Ctrl + K pour ouvrir la recherche
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      
      // ESC pour fermer la recherche
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery("");
      }

      // Cmd/Ctrl + H pour aller à l'accueil
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/dashboard/acceuil');
      }

      // Cmd/Ctrl + M pour aller aux messages
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        router.push('/dashboard/messages');
      }

      // Cmd/Ctrl + U pour aller aux amis (Users)
      if ((e.metaKey || e.ctrlKey) && e.key === 'u') {
        e.preventDefault();
        router.push('/dashboard/friends');
      }

      // Cmd/Ctrl + P pour aller aux projets
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        router.push('/dashboard/projects');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Demander la permission pour les notifications
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

  const getAvatarColors = () => {
    switch (userType) {
      case "DONATEUR":
        return "from-emerald-500 to-teal-500";
      case "ENSEIGNANT":
        return "from-indigo-500 to-purple-600";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  const getAvatarLetters = () => {
    if (userType === "ETABLISSEMENT" && user?.etablissement?.nom) {
      return user.etablissement.nom.slice(0, 2).toUpperCase();
    }
    // Essayer différentes propriétés de nom
    const name = user?.fullName || user?.nom || user?.name || user?.email;
    return name?.slice(0, 2).toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (userType === "ETABLISSEMENT" && user?.etablissement?.nom) {
      return user.etablissement.nom;
    }
    // Essayer différentes propriétés de nom
    return user?.fullName || user?.nom || user?.name || "Utilisateur";
  };

  const getUserSubtitle = () => {
    if (userType === "ETABLISSEMENT" && user?.etablissement?.type) {
      return user.etablissement.type;
    }
    // Formater le type pour l'affichage
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
    const confirmLogout = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?'
    );

    if (!confirmLogout) return;

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Erreur lors de la déconnexion. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert('Erreur de connexion.');
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

    // Vérifier le type exact (insensible à la casse)
    const type = (userType || "").toUpperCase();

    if (type === "DONATEUR") {
      return [
        ...baseItems,
        {
          icon: FolderKanban,
          label: "Projets",
          href: "/projects",
          badge: 0,
          color: "text-orange-600",
          shortcut: "⌘P"
        },
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
        {
          icon: FolderKanban,
          label: "Projets",
          href: "/projects",
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
    } else {
      // Fallback par défaut
      return [
        ...baseItems,
        {
          icon: FolderKanban,
          label: "Projets",
          href: "/projects",
          badge: 0,
          color: "text-orange-600",
          shortcut: "⌘P"
        }
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
            {/* <LanguageSwitcher /> */}
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

            {/* Recherche mobile */}
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
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${getAvatarColors()} text-white grid place-items-center font-semibold text-sm`}>
                  {getAvatarLetters()}
                </div>
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
                      
                      <div className={`w-10 h-10 rounded-lg ${result.colorClass || 'bg-slate-200'} text-white grid place-items-center font-semibold`}>
                        {result.avatar || result.name?.slice(0, 2).toUpperCase()}
                      </div>
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
    </>
  );
};

export default HeaderWithDropdown;