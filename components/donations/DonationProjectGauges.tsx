// import { useState, useEffect } from 'react';
// import { Target, DollarSign, Package, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';

// const DonationProjectGauges = ({ donation, onRefresh }) => {
//   const [projectDetails, setProjectDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (donation?.projectId) {
//       loadProjectDetails();
//     }
//   }, [donation?.projectId, donation?.statut]); // ⭐ Recharger si le statut change

//   const loadProjectDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/projects/${donation.projectId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setProjectDetails(data.project);
//       }
//     } catch (error) {
//       console.error('Erreur chargement projet:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!donation?.project && !donation?.projectId) {
//     return null; // Pas de projet lié
//   }

//   if (loading) {
//     return (
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
//         <div className="animate-pulse space-y-3">
//           <div className="h-4 bg-blue-200 rounded w-1/3"></div>
//           <div className="h-2 bg-blue-200 rounded"></div>
//           <div className="h-2 bg-blue-200 rounded w-2/3"></div>
//         </div>
//       </div>
//     );
//   }

//   const project = projectDetails || donation.project;
//   if (!project) return null;

//   const formatAmount = (amount) => {
//     return new Intl.NumberFormat('fr-MG').format(amount || 0);
//   };

//   const getProgressColor = (percentage) => {
//     if (percentage >= 100) return 'bg-green-500';
//     if (percentage >= 75) return 'bg-blue-500';
//     if (percentage >= 50) return 'bg-yellow-500';
//     return 'bg-orange-500';
//   };

//   const getNeedIcon = (type) => {
//     switch (type) {
//       case 'MONETAIRE': return DollarSign;
//       case 'MATERIEL': return Package;
//       case 'VIVRES': return Package;
//       default: return Package;
//     }
//   };

//   const getNeedColor = (type) => {
//     switch (type) {
//       case 'MONETAIRE': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
//       case 'MATERIEL': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
//       case 'VIVRES': return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' };
//       default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };
//     }
//   };

//   // Trouver le besoin lié au don si disponible
//   const linkedNeed = project.besoins?.find(b => b.id === donation.needId);

//   return (
//     <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-2">
//           <Target className="w-5 h-5 text-blue-600" />
//           <h4 className="font-semibold text-blue-900">
//             Impact sur le projet "{project.titre}"
//           </h4>
//         </div>
//         {onRefresh && (
//           <button
//             onClick={() => {
//               loadProjectDetails();
//               onRefresh?.();
//             }}
//             className="p-1 hover:bg-blue-100 rounded transition-colors"
//             title="Actualiser"
//           >
//             <RefreshCw className="w-4 h-4 text-blue-600" />
//           </button>
//         )}
//       </div>

//       {/* Si le don est lié à un besoin spécifique */}
//       {linkedNeed ? (
//         <div className={`p-3 rounded-lg border ${getNeedColor(linkedNeed.type).border} ${getNeedColor(linkedNeed.type).bg}`}>
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               {(() => {
//                 const Icon = getNeedIcon(linkedNeed.type);
//                 return <Icon className="w-4 h-4" />;
//               })()}
//               <span className="font-medium text-slate-800 text-sm">
//                 {linkedNeed.titre}
//               </span>
//             </div>
//             <span className={`text-lg font-bold ${getNeedColor(linkedNeed.type).text}`}>
//               {linkedNeed.pourcentage?.toFixed(0) || 0}%
//             </span>
//           </div>

//           {/* Barre de progression */}
//           <div className="h-2 bg-white rounded-full overflow-hidden border mb-2">
//             <div
//               className={`h-full ${getProgressColor(linkedNeed.pourcentage || 0)} transition-all duration-500`}
//               style={{ width: `${Math.min(linkedNeed.pourcentage || 0, 100)}%` }}
//             />
//           </div>

//           {/* Stats */}
//           <div className="flex items-center justify-between text-xs">
//             {linkedNeed.type === 'MONETAIRE' ? (
//               <>
//                 <span className="text-green-600 font-semibold">
//                   {formatAmount(linkedNeed.montantRecu)} Ar
//                 </span>
//                 <span className="text-slate-500">
//                   sur {formatAmount(linkedNeed.montantCible)} Ar
//                 </span>
//               </>
//             ) : (
//               <>
//                 <span className="text-blue-600 font-semibold">
//                   {linkedNeed.quantiteRecue || 0} {linkedNeed.unite}
//                 </span>
//                 <span className="text-slate-500">
//                   sur {linkedNeed.quantiteCible} {linkedNeed.unite}
//                 </span>
//               </>
//             )}
//           </div>

//           {linkedNeed.statut === 'TERMINE' && (
//             <div className="mt-2 flex items-center gap-1 text-xs text-green-700 font-medium">
//               <CheckCircle2 className="w-3 h-3" />
//               Besoin complété !
//             </div>
//           )}
//         </div>
//       ) : (
//         /* Afficher tous les besoins du projet */
//         project.besoins && project.besoins.length > 0 && (
//           <div className="space-y-2">
//             <div className="text-xs text-slate-600 mb-2">
//               {project.besoins.filter(b => b.statut === 'TERMINE').length} sur {project.besoins.length} besoins complétés
//             </div>
//             {project.besoins.slice(0, 3).map((need) => {
//               const colors = getNeedColor(need.type);
//               const Icon = getNeedIcon(need.type);
//               const percentage = need.pourcentage || 0;

//               return (
//                 <div key={need.id} className={`p-2 rounded-lg border ${colors.border} ${colors.bg}`}>
//                   <div className="flex items-center justify-between mb-1">
//                     <div className="flex items-center gap-1">
//                       <Icon className="w-3 h-3" />
//                       <span className="text-xs font-medium text-slate-700">{need.titre}</span>
//                     </div>
//                     <span className={`text-sm font-bold ${colors.text}`}>
//                       {percentage.toFixed(0)}%
//                     </span>
//                   </div>
//                   <div className="h-1.5 bg-white rounded-full overflow-hidden">
//                     <div
//                       className={`h-full ${getProgressColor(percentage)} transition-all`}
//                       style={{ width: `${Math.min(percentage, 100)}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//             {project.besoins.length > 3 && (
//               <div className="text-xs text-slate-500 text-center pt-1">
//                 +{project.besoins.length - 3} autres besoins
//               </div>
//             )}
//           </div>
//         )
//       )}

//       {/* Progression globale */}
//       <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
//         <div className="flex items-center gap-1 text-xs text-slate-600">
//           <TrendingUp className="w-3 h-3" />
//           Progression globale
//         </div>
//         <span className="text-sm font-bold text-blue-600">
//           {project.besoins && project.besoins.length > 0
//             ? (project.besoins.reduce((sum, n) => sum + (n.pourcentage || 0), 0) / project.besoins.length).toFixed(0)
//             : 0}%
//         </span>
//       </div>
//     </div>
//   );
// };

// export default DonationProjectGauges;
import { useState, useEffect } from 'react';
import { Target, DollarSign, Package, CheckCircle2, TrendingUp, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react';

const DonationProjectGauges = ({ donation, onRefresh }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (donation?.projectId) {
      loadProjectDetails();
    }
  }, [donation?.projectId, donation?.statut]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${donation.projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProjectDetails(data.project);
      }
    } catch (error) {
      console.error('Erreur chargement projet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!donation?.project && !donation?.projectId) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-blue-200 rounded w-1/3"></div>
          <div className="h-2 bg-blue-200 rounded"></div>
          <div className="h-2 bg-blue-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const project = projectDetails || donation.project;
  if (!project) return null;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-MG').format(amount || 0);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getNeedIcon = (type) => {
    switch (type) {
      case 'MONETAIRE': return DollarSign;
      case 'MATERIEL': return Package;
      case 'VIVRES': return ShoppingCart;
      default: return Package;
    }
  };

  const getNeedColor = (type) => {
    switch (type) {
      case 'MONETAIRE': return { 
        bg: 'bg-green-50', 
        border: 'border-green-200', 
        text: 'text-green-700',
        progressBg: 'bg-green-500' 
      };
      case 'MATERIEL': return { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        text: 'text-blue-700',
        progressBg: 'bg-blue-500' 
      };
      case 'VIVRES': return { 
        bg: 'bg-orange-50', 
        border: 'border-orange-200', 
        text: 'text-orange-700',
        progressBg: 'bg-orange-500' 
      };
      default: return { 
        bg: 'bg-slate-50', 
        border: 'border-slate-200', 
        text: 'text-slate-700',
        progressBg: 'bg-slate-500' 
      };
    }
  };

  const linkedNeed = project.besoins?.find(b => b.id === donation.needId);
  const progressionGlobale = project.progressionGlobale || 0;

  // Calculer les statistiques globales
  const totalNeeds = project.besoins?.length || 0;
  const completedNeeds = project.besoins?.filter(b => b.statut === 'TERMINE').length || 0;
  const activeNeeds = project.besoins?.filter(b => b.statut === 'EN_COURS').length || 0;

  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
      {/* Header avec titre et refresh */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">
            Impact sur "{project.titre}"
          </h4>
        </div>
        {onRefresh && (
          <button
            onClick={() => {
              loadProjectDetails();
              onRefresh?.();
            }}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </button>
        )}
      </div>

      {/* ✅ NOUVELLE SECTION: Progression Globale */}
      <div className="mb-5 p-4 bg-white rounded-xl border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800">Progression Globale du Projet</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {progressionGlobale.toFixed(0)}%
            </div>
            <div className="text-xs text-slate-500">
              {completedNeeds}/{totalNeeds} besoins terminés
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300">
          <div
            className={`h-full ${getProgressColor(progressionGlobale)} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(progressionGlobale, 100)}%` }}
          >
            <div className="h-full w-full opacity-30 animate-pulse bg-white"></div>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-slate-600">{completedNeeds} terminé{completedNeeds > 1 ? 's' : ''}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-slate-600">{activeNeeds} en cours</span>
            </span>
          </div>
          <span className="text-slate-500">
            {progressionGlobale >= 100 ? '🎉 Projet complété !' : `${(100 - progressionGlobale).toFixed(0)}% restant`}
          </span>
        </div>
      </div>

      {/* Besoin spécifique lié au don */}
      {linkedNeed ? (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">Votre contribution cible ce besoin:</span>
          </div>
          
          <div className={`p-4 rounded-xl border-2 ${getNeedColor(linkedNeed.type).border} ${getNeedColor(linkedNeed.type).bg}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getNeedIcon(linkedNeed.type);
                  return <Icon className="w-5 h-5" />;
                })()}
                <span className="font-bold text-slate-800">
                  {linkedNeed.titre}
                </span>
              </div>
              <span className={`text-2xl font-bold ${getNeedColor(linkedNeed.type).text}`}>
                {linkedNeed.pourcentage?.toFixed(0) || 0}%
              </span>
            </div>

            {/* Barre de progression du besoin */}
            <div className="h-3 bg-white rounded-full overflow-hidden border-2 border-white/50 mb-3">
              <div
                className={`h-full ${getNeedColor(linkedNeed.type).progressBg} transition-all duration-500`}
                style={{ width: `${Math.min(linkedNeed.pourcentage || 0, 100)}%` }}
              />
            </div>

            {/* Stats du besoin */}
            <div className="flex items-center justify-between text-sm">
              {linkedNeed.type === 'MONETAIRE' ? (
                <>
                  <div>
                    <div className="text-green-700 font-bold">
                      {formatAmount(linkedNeed.montantRecu)} Ar
                    </div>
                    <div className="text-xs text-slate-600">Collecté</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-700 font-semibold">
                      {formatAmount(linkedNeed.montantCible)} Ar
                    </div>
                    <div className="text-xs text-slate-600">Objectif</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-blue-700 font-bold">
                      {linkedNeed.quantiteRecue || 0} {linkedNeed.unite}
                    </div>
                    <div className="text-xs text-slate-600">Reçu</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-700 font-semibold">
                      {linkedNeed.quantiteCible} {linkedNeed.unite}
                    </div>
                    <div className="text-xs text-slate-600">Objectif</div>
                  </div>
                </>
              )}
            </div>

            {/* ✅ Budget disponible pour besoin monétaire */}
            {linkedNeed.type === 'MONETAIRE' && linkedNeed.budgetInclusDansCalcul && project.budgetDisponible > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Budget établissement:</span>
                  <span className="font-bold text-green-600">
                    {formatAmount(project.budgetDisponible)} Ar
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-600">Dons reçus:</span>
                  <span className="font-bold text-blue-600">
                    {formatAmount(linkedNeed.montantRecu)} Ar
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-green-200">
                  <span className="font-semibold text-slate-700">Budget total:</span>
                  <span className="font-bold text-green-700">
                    {formatAmount(project.budgetDisponible + linkedNeed.montantRecu)} Ar
                  </span>
                </div>
              </div>
            )}

            {linkedNeed.statut === 'TERMINE' && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium bg-green-100 rounded-lg p-2">
                <CheckCircle2 className="w-4 h-4" />
                Besoin complété !
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Afficher tous les besoins si pas de besoin spécifique */
        project.besoins && project.besoins.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-3">
              Tous les besoins du projet:
            </div>
            <div className="space-y-2">
              {project.besoins.slice(0, 4).map((need) => {
                const colors = getNeedColor(need.type);
                const Icon = getNeedIcon(need.type);
                const percentage = need.pourcentage || 0;

                return (
                  <div key={need.id} className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 truncate">{need.titre}</span>
                      </div>
                      <span className={`text-base font-bold ${colors.text} ml-2`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden border">
                      <div
                        className={`h-full ${colors.progressBg} transition-all`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    {/* Budget info pour besoin monétaire principal */}
                    {need.type === 'MONETAIRE' && need.budgetInclusDansCalcul && project.budgetDisponible > 0 && (
                      <div className="mt-2 pt-2 border-t border-green-200 text-xs text-slate-600">
                        Budget initial: {formatAmount(project.budgetDisponible)} Ar inclus
                      </div>
                    )}
                  </div>
                );
              })}
              
              {project.besoins.length > 4 && (
                <div className="text-xs text-slate-500 text-center pt-1">
                  +{project.besoins.length - 4} autres besoins
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Message si projet complété */}
      {progressionGlobale >= 100 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-green-800">Projet complété !</p>
            <p className="text-green-700 text-xs">Tous les besoins ont été satisfaits grâce aux dons.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationProjectGauges;