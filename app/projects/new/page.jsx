

// // export default ProjectPublicationForm;

// "use client";

// import React, { useState, useRef } from 'react';
// import { Calendar, Upload, X, Plus, AlertCircle, CheckCircle2, Link } from 'lucide-react';

// const ProjectPublicationForm = () => {
//   const [formData, setFormData] = useState({
//     reference: '',
//     category: '',
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     budget: '',
//     photos: []
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const categories = [
//     { value: 'CONSTRUCTION', label: 'Construction', icon: '🏗️' },
//     { value: 'REHABILITATION', label: 'Réhabilitation', icon: '🔧' },
//     { value: 'AUTRES', label: 'Autres', icon: '✨' }
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const generateReference = () => {
//     const year = new Date().getFullYear();
//     const month = String(new Date().getMonth() + 1).padStart(2, '0');
//     const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
//     const reference = `REF-${year}${month}-${random}`;
//     handleInputChange('reference', reference);
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
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   // Fonction pour convertir les fichiers en base64
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
//       const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
//       return isImage && isValidSize;
//     });

//     // Convertir les fichiers en base64
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
//       photos: [...prev.photos, ...newPhotos].slice(0, 5) // Max 5 photos
//     }));
//   };

//   const removePhoto = (photoId) => {
//     setFormData(prev => ({
//       ...prev,
//       photos: prev.photos.filter(photo => photo.id !== photoId)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.reference.trim()) {
//       newErrors.reference = 'La référence est obligatoire';
//     }

//     if (!formData.category) {
//       newErrors.category = 'La catégorie est obligatoire';
//     }

//     if (!formData.title.trim()) {
//       newErrors.title = 'Le titre est obligatoire';
//     } else if (formData.title.length < 10) {
//       newErrors.title = 'Le titre doit contenir au moins 10 caractères';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'La description est obligatoire';
//     } else if (formData.description.length < 50) {
//       newErrors.description = 'La description doit contenir au moins 50 caractères';
//     }

//     if (formData.startDate && formData.endDate) {
//       if (new Date(formData.startDate) >= new Date(formData.endDate)) {
//         newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
//       }
//     }

//     if (formData.photos.length === 0) {
//       newErrors.photos = 'Au moins une photo est requise';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
    
//     try {
//       // Préparer les données pour l'API
//       const projectData = {
//         reference: formData.reference,
//         category: formData.category,
//         title: formData.title,
//         description: formData.description,
//         startDate: formData.startDate || null,
//         endDate: formData.endDate || null,
//         photos: formData.photos.map(photo => photo.base64) // Envoyer en base64
//       };

//       const response = await fetch('/api/projects', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(projectData),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 403) {
//           setErrors({ form: 'Seuls les profils ÉTABLISSEMENT peuvent publier des projets.' });
//         } else if (response.status === 400 && result.details) {
//           // Erreurs de validation spécifiques
//           const fieldErrors = {};
//           if (result.details.fieldErrors) {
//             Object.entries(result.details.fieldErrors).forEach(([field, messages]) => {
//               fieldErrors[field] = messages[0];
//             });
//           }
//           setErrors(fieldErrors);
//         } else {
//           setErrors({ form: result.error || 'Erreur lors de la publication du projet' });
//         }
//         return;
//       }

//       // Succès
//       setSubmitSuccess(true);
      
//       // Reset form après 3 secondes
//       setTimeout(() => {
//         setFormData({
//           reference: '',
//           category: '',
//           title: '',
//           description: '',
//           startDate: '',
//           endDate: '',
//           budget: '',
//           photos: []
//         });
//         setSubmitSuccess(false);
//       }, 3000);

//     } catch (error) {
//       console.error('Erreur:', error);
//       setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const saveDraft = async () => {
//     // Sauvegarder en tant que brouillon (optionnel)
//     const draftData = {
//       ...formData,
//       isDraft: true
//     };
    
//     // Sauvegarder dans localStorage pour l'instant
//     localStorage.setItem('projectDraft', JSON.stringify(draftData));
//     alert('Brouillon sauvegardé !');
//   };

//   // Charger un brouillon au montage du composant
//   React.useEffect(() => {
//     const savedDraft = localStorage.getItem('projectDraft');
//     if (savedDraft) {
//       try {
//         const draftData = JSON.parse(savedDraft);
//         if (confirm('Un brouillon a été trouvé. Voulez-vous le charger ?')) {
//           setFormData(draftData);
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement du brouillon:', error);
//       }
//     }
//   }, []);

//   if (submitSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6 flex items-center justify-center">
//         <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md text-center">
//           <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Projet publié avec succès !</h2>
//           <p className="text-gray-600 mb-6">Votre projet est maintenant visible par tous les donateurs.</p>
//           <button 
//             onClick={() => window.location.href = '/dashboard'}
//             className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
//           >
//             Retour au tableau de bord
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
//                 MSN
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Mada Social Network</h1>
//                 <p className="text-gray-600">Publication de projet</p>
//               </div>
//             </div>
            
//             <button 
//               onClick={() => window.location.href = '/dashboard'}
//               className="text-gray-600 hover:text-indigo-600 font-medium"
//             >
//               ← Retour au tableau de bord
//             </button>
//           </div>
//         </div>

//         {/* Main Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
//                 Publier un nouveau projet
//               </h2>
//               <p className="text-gray-600 text-lg">
//                 Partagez votre projet avec la communauté pour trouver des donateurs
//               </p>
//             </div>

//             {/* Erreur générale */}
//             {errors.form && (
//               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <AlertCircle className="w-5 h-5" />
//                   <span className="font-medium">{errors.form}</span>
//                 </div>
//               </div>
//             )}

//             {/* Reference and Category */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   📋
//                 </div>
//                 Informations de base
//               </h3>
              
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Référence du projet *
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={formData.reference}
//                       onChange={(e) => handleInputChange('reference', e.target.value)}
//                       placeholder="REF-2024-001"
//                       className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                         errors.reference ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={generateReference}
//                       className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
//                     >
//                       Générer
//                     </button>
//                   </div>
//                   {errors.reference && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.reference}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Catégorie *
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleInputChange('category', e.target.value)}
//                     className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                       errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                     }`}
//                   >
//                     <option value="">Sélectionnez une catégorie</option>
//                     {categories.map(cat => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.icon} {cat.label}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.category && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.category}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Title and Description */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   ✏️
//                 </div>
//                 Détails du projet
//               </h3>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Titre du projet *
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => handleInputChange('title', e.target.value)}
//                     placeholder="Ex: Rénovation de la bibliothèque du lycée"
//                     className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                       errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                     }`}
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     {formData.title.length}/100 caractères (minimum 10)
//                   </p>
//                   {errors.title && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.title}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Description détaillée *
//                   </label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => handleInputChange('description', e.target.value)}
//                     placeholder="Décrivez votre projet, ses objectifs, les bénéficiaires, l'impact attendu..."
//                     rows={6}
//                     className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                       errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                     }`}
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     {formData.description.length}/1000 caractères (minimum 50)
//                   </p>
//                   {errors.description && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.description}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Photos */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   📸
//                 </div>
//                 Photos du projet *
//               </h3>
              
//               <div
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//                 className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
//                   dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
//                 } ${errors.photos ? 'border-red-400 bg-red-50' : ''}`}
//               >
//                 <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                 <h4 className="text-lg font-semibold text-gray-700 mb-2">
//                   Glissez vos photos ici ou cliquez pour sélectionner
//                 </h4>
//                 <p className="text-gray-500">
//                   JPG, PNG, GIF • Maximum 5 photos • 5MB max par photo
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

//               {errors.photos && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.photos}
//                 </p>
//               )}

//               {formData.photos.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
//                   {formData.photos.map(photo => (
//                     <div key={photo.id} className="relative group">
//                       <img
//                         src={photo.url}
//                         alt={photo.name}
//                         className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removePhoto(photo.id);
//                         }}
//                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Dates and Budget */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   📅
//                 </div>
//                 Planification
//               </h3>
              
//               <div className="grid md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Date de début souhaitée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(e) => handleInputChange('startDate', e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Date de fin souhaitée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) => handleInputChange('endDate', e.target.value)}
//                     className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                       errors.endDate ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                     }`}
//                   />
//                   {errors.endDate && (
//                     <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.endDate}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Budget estimé (Ar)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.budget}
//                     onChange={(e) => handleInputChange('budget', e.target.value)}
//                     placeholder="5000000"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Section */}
//             <div className="text-center pt-6 border-t border-gray-200">
//               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                 <button
//                   type="button"
//                   onClick={saveDraft}
//                   className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
//                 >
//                   Enregistrer comme brouillon
//                 </button>
                
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-12 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Publication en cours...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="w-5 h-5" />
//                       Publier le projet
//                     </>
//                   )}
//                 </button>
//               </div>
              
//               <p className="mt-4 text-sm text-gray-500">
//                 En publiant ce projet, vous acceptez qu'il soit visible par tous les donateurs de la plateforme
//               </p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectPublicationForm;

"use client";
import React, { useState, useRef } from 'react';
import { 
  Calendar, Upload, X, Plus, AlertCircle, CheckCircle2, 
  DollarSign, Package, ShoppingCart, Trash2, ChevronDown,
  ArrowLeft, Save
} from 'lucide-react';

const ProjectPublicationForm = () => {
  const [formData, setFormData] = useState({
    reference: '',
    category: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budgetEstime: '',
    photos: [],
    needs: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [currentNeed, setCurrentNeed] = useState({
    type: '',
    titre: '',
    description: '',
    montantCible: '',
    quantiteCible: '',
    unite: '',
    priorite: 1
  });
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'CONSTRUCTION', label: 'Construction', icon: <Package className="w-5 h-5" /> },
    { value: 'REHABILITATION', label: 'Réhabilitation', icon: <ShoppingCart className="w-5 h-5" /> },
    { value: 'AUTRES', label: 'Autres', icon: <Plus className="w-5 h-5" /> }
  ];

  const needTypes = [
    { value: 'MONETAIRE', label: 'Monétaire', icon: <DollarSign className="w-5 h-5" />, color: 'green' },
    { value: 'MATERIEL', label: 'Matériel', icon: <Package className="w-5 h-5" />, color: 'blue' },
    { value: 'VIVRES', label: 'Vivres', icon: <ShoppingCart className="w-5 h-5" />, color: 'orange' }
  ];

  const priorityLevels = [
    { value: 1, label: 'Haute', color: 'red' },
    { value: 2, label: 'Moyenne', color: 'yellow' },
    { value: 3, label: 'Basse', color: 'gray' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const reference = `REF-${year}${month}-${random}`;
    handleInputChange('reference', reference);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
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

  const handleNeedInputChange = (field, value) => {
    setCurrentNeed(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addNeed = () => {
    if (!currentNeed.type || !currentNeed.titre) {
      alert('Veuillez remplir au moins le type et le titre du besoin');
      return;
    }

    const needTypeInfo = needTypes.find(t => t.value === currentNeed.type);
    
    const newNeed = {
      id: Date.now(),
      ...currentNeed,
      typeInfo: needTypeInfo
    };

    setFormData(prev => ({
      ...prev,
      needs: [...prev.needs, newNeed]
    }));

    setCurrentNeed({
      type: '',
      titre: '',
      description: '',
      montantCible: '',
      quantiteCible: '',
      unite: '',
      priorite: 1
    });
    setShowNeedForm(false);
  };

  const removeNeed = (needId) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.filter(need => need.id !== needId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est obligatoire';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est obligatoire';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Le titre doit contenir au moins 10 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (formData.photos.length === 0) {
      newErrors.photos = 'Au moins une photo est requise';
    }

    if (formData.needs.length === 0) {
      newErrors.needs = 'Ajoutez au moins un besoin pour votre projet';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const projectData = {
        reference: formData.reference,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        budgetEstime: parseFloat(formData.budgetEstime) || null,
        photos: formData.photos.map(photo => photo.base64),
        needs: formData.needs.map(need => ({
          type: need.type,
          titre: need.titre,
          description: need.description,
          montantCible: need.montantCible ? parseFloat(need.montantCible) : null,
          quantiteCible: need.quantiteCible ? parseInt(need.quantiteCible) : null,
          unite: need.unite,
          priorite: need.priorite
        }))
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setErrors({ form: 'Seuls les profils ÉTABLISSEMENT peuvent publier des projets.' });
        } else if (response.status === 400 && result.details) {
          const fieldErrors = {};
          if (result.details.fieldErrors) {
            Object.entries(result.details.fieldErrors).forEach(([field, messages]) => {
              fieldErrors[field] = messages[0];
            });
          }
          setErrors(fieldErrors);
        } else {
          setErrors({ form: result.error || 'Erreur lors de la publication du projet' });
        }
        return;
      }

      setSubmitSuccess(true);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'bg-red-100 text-red-700 border-red-300',
      2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      3: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[priority] || colors[2];
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Projet publié avec succès !</h2>
          <p className="text-gray-600 mb-6">Votre projet est maintenant visible par tous les donateurs.</p>
          <div className="animate-pulse text-sm text-gray-500">Redirection en cours...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Publier un nouveau projet</h1>
                <p className="text-gray-600">Partagez votre projet avec la communauté</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Erreur générale */}
          {errors.form && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errors.form}</span>
              </div>
            </div>
          )}

          {/* Informations de base */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Package className="w-5 h-5" />
              </div>
              Informations de base
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Référence du projet *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="REF-2024-001"
                    className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.reference ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={generateReference}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Générer
                  </button>
                </div>
                {errors.reference && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.reference}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Détails du projet */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                <Upload className="w-5 h-5" />
              </div>
              Détails du projet
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Rénovation de la bibliothèque du lycée"
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 caractères (minimum 10)
                </p>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre projet, ses objectifs, les bénéficiaires, l'impact attendu..."
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/1000 caractères (minimum 50)
                </p>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
                <Upload className="w-5 h-5" />
              </div>
              Photos du projet *
            </h3>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              } ${errors.photos ? 'border-red-400 bg-red-50' : ''}`}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Glissez vos photos ici ou cliquez pour sélectionner
              </h4>
              <p className="text-gray-500">
                JPG, PNG, GIF • Maximum 5 photos • 5MB max par photo
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

            {errors.photos && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.photos}
              </p>
            )}

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Planification et Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              Planification
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.endDate ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.endDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget total estimé (Ar)
                </label>
                <input
                  type="number"
                  value={formData.budgetEstime}
                  onChange={(e) => handleInputChange('budgetEstime', e.target.value)}
                  placeholder="5000000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Besoins du projet */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <DollarSign className="w-5 h-5" />
                </div>
                Besoins du projet *
              </h3>
              <button
                type="button"
                onClick={() => setShowNeedForm(!showNeedForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Ajouter un besoin
              </button>
            </div>

            {errors.needs && formData.needs.length === 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.needs}
                </p>
              </div>
            )}

            {showNeedForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Ajouter un nouveau besoin</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de besoin *
                    </label>
                    <select
                      value={currentNeed.type}
                      onChange={(e) => handleNeedInputChange('type', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un type</option>
                      {needTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du besoin *
                    </label>
                    <input
                      type="text"
                      value={currentNeed.titre}
                      onChange={(e) => handleNeedInputChange('titre', e.target.value)}
                      placeholder="Ex: Achat de livres scolaires"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={currentNeed.description}
                      onChange={(e) => handleNeedInputChange('description', e.target.value)}
                      placeholder="Détails du besoin..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {currentNeed.type === 'MONETAIRE' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Montant cible (Ar)
                        </label>
                        <input
                          type="number"
                          value={currentNeed.montantCible}
                          onChange={(e) => handleNeedInputChange('montantCible', e.target.value)}
                          placeholder="500000"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    {(currentNeed.type === 'MATERIEL' || currentNeed.type === 'VIVRES') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantité cible
                          </label>
                          <input
                            type="number"
                            value={currentNeed.quantiteCible}
                            onChange={(e) => handleNeedInputChange('quantiteCible', e.target.value)}
                            placeholder="50"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unité
                          </label>
                          <input
                            type="text"
                            value={currentNeed.unite}
                            onChange={(e) => handleNeedInputChange('unite', e.target.value)}
                            placeholder="pièces, kg, lots..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={currentNeed.priorite}
                        onChange={(e) => handleNeedInputChange('priorite', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        {priorityLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setShowNeedForm(false)}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={addNeed}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des besoins ajoutés */}
            {formData.needs.length > 0 ? (
              <div className="space-y-4">
                {formData.needs.map(need => (
                  <div key={need.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          need.type === 'MONETAIRE' ? 'bg-green-100 text-green-600' :
                          need.type === 'MATERIEL' ? 'bg-blue-100 text-blue-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {need.typeInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">{need.titre}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(need.priorite)}`}>
                              {priorityLevels.find(p => p.value === need.priorite)?.label}
                            </span>
                          </div>
                          {need.description && (
                            <p className="text-sm text-gray-600 mb-2">{need.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">Type: {need.typeInfo.label}</span>
                            {need.montantCible && (
                              <span className="font-medium text-green-600">
                                Objectif: {parseInt(need.montantCible).toLocaleString()} Ar
                              </span>
                            )}
                            {need.quantiteCible && (
                              <span className="font-medium text-blue-600">
                                Objectif: {need.quantiteCible} {need.unite}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNeed(need.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Aucun besoin ajouté</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajoutez les besoins de votre projet pour faciliter les dons
                </p>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publier le projet
                  </>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              En publiant ce projet, vous acceptez qu'il soit visible par tous les donateurs de la plateforme
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectPublicationForm;