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

//   // Fonction de déconnexion
//   const handleLogout = async () => {
//     try {
//       const response = await fetch('/api/auth/logout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         // Rediriger vers la page de connexion
//         window.location.href = '/login';
//       } else {
//         console.error('Erreur lors de la déconnexion');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la déconnexion:', error);
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
import { ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";

const HeaderWithDropdown = ({ user, userType = "etablissement" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Couleurs selon le type d'utilisateur
  const getAvatarColors = () => {
    switch (userType) {
      case "donateur":
        return "from-emerald-500 to-teal-500";
      case "enseignant":
        return "from-indigo-500 to-purple-600";
      default: // etablissement
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

  // Fonction de déconnexion avec confirmation
  const handleLogout = async () => {
    // Confirmation avant déconnexion
    const confirmLogout = window.confirm(
      'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre tableau de bord.'
    );

    if (!confirmLogout) {
      return; // Annuler la déconnexion
    }

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Rediriger vers la page d'accueil (localhost:3000/)
        window.location.href = '/';
      } else {
        console.error('Erreur lors de la déconnexion');
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
          {/* Notifications */}
          <button className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors">
            🔔 
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 grid place-items-center">
              3
            </span>
          </button>

          {/* Dropdown Menu */}
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

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
                {/* Profil utilisateur */}
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

                {/* Voir tous les profils (pour les établissements qui ont plusieurs utilisateurs) */}
                {userType === "etablissement" && (
                  <div className="px-2 py-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      Voir tous les profils
                    </button>
                  </div>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  {/* Modification de profil */}
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

                  {/* Aide et assistance */}
                  <div className="px-2 py-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      Aide et assistance
                    </button>
                  </div>
                </div>

                {/* Séparateur */}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  {/* Déconnexion */}
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