// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Upload, X, AlertCircle, CheckCircle2, Save } from 'lucide-react';

// // Hook pour récupérer et modifier un projet
// const useProjectEdit = (projectId) => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchProject = async () => {
//     if (!projectId) {
//       setError("ID du projet requis");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(`/api/projects/${projectId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error('Projet non trouvé');
//         }
//         if (response.status === 401) {
//           throw new Error('Vous devez être connecté');
//         }
//         if (response.status === 403) {
//           throw new Error('Vous n\'avez pas les permissions pour modifier ce projet');
//         }
//         throw new Error('Erreur lors de la récupération du projet');
//       }

//       const data = await response.json();
//       setProject(data.project);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Une erreur est survenue');
//       console.error('Erreur lors de la récupération du projet:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProject = async (updateData) => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch(`/api/projects/${projectId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         if (response.status === 403) {
//           throw new Error('Vous n\'avez pas les permissions pour modifier ce projet');
//         }
//         throw new Error(result.error || 'Erreur lors de la modification');
//       }

//       const result = await response.json();
//       await fetchProject(); // Rafraîchir les données
//       return { success: true, message: result.message };
//     } catch (err) {
//       throw new Error(err instanceof Error ? err.message : 'Erreur lors de la modification');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     fetchProject();
//   }, [projectId]);

//   return {
//     project,
//     loading,
//     error,
//     updateProject,
//     isSubmitting
//   };
// };

// const ProjectEditPage = ({ projectId } = {}) => {
//   // Récupération correcte de l'ID depuis l'URL pour l'édition
//   // Pour une URL comme /projects/abc123/edit, on prend l'avant-dernier segment
//   const actualProjectId = projectId || (typeof window !== 'undefined' ? 
//     window.location.pathname.split('/').slice(-2, -1)[0] : null
//   );
  
//   console.log('ProjectEditPage - URL:', typeof window !== 'undefined' ? window.location.pathname : 'SSR');
//   console.log('ProjectEditPage - projectId prop:', projectId);
//   console.log('ProjectEditPage - actualProjectId:', actualProjectId);
  
//   const { project, loading, error, updateProject, isSubmitting } = useProjectEdit(actualProjectId);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     startDate: '',
//     endDate: '',
//     photos: []
//   });
//   const [errors, setErrors] = useState({});
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef(null);

//   // Initialiser le formulaire avec les données du projet
//   useEffect(() => {
//     if (project) {
//       setFormData({
//         title: project.titre || '',
//         description: project.description || '',
//         category: project.categorie || '',
//         startDate: project.dateDebut ? project.dateDebut.split('T')[0] : '',
//         endDate: project.dateFin ? project.dateFin.split('T')[0] : '',
//         photos: project.photos?.map(url => ({
//           id: Date.now() + Math.random(),
//           url: url,
//           isExisting: true
//         })) || []
//       });
//     }
//   }, [project]);

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
    
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
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

//     const photoPromises = validFiles.map(async (file) => ({
//       id: Date.now() + Math.random(),
//       file,
//       url: URL.createObjectURL(file),
//       name: file.name,
//       base64: await fileToBase64(file),
//       isExisting: false
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

//   const validateForm = () => {
//     const newErrors = {};

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

//     if (!formData.category) {
//       newErrors.category = 'La catégorie est obligatoire';
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

//     try {
//       const updateData = {
//         title: formData.title,
//         description: formData.description,
//         category: formData.category,
//         startDate: formData.startDate || null,
//         endDate: formData.endDate || null,
//         photos: formData.photos.map(photo => 
//           photo.isExisting ? photo.url : photo.base64
//         )
//       };

//       const result = await updateProject(updateData);
//       setSubmitSuccess(true);
      
//       setTimeout(() => {
//         setSubmitSuccess(false);
//       }, 3000);

//     } catch (error) {
//       console.error('Erreur:', error);
//       setErrors({ form: error.message });
//     }
//   };

//   const goBack = () => {
//     if (typeof window !== 'undefined') {
//       window.history.back();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-white">Chargement du projet...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center">
//         <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={goBack}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Retour
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (submitSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6 flex items-center justify-center">
//         <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md text-center">
//           <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Projet modifié avec succès !</h2>
//           <p className="text-gray-600 mb-6">Vos modifications ont été enregistrées.</p>
//           <div className="flex gap-3 justify-center">
//             <button 
//               onClick={() => window.location.href = `/projects/${actualProjectId}`}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
//             >
//               Voir le projet
//             </button>
//             <button 
//               onClick={() => window.location.href = '/dashboard'}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
//             >
//               Tableau de bord
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!project) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={goBack}
//                 className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 Retour
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Modifier le projet</h1>
//                 <p className="text-gray-600">{project.reference}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Form */}
//         <div>
//           <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
//             {/* Erreur générale */}
//             {errors.form && (
//               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <AlertCircle className="w-5 h-5" />
//                   <span className="font-medium">{errors.form}</span>
//                 </div>
//               </div>
//             )}

//             {/* Catégorie */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   📋
//                 </div>
//                 Catégorie du projet
//               </h3>
              
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
//                         alt="Photo du projet"
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

//             {/* Dates */}
//             <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-200/50">
//               <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6">
//                 <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
//                   📅
//                 </div>
//                 Planification
//               </h3>
              
//               <div className="grid md:grid-cols-2 gap-6">
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
//               </div>
//             </div>

//             {/* Submit Section */}
//             <div className="text-center pt-6 border-t border-gray-200">
//               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                 <button
//                   type="button"
//                   onClick={goBack}
//                   className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold"
//                 >
//                   Annuler
//                 </button>
                
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isSubmitting}
//                   className="px-12 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Enregistrement...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5" />
//                       Enregistrer les modifications
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectEditPage;

// app/projects/[id]/edit/page.tsx
import ProjectEditClient from './ProjectEditClient';

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    console.error('❌ No project ID provided for edit');
    return <div>Erreur : ID de projet manquant</div>;
  }

  console.log('✅ Server - Editing project:', resolvedParams.id);
  
  return <ProjectEditClient projectId={resolvedParams.id} />;
}