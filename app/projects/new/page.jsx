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
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   const categories = [
//     { value: 'construction', label: 'Construction', icon: '🏗️' },
//     { value: 'rehabilitation', label: 'Réhabilitation', icon: '🔧' },
//     { value: 'equipement', label: 'Équipement', icon: '💻' },
//     { value: 'formation', label: 'Formation', icon: '🎓' },
//     { value: 'autres', label: 'Autres', icon: '✨' }
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

//   const handleFiles = (files) => {
//     const newPhotos = Array.from(files).filter(file => {
//       const isImage = file.type.startsWith('image/');
//       const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
//       return isImage && isValidSize;
//     }).map(file => ({
//       id: Date.now() + Math.random(),
//       file,
//       url: URL.createObjectURL(file),
//       name: file.name
//     }));

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
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       alert('Projet publié avec succès!');
//       // Reset form
//       setFormData({
//         reference: '',
//         category: '',
//         title: '',
//         description: '',
//         startDate: '',
//         endDate: '',
//         budget: '',
//         photos: []
//       });
//     } catch (error) {
//       alert('Erreur lors de la publication du projet');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

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
            
//              <a href="/dashboard">
//              <button className="text-gray-600 hover:text-indigo-600 font-medium">
//                 ← Retour au tableau de bord
//               </button>
//              </a> 
            
//           </div>
//         </div>

//         {/* Main Form */}
//         <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
//               Publier un nouveau projet
//             </h2>
//             <p className="text-gray-600 text-lg">
//               Partagez votre projet avec la communauté pour trouver des donateurs
//             </p>
//           </div>

//           {/* Reference and Category */}
//           <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//             <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                 📋
//               </div>
//               Informations de base
//             </h3>
            
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Référence du projet *
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={formData.reference}
//                     onChange={(e) => handleInputChange('reference', e.target.value)}
//                     placeholder="REF-2024-001"
//                     className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                       errors.reference ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={generateReference}
//                     className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
//                   >
//                     Générer
//                   </button>
//                 </div>
//                 {errors.reference && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.reference}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Catégorie *
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => handleInputChange('category', e.target.value)}
//                   className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                     errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                   }`}
//                 >
//                   <option value="">Sélectionnez une catégorie</option>
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>
//                       {cat.icon} {cat.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.category && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.category}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Title and Description */}
//           <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//             <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                 ✏️
//               </div>
//               Détails du projet
//             </h3>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Titre du projet *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange('title', e.target.value)}
//                   placeholder="Ex: Rénovation de la bibliothèque du lycée"
//                   className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                     errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                   }`}
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   {formData.title.length}/100 caractères (minimum 10)
//                 </p>
//                 {errors.title && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.title}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description détaillée *
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   placeholder="Décrivez votre projet, ses objectifs, les bénéficiaires, l'impact attendu..."
//                   rows={6}
//                   className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                     errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                   }`}
//                 />
//                 <p className="mt-1 text-xs text-gray-500">
//                   {formData.description.length}/1000 caractères (minimum 50)
//                 </p>
//                 {errors.description && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Photos */}
//           <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//             <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                 📸
//               </div>
//               Photos du projet *
//             </h3>
            
//             <div
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//               className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
//                 dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
//               } ${errors.photos ? 'border-red-400 bg-red-50' : ''}`}
//             >
//               <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//               <h4 className="text-lg font-semibold text-gray-700 mb-2">
//                 Glissez vos photos ici ou cliquez pour sélectionner
//               </h4>
//               <p className="text-gray-500">
//                 JPG, PNG, GIF • Maximum 5 photos • 5MB max par photo
//               </p>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) => handleFiles(e.target.files)}
//                 className="hidden"
//               />
//             </div>

//             {errors.photos && (
//               <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.photos}
//               </p>
//             )}

//             {formData.photos.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
//                 {formData.photos.map(photo => (
//                   <div key={photo.id} className="relative group">
//                     <img
//                       src={photo.url}
//                       alt={photo.name}
//                       className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removePhoto(photo.id);
//                       }}
//                       className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Dates and Budget */}
//           <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//             <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                 📅
//               </div>
//               Planification
//             </h3>
            
//             <div className="grid md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Date de début souhaitée
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => handleInputChange('startDate', e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Date de fin souhaitée
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.endDate}
//                   onChange={(e) => handleInputChange('endDate', e.target.value)}
//                   className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
//                     errors.endDate ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
//                   }`}
//                 />
//                 {errors.endDate && (
//                   <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     {errors.endDate}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Budget estimé (Ar)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.budget}
//                   onChange={(e) => handleInputChange('budget', e.target.value)}
//                   placeholder="5000000"
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Section */}
//           <div className="text-center pt-6 border-t border-gray-200">
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//               <button
//                 type="button"
//                 className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
//               >
//                 Enregistrer comme brouillon
//               </button>
              
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-12 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Publication en cours...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle2 className="w-5 h-5" />
//                     Publier le projet
//                   </>
//                 )}
//               </button>
//             </div>
            
//             <p className="mt-4 text-sm text-gray-500">
//               En publiant ce projet, vous acceptez qu'il soit visible par tous les donateurs de la plateforme
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectPublicationForm;

"use client";

import React, { useState, useRef } from 'react';
import { Calendar, Upload, X, Plus, AlertCircle, CheckCircle2, Link } from 'lucide-react';

const ProjectPublicationForm = () => {
  const [formData, setFormData] = useState({
    reference: '',
    category: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    photos: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'CONSTRUCTION', label: 'Construction', icon: '🏗️' },
    { value: 'REHABILITATION', label: 'Réhabilitation', icon: '🔧' },
    { value: 'AUTRES', label: 'Autres', icon: '✨' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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

  // Fonction pour convertir les fichiers en base64
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
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isImage && isValidSize;
    });

    // Convertir les fichiers en base64
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
      photos: [...prev.photos, ...newPhotos].slice(0, 5) // Max 5 photos
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
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
      // Préparer les données pour l'API
      const projectData = {
        reference: formData.reference,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        photos: formData.photos.map(photo => photo.base64) // Envoyer en base64
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
          // Erreurs de validation spécifiques
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

      // Succès
      setSubmitSuccess(true);
      
      // Reset form après 3 secondes
      setTimeout(() => {
        setFormData({
          reference: '',
          category: '',
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          budget: '',
          photos: []
        });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    // Sauvegarder en tant que brouillon (optionnel)
    const draftData = {
      ...formData,
      isDraft: true
    };
    
    // Sauvegarder dans localStorage pour l'instant
    localStorage.setItem('projectDraft', JSON.stringify(draftData));
    alert('Brouillon sauvegardé !');
  };

  // Charger un brouillon au montage du composant
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('projectDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        if (confirm('Un brouillon a été trouvé. Voulez-vous le charger ?')) {
          setFormData(draftData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du brouillon:', error);
      }
    }
  }, []);

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Projet publié avec succès !</h2>
          <p className="text-gray-600 mb-6">Votre projet est maintenant visible par tous les donateurs.</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                MSN
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mada Social Network</h1>
                <p className="text-gray-600">Publication de projet</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              ← Retour au tableau de bord
            </button>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Publier un nouveau projet
              </h2>
              <p className="text-gray-600 text-lg">
                Partagez votre projet avec la communauté pour trouver des donateurs
              </p>
            </div>

            {/* Erreur générale */}
            {errors.form && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errors.form}</span>
                </div>
              </div>
            )}

            {/* Reference and Category */}
            <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📋
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
                      className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.reference ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={generateReference}
                      className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
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

            {/* Title and Description */}
            <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  ✏️
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
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
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
                    className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
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
            <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📸
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
                  dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
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
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dates and Budget */}
            <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                  📅
                </div>
                Planification
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de début souhaitée
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de fin souhaitée
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.endDate ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
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
                    Budget estimé (Ar)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="5000000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="text-center pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
                >
                  Enregistrer comme brouillon
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Publier le projet
                    </>
                  )}
                </button>
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                En publiant ce projet, vous acceptez qu'il soit visible par tous les donateurs de la plateforme
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectPublicationForm;