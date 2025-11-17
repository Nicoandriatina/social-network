// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   X, Upload, Plus, AlertCircle, Heart, Building2, GraduationCap, 
//   FileText, Trash2, Search, ChevronDown, ChevronUp, MessageSquare,
//   DollarSign, Package, ShoppingCart, Target, Check, ArrowRight, ArrowLeft
// } from 'lucide-react';

// // Composant Avatar simplifié
// const AvatarDisplay = ({ name, avatar, size = "md" }) => {
//   const sizeClasses = {
//     sm: "w-8 h-8 text-xs",
//     md: "w-10 h-10 text-sm",
//     lg: "w-12 h-12 text-base"
//   };

//   if (avatar) {
//     return (
//       <img 
//         src={avatar} 
//         alt={name}
//         className={`${sizeClasses[size]} rounded-full object-cover`}
//       />
//     );
//   }

//   return (
//     <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold`}>
//       {name?.slice(0, 2).toUpperCase() || '??'}
//     </div>
//   );
// };

// const DonationModal = ({ isOpen, onClose, onSuccess, preselectedBeneficiary = null }) => {
//   // État principal
//   const [currentStep, setCurrentStep] = useState(preselectedBeneficiary ? 2 : 1);
//   const [formData, setFormData] = useState({
//     type: 'MONETAIRE',
//     montant: '',
//     items: [],
//     destinationType: 'project',
//     destinationId: preselectedBeneficiary?.id || '',
//     needId: '',
//     photos: [],
//     raison: ''
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [destinations, setDestinations] = useState(preselectedBeneficiary ? [preselectedBeneficiary] : []);
//   const [loadingDestinations, setLoadingDestinations] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [projectNeeds, setProjectNeeds] = useState([]);
//   const [showNeedsSelection, setShowNeedsSelection] = useState(false);
  
//   const fileInputRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const [currentItem, setCurrentItem] = useState({ name: '', quantity: '' });

//   // Définition des étapes
//   const steps = [
//     { id: 1, title: 'Bénéficiaire', icon: Target, desc: 'Qui souhaitez-vous aider ?' },
//     { id: 2, title: 'Type de don', icon: Package, desc: 'Que voulez-vous donner ?' },
//     { id: 3, title: 'Détails', icon: MessageSquare, desc: 'Informations complémentaires' },
//     { id: 4, title: 'Confirmation', icon: Check, desc: 'Vérifiez votre don' }
//   ];

//   // Effets
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       if (!preselectedBeneficiary) {
//         loadDestinations();
//       }
//     }
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, [isOpen, formData.destinationType]);

//   useEffect(() => {
//     if (formData.destinationType === 'project' && formData.destinationId) {
//       const selectedProject = destinations.find(d => d.id === formData.destinationId);
//       if (selectedProject?.besoins?.length > 0) {
//         setProjectNeeds(selectedProject.besoins);
//         setShowNeedsSelection(true);
//       } else {
//         setProjectNeeds([]);
//         setShowNeedsSelection(false);
//         setFormData(prev => ({ ...prev, needId: '' }));
//       }
//     } else {
//       setProjectNeeds([]);
//       setShowNeedsSelection(false);
//       setFormData(prev => ({ ...prev, needId: '' }));
//     }
//   }, [formData.destinationType, formData.destinationId, destinations]);

//   useEffect(() => {
//     if (formData.needId && projectNeeds.length > 0) {
//       const selectedNeed = projectNeeds.find(n => n.id === formData.needId);
//       if (selectedNeed) {
//         const needTypeMap = {
//           'MONETAIRE': 'MONETAIRE',
//           'MATERIEL': 'NON_VIVRES',
//           'VIVRES': 'VIVRES'
//         };
//         const requiredType = needTypeMap[selectedNeed.type];
//         if (requiredType !== formData.type) {
//           setFormData(prev => ({
//             ...prev,
//             type: requiredType,
//             montant: '',
//             items: []
//           }));
//         }
//       }
//     }
//   }, [formData.needId, projectNeeds]);

//   // Fonctions utilitaires
//   const loadDestinations = async () => {
//     setLoadingDestinations(true);
//     try {
//       const response = await fetch('/api/donations/destinations');
//       if (response.ok) {
//         const data = await response.json();
//         let destinationList = [];
//         if (formData.destinationType === 'project') {
//           destinationList = data.projects || [];
//         } else if (formData.destinationType === 'etablissement') {
//           destinationList = data.etablissements || [];
//         } else if (formData.destinationType === 'personnel') {
//           destinationList = data.personnels || [];
//         }
//         setDestinations(destinationList);
//       }
//     } catch (error) {
//       console.error('Erreur chargement destinations:', error);
//     } finally {
//       setLoadingDestinations(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     if (field === 'destinationType') {
//       setFormData(prev => ({ ...prev, destinationId: '', needId: '' }));
//       setSearchTerm('');
//       setProjectNeeds([]);
//       setShowNeedsSelection(false);
//       loadDestinations();
//     }

//     if (field === 'destinationId') {
//       setFormData(prev => ({ ...prev, needId: '' }));
//     }

//     if (field === 'type') {
//       setFormData(prev => ({ ...prev, items: [], montant: '' }));
//       setCurrentItem({ name: '', quantity: '' });
//     }
    
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const addItem = () => {
//     if (!currentItem.name.trim() || !currentItem.quantity || parseInt(currentItem.quantity) <= 0) {
//       setErrors(prev => ({ ...prev, items: 'Veuillez remplir le nom et la quantité' }));
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       items: [...prev.items, { 
//         name: currentItem.name.trim(), 
//         quantity: parseInt(currentItem.quantity) 
//       }]
//     }));
    
//     setCurrentItem({ name: '', quantity: '' });
//     setErrors(prev => ({ ...prev, items: null }));
//   };

//   const removeItem = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index)
//     }));
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files?.[0]) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const handleFiles = async (files) => {
//     const validFiles = Array.from(files).filter(file => {
//       const isImage = file.type.startsWith('image/');
//       const isValidSize = file.size <= 5 * 1024 * 1024;
//       return isImage && isValidSize;
//     });

//     const photoPromises = validFiles.map(async (file) => ({
//       id: Date.now() + Math.random(),
//       file,
//       url: URL.createObjectURL(file),
//       name: file.name,
//       base64: await fileToBase64(file)
//     }));

//     const newPhotos = await Promise.all(photoPromises);
//     setFormData(prev => ({
//       ...prev,
//       photos: [...prev.photos, ...newPhotos].slice(0, 5)
//     }));
//   };

//   const removePhoto = (photoId) => {
//     setFormData(prev => ({
//       ...prev,
//       photos: prev.photos.filter(photo => photo.id !== photoId)
//     }));
//   };

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!formData.destinationId) {
//         newErrors.destinationId = 'Veuillez sélectionner un bénéficiaire';
//       }
//     }

//     if (step === 2) {
//       if (formData.type === 'MONETAIRE') {
//         if (!formData.montant || parseFloat(formData.montant) <= 0) {
//           newErrors.montant = 'Le montant est obligatoire';
//         }
//       } else {
//         if (formData.items.length === 0) {
//           newErrors.items = 'Veuillez ajouter au moins un article';
//         }
//       }
//     }

//     return newErrors;
//   };

//   const nextStep = () => {
//     const validationErrors = validateStep(currentStep);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setErrors({});
//     setCurrentStep(prev => Math.min(prev + 1, 4));
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
    
//     try {
//       const donationData = {
//         type: formData.type,
//         montant: formData.type === 'MONETAIRE' ? parseFloat(formData.montant) : undefined,
//         items: formData.type !== 'MONETAIRE' ? formData.items : undefined,
//         photos: formData.photos.map(photo => photo.base64),
//         raison: formData.raison || undefined,
//         needId: formData.needId || undefined,
//         ...(formData.destinationType === 'project' && { projectId: formData.destinationId }),
//         ...(formData.destinationType === 'etablissement' && { etablissementId: formData.destinationId }),
//         ...(formData.destinationType === 'personnel' && { personnelId: formData.destinationId }),
//       };

//       const response = await fetch('/api/donations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(donationData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         if (result.details?.fieldErrors) {
//           setErrors(result.details.fieldErrors);
//         } else {
//           setErrors({ form: result.error || 'Erreur lors de la création du don' });
//         }
//         return;
//       }

//       onSuccess(result.donation);
//       onClose();
      
//       // Reset
//       setFormData({
//         type: 'MONETAIRE',
//         montant: '',
//         items: [],
//         destinationType: 'project',
//         destinationId: '',
//         needId: '',
//         photos: [],
//         raison: ''
//       });
//       setCurrentStep(preselectedBeneficiary ? 2 : 1);

//     } catch (error) {
//       console.error('Erreur:', error);
//       setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getDestinationTypeInfo = (type) => {
//     const typeMap = {
//       'project': {
//         icon: FileText,
//         label: 'Projet spécifique',
//         desc: 'Soutenez un projet précis',
//         placeholder: 'Rechercher un projet...'
//       },
//       'etablissement': {
//         icon: Building2,
//         label: 'Établissement',
//         desc: 'Don général à un établissement',
//         placeholder: 'Rechercher un établissement...'
//       },
//       'personnel': {
//         icon: GraduationCap,
//         label: 'Enseignant/Personnel',
//         desc: 'Don personnel à un éducateur',
//         placeholder: 'Rechercher un enseignant...'
//       }
//     };
//     return typeMap[type];
//   };

//   const getNeedIcon = (type) => {
//     const icons = {
//       'MONETAIRE': DollarSign,
//       'MATERIEL': Package,
//       'VIVRES': ShoppingCart
//     };
//     return icons[type] || Package;
//   };

//   const getNeedColor = (type) => {
//     const colors = {
//       'MONETAIRE': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
//       'MATERIEL': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
//       'VIVRES': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' }
//     };
//     return colors[type] || colors['MATERIEL'];
//   };

//   const formatNumber = (value) => {
//     if (!value) return '';
//     return new Intl.NumberFormat('fr-MG').format(parseInt(value));
//   };

//   const filteredDestinations = destinations.filter(dest => {
//     const searchLower = searchTerm.toLowerCase();
//     const name = (dest.nom || dest.fullName || dest.titre || '').toLowerCase();
//     const secondary = (dest.type || dest.niveau || dest.etablissementNom || '').toLowerCase();
//     return name.includes(searchLower) || secondary.includes(searchLower);
//   });

//   const displayedDestinations = filteredDestinations.slice(0, 10);
//   const selectedDestination = destinations.find(d => d.id === formData.destinationId);

//   if (!isOpen) return null;

//   // Rendu des étapes
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             {/* Type de destination */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">
//                 À qui souhaitez-vous faire ce don ? *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 {['project', 'etablissement', 'personnel'].map(type => {
//                   const typeInfo = getDestinationTypeInfo(type);
//                   const TypeIcon = typeInfo.icon;
//                   return (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() => handleInputChange('destinationType', type)}
//                       className={`p-4 border-2 rounded-xl text-left transition-all ${
//                         formData.destinationType === type
//                           ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
//                           : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3 mb-2">
//                         <TypeIcon className="w-5 h-5" />
//                         <span className="font-semibold text-sm">{typeInfo.label}</span>
//                       </div>
//                       <p className="text-xs text-slate-500">{typeInfo.desc}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Sélection du bénéficiaire */}
//             <div ref={dropdownRef}>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">
//                 Bénéficiaire * <span className="text-xs font-normal text-slate-500">(Tapez pour rechercher)</span>
//               </label>
              
//               {loadingDestinations ? (
//                 <div className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
//                   <span className="text-slate-600">Chargement...</span>
//                 </div>
//               ) : (
//                 <div className="relative">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => {
//                         setSearchTerm(e.target.value);
//                         setIsDropdownOpen(true);
//                       }}
//                       onFocus={() => setIsDropdownOpen(true)}
//                       placeholder={getDestinationTypeInfo(formData.destinationType).placeholder}
//                       className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
//                     />
//                     {isDropdownOpen ? (
//                       <ChevronUp 
//                         className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
//                         onClick={() => setIsDropdownOpen(false)}
//                       />
//                     ) : (
//                       <ChevronDown 
//                         className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
//                         onClick={() => setIsDropdownOpen(true)}
//                       />
//                     )}
//                   </div>

//                   {selectedDestination && !isDropdownOpen && (
//                     <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
//                       <AvatarDisplay
//                         name={selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
//                         avatar={selectedDestination.avatar}
//                         size="sm"
//                       />
//                       <div className="flex-1">
//                         <p className="font-semibold text-slate-800">
//                           {selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
//                         </p>
//                         <p className="text-sm text-slate-500">
//                           {selectedDestination.type || selectedDestination.niveau || selectedDestination.etablissementNom}
//                         </p>
//                         {selectedDestination.hasNeeds && (
//                           <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                             <Target className="w-3 h-3" />
//                             {selectedDestination.besoins?.length} besoin{selectedDestination.besoins?.length > 1 ? 's' : ''}
//                           </span>
//                         )}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData(prev => ({ ...prev, destinationId: '', needId: '' }));
//                           setSearchTerm('');
//                         }}
//                         className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}

//                   {isDropdownOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50">
//                       {displayedDestinations.length === 0 ? (
//                         <div className="p-6 text-center text-slate-500">
//                           {searchTerm ? 
//                             `Aucun résultat pour "${searchTerm}"` : 
//                             `Aucun ${getDestinationTypeInfo(formData.destinationType).label.toLowerCase()} disponible`
//                           }
//                         </div>
//                       ) : (
//                         <>
//                           {displayedDestinations.map(option => (
//                             <button
//                               key={option.id}
//                               type="button"
//                               onClick={() => {
//                                 handleInputChange('destinationId', option.id);
//                                 setIsDropdownOpen(false);
//                                 setSearchTerm('');
//                               }}
//                               className={`w-full p-3 text-left transition-all flex items-center gap-3 border-b border-slate-100 last:border-b-0 ${
//                                 formData.destinationId === option.id
//                                   ? 'bg-emerald-50'
//                                   : 'hover:bg-slate-50'
//                               }`}
//                             >
//                               <AvatarDisplay
//                                 name={option.nom || option.fullName || option.titre}
//                                 avatar={option.avatar}
//                                 size="sm"
//                               />
                              
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-semibold text-slate-800 truncate">
//                                   {option.nom || option.fullName || option.titre}
//                                 </p>
//                                 {(option.type || option.niveau || option.etablissementNom) && (
//                                   <p className="text-sm text-slate-500 truncate">
//                                     {option.type || option.niveau || option.etablissementNom}
//                                   </p>
//                                 )}
//                                 {option.hasNeeds && (
//                                   <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                                     <Target className="w-3 h-3" />
//                                     {option.besoins?.length} besoin{option.besoins?.length > 1 ? 's' : ''}
//                                   </span>
//                                 )}
//                               </div>

//                               {formData.destinationId === option.id && (
//                                 <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
//                                   <Check className="w-4 h-4 text-white" />
//                                 </div>
//                               )}
//                             </button>
//                           ))}
                          
//                           {filteredDestinations.length > 10 && (
//                             <div className="p-3 bg-slate-50 text-center text-sm text-slate-600">
//                               {filteredDestinations.length - 10} autre(s) résultat(s). 
//                               <span className="text-emerald-600 font-medium"> Affinez votre recherche.</span>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
              
//               {errors.destinationId && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.destinationId}
//                 </p>
//               )}
//             </div>

//             {/* Sélection du besoin (si applicable) */}
//             {showNeedsSelection && projectNeeds.length > 0 && (
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Target className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-semibold text-slate-800">
//                     Besoins du projet (optionnel)
//                   </h3>
//                 </div>
//                 <p className="text-sm text-slate-600 mb-4">
//                   Vous pouvez choisir de contribuer à un besoin spécifique ou faire un don général.
//                 </p>
                
//                 <div className="space-y-3">
//                   <button
//                     type="button"
//                     onClick={() => handleInputChange('needId', '')}
//                     className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
//                       !formData.needId
//                         ? 'border-emerald-500 bg-white shadow-md'
//                         : 'border-slate-200 hover:border-slate-300 bg-white/50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                         <Heart className="w-5 h-5 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-semibold text-slate-800">Don général au projet</p>
//                         <p className="text-xs text-slate-500">Soutenez le projet dans son ensemble</p>
//                       </div>
//                     </div>
//                   </button>

//                   {projectNeeds.map(need => {
//                     const NeedIcon = getNeedIcon(need.type);
//                     const colors = getNeedColor(need.type);
                    
//                     return (
//                       <button
//                         key={need.id}
//                         type="button"
//                         onClick={() => handleInputChange('needId', need.id)}
//                         className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
//                           formData.needId === need.id
//                             ? 'border-emerald-500 bg-white shadow-md'
//                             : 'border-slate-200 hover:border-slate-300 bg-white/50'
//                         }`}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center border-2 ${colors.border}`}>
//                             <NeedIcon className={`w-5 h-5 ${colors.text}`} />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-1">
//                               <p className="font-semibold text-slate-800 truncate">{need.titre}</p>
//                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
//                                 {need.type === 'MONETAIRE' ? 'Monétaire' : need.type === 'MATERIEL' ? 'Matériel' : 'Vivres'}
//                               </span>
//                             </div>
//                             {need.description && (
//                               <p className="text-xs text-slate-600 mb-2">{need.description}</p>
//                             )}
                            
//                             <div className="space-y-1">
//                               <div className="flex items-center justify-between text-xs">
//                                 <span className="text-slate-600">Progression</span>
//                                 <span className={`font-bold ${colors.text}`}>{need.pourcentage?.toFixed(0)}%</span>
//                               </div>
//                               <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
//                                 <div
//                                   className={`h-full transition-all ${colors.text.replace('text-', 'bg-')}`}
//                                   style={{ width: `${Math.min(need.pourcentage || 0, 100)}%` }}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             {/* Type de don */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">
//                 Type de don *
//                 {formData.needId && projectNeeds.length > 0 && (
//                   <span className="ml-2 text-xs font-normal text-blue-600">
//                     (Déterminé par le besoin sélectionné)
//                   </span>
//                 )}
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {[
//                   { value: 'MONETAIRE', label: 'Monétaire', icon: '💰', desc: 'Don en argent' },
//                   { value: 'VIVRES', label: 'Vivres', icon: '🍎', desc: 'Nourriture' },
//                   { value: 'NON_VIVRES', label: 'Matériel', icon: '📚', desc: 'Équipements' }
//                 ].map(type => (
//                   <button
//                     key={type.value}
//                     type="button"
//                     onClick={() => !formData.needId && handleInputChange('type', type.value)}
//                     disabled={!!formData.needId}
//                     className={`p-4 border-2 rounded-xl text-center transition-all ${
//                       formData.type === type.value
//                         ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
//                         : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
//                     } ${formData.needId ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     <div className="text-3xl mb-2">{type.icon}</div>
//                     <div className="text-sm font-semibold">{type.label}</div>
//                     <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Montant (si monétaire) */}
//             {formData.type === 'MONETAIRE' && (
//               <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
//                 <label className="block text-sm font-semibold text-slate-700 mb-3">
//                   💰 Montant en Ariary *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     value={formData.montant}
//                     onChange={(e) => handleInputChange('montant', e.target.value)}
//                     placeholder="Exemple: 500000"
//                     className={`w-full px-4 py-4 pr-16 border-2 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
//                       errors.montant ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500 bg-white'
//                     }`}
//                   />
//                   <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-lg">
//                     Ar
//                   </span>
//                 </div>
//                 {formData.montant && (
//                   <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
//                     <p className="text-sm text-slate-600">
//                       Montant: <span className="font-bold text-green-600 text-lg">{formatNumber(formData.montant)} Ariary</span>
//                     </p>
//                   </div>
//                 )}
//                 {errors.montant && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.montant}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Articles (si vivres ou non-vivres) */}
//             {(formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') && (
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
//                 <label className="block text-sm font-semibold text-slate-700 mb-3">
//                   📦 Articles à donner *
//                 </label>
                
//                 {formData.items.length > 0 && (
//                   <div className="mb-4 space-y-2">
//                     <p className="text-sm text-slate-600 font-medium">Articles ajoutés ({formData.items.length}):</p>
//                     {formData.items.map((item, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                             <span className="text-lg">{formData.type === 'VIVRES' ? '🍎' : '📚'}</span>
//                           </div>
//                           <div>
//                             <p className="font-semibold text-slate-800">{item.name}</p>
//                             <p className="text-sm text-slate-500">Quantité: {item.quantity}</p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeItem(index)}
//                           className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
//                           title="Supprimer"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-dashed border-blue-300">
//                   <p className="text-sm font-medium text-slate-700">Ajouter un article</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div>
//                       <input
//                         type="text"
//                         value={currentItem.name}
//                         onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
//                         placeholder={formData.type === 'VIVRES' ? 'Ex: Riz, Huile...' : 'Ex: Cahiers, Stylos...'}
//                         className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <input
//                         type="number"
//                         value={currentItem.quantity}
//                         onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
//                         placeholder="Quantité"
//                         min="1"
//                         className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={addItem}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
//                   >
//                     <Plus className="w-5 h-5" />
//                     Ajouter cet article
//                   </button>
//                 </div>

//                 {errors.items && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.items}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             {/* Raison du don */}
//             <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
//               <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                 <MessageSquare className="w-5 h-5 text-purple-600" />
//                 Message personnel (optionnel)
//               </label>
//               <textarea
//                 value={formData.raison}
//                 onChange={(e) => handleInputChange('raison', e.target.value)}
//                 placeholder="Exprimez la motivation de votre générosité..."
//                 maxLength={1000}
//                 rows={4}
//                 className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white"
//               />
//               <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
//                 <span className="flex items-center gap-1">
//                   <AlertCircle className="w-3 h-3" />
//                   Ce message sera visible par le bénéficiaire
//                 </span>
//                 <span>{formData.raison.length}/1000 caractères</span>
//               </div>
//             </div>

//             {/* Photos */}
//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-3">
//                 📸 Photos (optionnel)
//               </label>
//               <p className="text-sm text-slate-600 mb-3">
//                 Ajoutez des photos pour illustrer votre don (max 5 photos)
//               </p>
//               <div
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//                 className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
//                   dragActive ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
//                 }`}
//               >
//                 <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
//                 <p className="text-sm text-slate-600 font-medium">
//                   Glissez vos photos ici ou cliquez pour sélectionner
//                 </p>
//                 <p className="text-xs text-slate-500 mt-1">
//                   JPG, PNG • Max 5 photos • 5MB chacune
//                 </p>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => handleFiles(e.target.files)}
//                   className="hidden"
//                 />
//               </div>

//               {formData.photos.length > 0 && (
//                 <div className="grid grid-cols-5 gap-3 mt-3">
//                   {formData.photos.map(photo => (
//                     <div key={photo.id} className="relative group">
//                       <img
//                         src={photo.url}
//                         alt={photo.name}
//                         className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removePhoto(photo.id)}
//                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <div className="text-sm text-blue-800">
//                 <p className="font-semibold mb-1">Ces informations sont optionnelles</p>
//                 <p>Vous pouvez les sauter et passer directement à la confirmation de votre don.</p>
//               </div>
//             </div>
//           </div>
//         );

//       case 4:
//         const selectedNeed = projectNeeds.find(n => n.id === formData.needId);
//         return (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
//               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
//                 <Check className="w-6 h-6 text-emerald-600" />
//                 Récapitulatif de votre don
//               </h3>

//               <div className="space-y-4">
//                 {/* Bénéficiaire */}
//                 <div className="bg-white rounded-xl p-4 border border-emerald-200">
//                   <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Bénéficiaire</p>
//                   <div className="flex items-center gap-3">
//                     <AvatarDisplay
//                       name={selectedDestination?.nom || selectedDestination?.fullName || selectedDestination?.titre}
//                       avatar={selectedDestination?.avatar}
//                       size="md"
//                     />
//                     <div>
//                       <p className="font-semibold text-slate-800">
//                         {selectedDestination?.nom || selectedDestination?.fullName || selectedDestination?.titre}
//                       </p>
//                       <p className="text-sm text-slate-500">
//                         {selectedDestination?.type || selectedDestination?.niveau || selectedDestination?.etablissementNom}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {selectedNeed && (
//                     <div className="mt-3 pt-3 border-t border-emerald-100">
//                       <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Besoin spécifique</p>
//                       <div className="flex items-center gap-2">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
//                           {selectedNeed.type === 'MONETAIRE' ? 'Monétaire' : selectedNeed.type === 'MATERIEL' ? 'Matériel' : 'Vivres'}
//                         </span>
//                         <p className="font-medium text-slate-700">{selectedNeed.titre}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Détails du don */}
//                 <div className="bg-white rounded-xl p-4 border border-emerald-200">
//                   <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Type de don</p>
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className="text-3xl">
//                       {formData.type === 'MONETAIRE' ? '💰' : formData.type === 'VIVRES' ? '🍎' : '📚'}
//                     </span>
//                     <p className="font-semibold text-slate-800">
//                       {formData.type === 'MONETAIRE' ? 'Don monétaire' : formData.type === 'VIVRES' ? 'Don alimentaire' : 'Don matériel'}
//                     </p>
//                   </div>

//                   {formData.type === 'MONETAIRE' && formData.montant && (
//                     <div className="bg-green-50 rounded-lg p-3 border border-green-200">
//                       <p className="text-sm text-slate-600">Montant</p>
//                       <p className="text-2xl font-bold text-green-600">{formatNumber(formData.montant)} Ar</p>
//                     </div>
//                   )}

//                   {(formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') && formData.items.length > 0 && (
//                     <div className="space-y-2">
//                       {formData.items.map((item, index) => (
//                         <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
//                           <span className="text-slate-800 font-medium">{item.name}</span>
//                           <span className="text-blue-600 font-bold">{item.quantity} unités</span>
//                         </div>
//                       ))}
//                       <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
//                         <span className="text-sm font-semibold text-slate-600">Total</span>
//                         <span className="text-lg font-bold text-blue-600">
//                           {formData.items.reduce((sum, item) => sum + item.quantity, 0)} unités
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Message */}
//                 {formData.raison && (
//                   <div className="bg-white rounded-xl p-4 border border-emerald-200">
//                     <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Votre message</p>
//                     <p className="text-slate-700 italic">"{formData.raison}"</p>
//                   </div>
//                 )}

//                 {/* Photos */}
//                 {formData.photos.length > 0 && (
//                   <div className="bg-white rounded-xl p-4 border border-emerald-200">
//                     <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
//                       Photos ({formData.photos.length})
//                     </p>
//                     <div className="grid grid-cols-5 gap-2">
//                       {formData.photos.map(photo => (
//                         <img
//                           key={photo.id}
//                           src={photo.url}
//                           alt={photo.name}
//                           className="w-full h-16 object-cover rounded-lg border border-slate-200"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {errors.form && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <AlertCircle className="w-5 h-5" />
//                   <span className="font-medium">{errors.form}</span>
//                 </div>
//               </div>
//             )}

//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//               <div className="text-sm text-yellow-800">
//                 <p className="font-semibold mb-1">Vérifiez bien toutes les informations</p>
//                 <p>Une fois le don créé, vous pourrez suivre son état mais certaines informations ne pourront plus être modifiées.</p>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
//       <div className="bg-white rounded-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-slate-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
//               <Heart className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-800">Faire un don</h2>
//               <p className="text-sm text-slate-500">Étape {currentStep} sur 4</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
//           >
//             <X className="w-5 h-5 text-slate-500" />
//           </button>
//         </div>

//         {/* Progress bar */}
//         <div className="px-6 pt-4">
//           <div className="flex items-center justify-between mb-2">
//             {steps.map((step, index) => {
//               const StepIcon = step.icon;
//               const isActive = currentStep === step.id;
//               const isCompleted = currentStep > step.id;
              
//               return (
//                 <React.Fragment key={step.id}>
//                   <div className="flex flex-col items-center gap-2">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                       isCompleted ? 'bg-emerald-500 text-white' :
//                       isActive ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' :
//                       'bg-slate-100 text-slate-400'
//                     }`}>
//                       {isCompleted ? (
//                         <Check className="w-5 h-5" />
//                       ) : (
//                         <StepIcon className="w-5 h-5" />
//                       )}
//                     </div>
//                     <div className="text-center hidden md:block">
//                       <p className={`text-xs font-semibold ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
//                         {step.title}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {index < steps.length - 1 && (
//                     <div className={`flex-1 h-0.5 mx-2 transition-all ${
//                       currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
//                     }`} />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="mb-4">
//             <h3 className="text-lg font-bold text-slate-800">{steps[currentStep - 1].title}</h3>
//             <p className="text-sm text-slate-600">{steps[currentStep - 1].desc}</p>
//           </div>
          
//           {renderStepContent()}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
//           <button
//             onClick={currentStep === 1 ? onClose : prevStep}
//             className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-white font-medium transition-colors flex items-center gap-2"
//           >
//             {currentStep === 1 ? (
//               <>
//                 <X className="w-4 h-4" />
//                 Annuler
//               </>
//             ) : (
//               <>
//                 <ArrowLeft className="w-4 h-4" />
//                 Précédent
//               </>
//             )}
//           </button>
          
//           {currentStep < 4 ? (
//             <button
//               onClick={nextStep}
//               className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
//             >
//               {currentStep === 3 ? 'Voir le récapitulatif' : 'Suivant'}
//               <ArrowRight className="w-5 h-5" />
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   Création en cours...
//                 </>
//               ) : (
//                 <>
//                   <Heart className="w-5 h-5" />
//                   Confirmer le don
//                 </>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonationModal;
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Plus, AlertCircle, Heart, Building2, GraduationCap, 
  FileText, Trash2, Search, ChevronDown, ChevronUp, MessageSquare,
  DollarSign, Package, ShoppingCart, Target, Check, ArrowRight, ArrowLeft
} from 'lucide-react';

// Composant Avatar simplifié
const AvatarDisplay = ({ name, avatar, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  if (avatar) {
    return (
      <img 
        src={avatar} 
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold`}>
      {name?.slice(0, 2).toUpperCase() || '??'}
    </div>
  );
};

const DonationModal = ({ isOpen, onClose, onSuccess, preselectedBeneficiary = null }) => {
  // ✅ Démarrer à l'étape 1 si preselectedBeneficiary existe (depuis fil d'actualité)
  // ✅ Démarrer à l'étape 0 sinon (depuis dashboard)
  const [currentStep, setCurrentStep] = useState(preselectedBeneficiary ? 1 : 0);
  
  const [formData, setFormData] = useState({
    type: 'MONETAIRE',
    montant: '',
    items: [],
    destinationType: preselectedBeneficiary?.type === 'Projet' ? 'project' : 
                     preselectedBeneficiary?.type === 'Établissement' ? 'etablissement' : 'project',
    destinationId: preselectedBeneficiary?.id || '',
    needId: '',
    photos: [],
    raison: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState(preselectedBeneficiary ? [preselectedBeneficiary] : []);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [projectNeeds, setProjectNeeds] = useState(preselectedBeneficiary?.besoins || []);
  
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [currentItem, setCurrentItem] = useState({ name: '', quantity: '' });

  // ✅ Définition des étapes AMÉLIORÉES - Plus d'étapes, moins de contenu par étape
  const steps = preselectedBeneficiary 
    ? [
        { id: 1, title: 'Besoin', icon: Target, desc: 'Choisir un besoin spécifique (optionnel)' },
        { id: 2, title: 'Type', icon: Package, desc: 'Type de don' },
        { id: 3, title: 'Montant/Articles', icon: DollarSign, desc: 'Détails du don' },
        { id: 4, title: 'Message', icon: MessageSquare, desc: 'Message optionnel' },
        { id: 5, title: 'Confirmation', icon: Check, desc: 'Vérifier' }
      ]
    : [
        { id: 0, title: 'Catégorie', icon: Building2, desc: 'Type de bénéficiaire' },
        { id: 1, title: 'Bénéficiaire', icon: Search, desc: 'Qui aider ?' },
        { id: 2, title: 'Type', icon: Package, desc: 'Type de don' },
        { id: 3, title: 'Montant/Articles', icon: DollarSign, desc: 'Détails' },
        { id: 4, title: 'Message', icon: MessageSquare, desc: 'Message optionnel' },
        { id: 5, title: 'Confirmation', icon: Check, desc: 'Vérifier' }
      ];

  // Effets
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (preselectedBeneficiary) {
        setDestinations([preselectedBeneficiary]);
        if (preselectedBeneficiary.besoins?.length > 0) {
          setProjectNeeds(preselectedBeneficiary.besoins);
        }
      } else if (!preselectedBeneficiary && currentStep > 0) {
        loadDestinations();
      }
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (formData.destinationType === 'project' && formData.destinationId && destinations.length > 0) {
      const selectedProject = destinations.find(d => d.id === formData.destinationId);
      if (selectedProject?.besoins?.length > 0) {
        setProjectNeeds(selectedProject.besoins);
      } else {
        setProjectNeeds([]);
        setFormData(prev => ({ ...prev, needId: '' }));
      }
    }
  }, [formData.destinationType, formData.destinationId, destinations]);

  useEffect(() => {
    if (formData.needId && projectNeeds.length > 0) {
      const selectedNeed = projectNeeds.find(n => n.id === formData.needId);
      if (selectedNeed) {
        const needTypeMap = {
          'MONETAIRE': 'MONETAIRE',
          'MATERIEL': 'NON_VIVRES',
          'VIVRES': 'VIVRES'
        };
        const requiredType = needTypeMap[selectedNeed.type];
        if (requiredType !== formData.type) {
          setFormData(prev => ({
            ...prev,
            type: requiredType,
            montant: '',
            items: []
          }));
        }
      }
    }
  }, [formData.needId, projectNeeds]);

  // Fonctions utilitaires
  const loadDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const response = await fetch('/api/donations/destinations');
      if (response.ok) {
        const data = await response.json();
        let destinationList = [];
        if (formData.destinationType === 'project') {
          destinationList = data.projects || [];
        } else if (formData.destinationType === 'etablissement') {
          destinationList = data.etablissements || [];
        } else if (formData.destinationType === 'personnel') {
          destinationList = data.personnels || [];
        }
        setDestinations(destinationList);
      }
    } catch (error) {
      console.error('Erreur chargement destinations:', error);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'destinationType') {
      setFormData(prev => ({ ...prev, destinationId: '', needId: '' }));
      setSearchTerm('');
      setProjectNeeds([]);
      loadDestinations();
    }

    if (field === 'destinationId') {
      setFormData(prev => ({ ...prev, needId: '' }));
    }

    if (field === 'type') {
      setFormData(prev => ({ ...prev, items: [], montant: '' }));
      setCurrentItem({ name: '', quantity: '' });
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addItem = () => {
    if (!currentItem.name.trim() || !currentItem.quantity || parseInt(currentItem.quantity) <= 0) {
      setErrors(prev => ({ ...prev, items: 'Veuillez remplir le nom et la quantité' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        name: currentItem.name.trim(), 
        quantity: parseInt(currentItem.quantity) 
      }]
    }));
    
    setCurrentItem({ name: '', quantity: '' });
    setErrors(prev => ({ ...prev, items: null }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isImage && isValidSize;
    });

    const photoPromises = validFiles.map(async (file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      base64: await fileToBase64(file)
    }));

    const newPhotos = await Promise.all(photoPromises);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 5)
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    // Étape 0: Catégorie (seulement si pas de bénéficiaire présélectionné)
    if (step === 0 && !preselectedBeneficiary) {
      if (!formData.destinationType) {
        newErrors.destinationType = 'Veuillez choisir un type de bénéficiaire';
      }
    }

    // Étape 1: Bénéficiaire OU Besoin (selon si présélectionné ou non)
    if (step === 1) {
      if (!preselectedBeneficiary && !formData.destinationId) {
        newErrors.destinationId = 'Veuillez sélectionner un bénéficiaire';
      }
      // Pas d'erreur si needId vide car c'est optionnel
    }

    // Étape 2: Type de don
    if (step === 2) {
      if (!formData.type) {
        newErrors.type = 'Veuillez choisir un type de don';
      }
    }

    // Étape 3: Montant/Articles
    if (step === 3) {
      if (formData.type === 'MONETAIRE') {
        if (!formData.montant || parseFloat(formData.montant) <= 0) {
          newErrors.montant = 'Le montant est obligatoire';
        }
      } else {
        if (formData.items.length === 0) {
          newErrors.items = 'Veuillez ajouter au moins un article';
        }
      }
    }

    return newErrors;
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    const maxStep = steps[steps.length - 1].id;
    setCurrentStep(prev => Math.min(prev + 1, maxStep));
  };

  const prevStep = () => {
    if (currentStep === (preselectedBeneficiary ? 1 : 0)) {
      onClose();
    } else {
      setCurrentStep(prev => Math.max(prev - 1, preselectedBeneficiary ? 1 : 0));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const donationData = {
        type: formData.type,
        montant: formData.type === 'MONETAIRE' ? parseFloat(formData.montant) : undefined,
        items: formData.type !== 'MONETAIRE' ? formData.items : undefined,
        photos: formData.photos.map(photo => photo.base64),
        raison: formData.raison || undefined,
        needId: formData.needId || undefined,
        ...(formData.destinationType === 'project' && { projectId: formData.destinationId }),
        ...(formData.destinationType === 'etablissement' && { etablissementId: formData.destinationId }),
        ...(formData.destinationType === 'personnel' && { personnelId: formData.destinationId }),
      };

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details?.fieldErrors) {
          setErrors(result.details.fieldErrors);
        } else {
          setErrors({ form: result.error || 'Erreur lors de la création du don' });
        }
        return;
      }

      onSuccess(result.donation);
      onClose();
      
      // Reset
      setFormData({
        type: 'MONETAIRE',
        montant: '',
        items: [],
        destinationType: 'project',
        destinationId: '',
        needId: '',
        photos: [],
        raison: ''
      });
      setCurrentStep(preselectedBeneficiary ? 1 : 0);

    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDestinationTypeInfo = (type) => {
    const typeMap = {
      'project': {
        icon: FileText,
        label: 'Projet spécifique',
        desc: 'Soutenez un projet précis',
        placeholder: 'Rechercher un projet...'
      },
      'etablissement': {
        icon: Building2,
        label: 'Établissement',
        desc: 'Don général à un établissement',
        placeholder: 'Rechercher un établissement...'
      },
      'personnel': {
        icon: GraduationCap,
        label: 'Enseignant/Personnel',
        desc: 'Don personnel à un éducateur',
        placeholder: 'Rechercher un enseignant...'
      }
    };
    return typeMap[type];
  };

  const getNeedIcon = (type) => {
    const icons = {
      'MONETAIRE': DollarSign,
      'MATERIEL': Package,
      'VIVRES': ShoppingCart
    };
    return icons[type] || Package;
  };

  const getNeedColor = (type) => {
    const colors = {
      'MONETAIRE': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
      'MATERIEL': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
      'VIVRES': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' }
    };
    return colors[type] || colors['MATERIEL'];
  };

  const formatNumber = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('fr-MG').format(parseInt(value));
  };

  const filteredDestinations = destinations.filter(dest => {
    const searchLower = searchTerm.toLowerCase();
    const name = (dest.nom || dest.fullName || dest.titre || '').toLowerCase();
    const secondary = (dest.type || dest.niveau || dest.etablissementNom || '').toLowerCase();
    return name.includes(searchLower) || secondary.includes(searchLower);
  });

  const displayedDestinations = filteredDestinations.slice(0, 10);
  const selectedDestination = destinations.find(d => d.id === formData.destinationId);

  if (!isOpen) return null;

  // ✅ RENDU DES ÉTAPES - SIMPLIFIÉ ET COMPACT
  const renderStepContent = () => {
    const currentStepObj = steps.find(s => s.id === currentStep);

    // ÉTAPE 0: Catégorie de bénéficiaire (seulement si pas présélectionné)
    if (currentStep === 0 && !preselectedBeneficiary) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {['project', 'etablissement', 'personnel'].map(type => {
              const typeInfo = getDestinationTypeInfo(type);
              const TypeIcon = typeInfo.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange('destinationType', type)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    formData.destinationType === type
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TypeIcon className="w-6 h-6" />
                    <div>
                      <span className="font-semibold block">{typeInfo.label}</span>
                      <span className="text-sm text-slate-500">{typeInfo.desc}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.destinationType && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.destinationType}
            </p>
          )}
        </div>
      );
    }

    // ÉTAPE 1: Choix du besoin (si projet présélectionné) OU Bénéficiaire (sinon)
    if (currentStep === 1) {
      // Si projet présélectionné, afficher les besoins
      if (preselectedBeneficiary && projectNeeds.length > 0) {
        return (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2">
                <AvatarDisplay
                  name={preselectedBeneficiary.titre || preselectedBeneficiary.nom}
                  avatar={preselectedBeneficiary.avatar}
                  size="sm"
                />
                <div>
                  <p className="font-semibold text-sm text-slate-800">
                    {preselectedBeneficiary.titre || preselectedBeneficiary.nom}
                  </p>
                  <p className="text-xs text-slate-500">{preselectedBeneficiary.nom}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleInputChange('needId', '')}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                !formData.needId
                  ? 'border-emerald-500 bg-white shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-semibold text-sm">Don général au projet</p>
                  <p className="text-xs text-slate-500">Soutenir le projet globalement</p>
                </div>
              </div>
            </button>

            {projectNeeds.map(need => {
              const NeedIcon = getNeedIcon(need.type);
              const colors = getNeedColor(need.type);
              
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => handleInputChange('needId', need.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    formData.needId === need.id
                      ? 'border-emerald-500 bg-white shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <NeedIcon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{need.titre}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${colors.badge} flex-shrink-0`}>
                          {need.type === 'MONETAIRE' ? '💰' : need.type === 'MATERIEL' ? '📦' : '🍎'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-600">Progression</span>
                        <span className={`font-bold ${colors.text}`}>{need.pourcentage?.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full transition-all ${colors.text.replace('text-', 'bg-')}`}
                          style={{ width: `${Math.min(need.pourcentage || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      }

      // Sinon, sélection du bénéficiaire
      return (
        <div className="space-y-4" ref={dropdownRef}>
          {loadingDestinations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder={getDestinationTypeInfo(formData.destinationType).placeholder}
                  className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {isDropdownOpen ? (
                  <ChevronUp 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                ) : (
                  <ChevronDown 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
                    onClick={() => setIsDropdownOpen(true)}
                  />
                )}
              </div>

              {selectedDestination && !isDropdownOpen && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <AvatarDisplay
                    name={selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
                    avatar={selectedDestination.avatar}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {selectedDestination.type || selectedDestination.niveau}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, destinationId: '' }));
                      setSearchTerm('');
                    }}
                    className="text-red-600 hover:bg-red-50 p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isDropdownOpen && (
                <div className="max-h-60 overflow-y-auto bg-white border-2 border-slate-200 rounded-xl">
                  {displayedDestinations.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">
                      Aucun résultat
                    </div>
                  ) : (
                    displayedDestinations.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          handleInputChange('destinationId', option.id);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full p-3 text-left flex items-center gap-2 border-b border-slate-100 last:border-b-0 ${
                          formData.destinationId === option.id ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <AvatarDisplay
                          name={option.nom || option.fullName || option.titre}
                          avatar={option.avatar}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {option.nom || option.fullName || option.titre}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {option.type || option.niveau}
                          </p>
                        </div>
                        {formData.destinationId === option.id && (
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          )}
          
          {errors.destinationId && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.destinationId}
            </p>
          )}
        </div>
      );
    }

    // ÉTAPE 2: Type de don
    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'MONETAIRE', label: 'Monétaire', icon: '💰' },
              { value: 'VIVRES', label: 'Vivres', icon: '🍎' },
              { value: 'NON_VIVRES', label: 'Matériel', icon: '📚' }
            ].map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => !formData.needId && handleInputChange('type', type.value)}
                disabled={!!formData.needId}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  formData.type === type.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                } ${formData.needId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-sm font-semibold">{type.label}</div>
              </button>
            ))}
          </div>
          {formData.needId && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg text-center">
              Type déterminé par le besoin sélectionné
            </div>
          )}
          {errors.type && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.type}
            </p>
          )}
        </div>
      );
    }

    // ÉTAPE 3: Montant ou Articles
    if (currentStep === 3) {
      if (formData.type === 'MONETAIRE') {
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                💰 Montant en Ariary *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => handleInputChange('montant', e.target.value)}
                  placeholder="Ex: 50000"
                  className={`w-full px-4 py-3 pr-16 border-2 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.montant ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500 bg-white'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                  Ar
                </span>
              </div>
              {formData.montant && (
                <div className="mt-3 p-2 bg-white rounded-lg border border-green-200 text-center">
                  <span className="font-bold text-green-600 text-base">
                    {formatNumber(formData.montant)} Ariary
                  </span>
                </div>
              )}
            </div>
            {errors.montant && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.montant}
              </p>
            )}
          </div>
        );
      } else {
        return (
          <div className="space-y-4">
            {formData.items.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{formData.type === 'VIVRES' ? '🍎' : '📚'}</span>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">Qté: {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white p-3 rounded-xl border-2 border-dashed border-blue-300 space-y-2">
              <p className="text-xs font-medium text-slate-700">Ajouter un article</p>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder={formData.type === 'VIVRES' ? 'Ex: Riz' : 'Ex: Cahiers'}
                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Quantité"
                  min="1"
                  className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            </div>

            {errors.items && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.items}
              </p>
            )}
          </div>
        );
      }
    }

    // ÉTAPE 4: Message et Photos
    if (currentStep === 4) {
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              💬 Message personnel (optionnel)
            </label>
            <textarea
              value={formData.raison}
              onChange={(e) => handleInputChange('raison', e.target.value)}
              placeholder="Votre message..."
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none bg-white text-sm"
            />
            <div className="mt-1 text-xs text-slate-500 text-right">
              {formData.raison.length}/500
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              📸 Photos (optionnel, max 5)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragActive ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                Glissez ou cliquez
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-16 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Ces informations sont optionnelles
          </div>
        </div>
      );
    }

    // ÉTAPE 5: Confirmation
    if (currentStep === 5) {
      const selectedNeed = projectNeeds.find(n => n.id === formData.needId);
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200">
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              Récapitulatif
            </h3>

            {/* Bénéficiaire */}
            <div className="bg-white rounded-xl p-3 border border-emerald-200 mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Bénéficiaire</p>
              <div className="flex items-center gap-2">
                <AvatarDisplay
                  name={selectedDestination?.nom || selectedDestination?.fullName || selectedDestination?.titre}
                  avatar={selectedDestination?.avatar}
                  size="sm"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {selectedDestination?.nom || selectedDestination?.fullName || selectedDestination?.titre}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedDestination?.type || selectedDestination?.niveau}
                  </p>
                </div>
              </div>
              
              {selectedNeed && (
                <div className="mt-2 pt-2 border-t border-emerald-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Besoin ciblé</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {selectedNeed.type === 'MONETAIRE' ? '💰' : selectedNeed.type === 'MATERIEL' ? '📦' : '🍎'}
                    </span>
                    <p className="text-sm font-medium">{selectedNeed.titre}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Détails du don */}
            <div className="bg-white rounded-xl p-3 border border-emerald-200 mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Don</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">
                  {formData.type === 'MONETAIRE' ? '💰' : formData.type === 'VIVRES' ? '🍎' : '📚'}
                </span>
                <p className="font-semibold text-sm">
                  {formData.type === 'MONETAIRE' ? 'Don monétaire' : 
                   formData.type === 'VIVRES' ? 'Don alimentaire' : 'Don matériel'}
                </p>
              </div>

              {formData.type === 'MONETAIRE' && formData.montant && (
                <div className="bg-green-50 rounded-lg p-2 border border-green-200 text-center">
                  <p className="text-xl font-bold text-green-600">{formatNumber(formData.montant)} Ar</p>
                </div>
              )}

              {(formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') && formData.items.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs p-2 bg-blue-50 rounded">
                      <span>{item.name}</span>
                      <span className="font-bold text-blue-600">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            {formData.raison && (
              <div className="bg-white rounded-xl p-3 border border-emerald-200 mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Message</p>
                <p className="text-sm text-slate-700 italic line-clamp-2">"{formData.raison}"</p>
              </div>
            )}

            {/* Photos */}
            {formData.photos.length > 0 && (
              <div className="bg-white rounded-xl p-3 border border-emerald-200">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Photos ({formData.photos.length})
                </p>
                <div className="grid grid-cols-5 gap-1">
                  {formData.photos.map(photo => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-12 object-cover rounded border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.form}</span>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Vérifiez toutes les informations avant de confirmer
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Faire un don</h2>
              <p className="text-xs text-slate-500">Étape {currentStep + 1} sur {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs ${
                      isCompleted ? 'bg-emerald-500 text-white' :
                      isActive ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>
                    <p className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-all ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content - HAUTEUR FIXE POUR ÉVITER LE SCROLL */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">{steps.find(s => s.id === currentStep)?.title}</h3>
            <p className="text-xs text-slate-600">{steps.find(s => s.id === currentStep)?.desc}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {renderStepContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={prevStep}
            className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-white font-medium transition-colors flex items-center gap-2 text-sm"
          >
            {currentStep === (preselectedBeneficiary ? 1 : 0) ? (
              <>
                <X className="w-4 h-4" />
                Annuler
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Retour
              </>
            )}
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-sm"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  Confirmer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;