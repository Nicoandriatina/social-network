"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { 
  ArrowLeft, Upload, X, AlertCircle, CheckCircle2, Save,
  DollarSign, Package, ShoppingCart, Plus, Trash2, Calendar
} from 'lucide-react';

interface ProjectEditClientProps {
  projectId: string;
}

const useProjectEdit = (projectId: string) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProject = async () => {
    if (!projectId) {
      setError("ID du projet requis");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('Projet non trouvé');
        if (response.status === 401) throw new Error('Vous devez être connecté');
        if (response.status === 403) throw new Error('Vous n\'avez pas les permissions');
        throw new Error('Erreur lors de la récupération du projet');
      }

      const data = await response.json();
      setProject(data.project);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updateData: any) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Envoi des données de mise à jour:', updateData);
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas les permissions');
        }
        throw new Error(result.error || 'Erreur lors de la modification');
      }

      const result = await response.json();
      console.log('✅ Réponse de l\'API:', result);
      await fetchProject();
      return { success: true, message: result.message };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return { project, loading, error, updateProject, isSubmitting };
};

export default function ProjectEditClient({ projectId }: ProjectEditClientProps) {
  const router = useRouter();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const { project, loading, error, updateProject, isSubmitting } = useProjectEdit(projectId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    coutTotalProjet: '',
    budgetDisponible: '',
    photos: [] as any[],
    needs: [] as any[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthor = currentUser && project?.auteur?.id === currentUser.id;

  const categories = [
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'REHABILITATION', label: 'Réhabilitation' },
    { value: 'AUTRES', label: 'Autres' }
  ];

  const needTypes = [
    { value: 'MONETAIRE', label: 'Monétaire', icon: <DollarSign className="w-5 h-5" /> },
    { value: 'MATERIEL', label: 'Matériel', icon: <Package className="w-5 h-5" /> },
    { value: 'VIVRES', label: 'Vivres', icon: <ShoppingCart className="w-5 h-5" /> }
  ];

  const priorityLevels = [
    { value: 1, label: 'Haute', color: 'bg-red-100 text-red-700' },
    { value: 2, label: 'Moyenne', color: 'bg-yellow-100 text-yellow-700' },
    { value: 3, label: 'Basse', color: 'bg-gray-100 text-gray-700' }
  ];

  useEffect(() => {
    if (project) {
      const mainMonetaryNeed = project.besoins?.find(
        (n: any) => n.type === 'MONETAIRE' && n.budgetInclusDansCalcul
      );
      const coutTotal = mainMonetaryNeed?.montantCible || 0;

      setFormData({
        title: project.titre || '',
        description: project.description || '',
        category: project.categorie || '',
        startDate: project.dateDebut ? project.dateDebut.split('T')[0] : '',
        endDate: project.dateFin ? project.dateFin.split('T')[0] : '',
        coutTotalProjet: coutTotal.toString(),
        budgetDisponible: project.budgetDisponible?.toString() || '0',
        photos: project.photos?.map((url: string) => ({
          id: Date.now() + Math.random(),
          url: url,
          isExisting: true
        })) || [],
        needs: project.besoins?.filter((need: any) => !need.budgetInclusDansCalcul).map((need: any) => ({
          id: need.id,
          type: need.type,
          titre: need.titre,
          description: need.description,
          montantCible: need.montantCible?.toString() || '',
          quantiteCible: need.quantiteCible?.toString() || '',
          unite: need.unite || '',
          priorite: need.priorite,
          isExisting: true,
          typeInfo: needTypes.find(t => t.value === need.type)
        })) || []
      });
    }
  }, [project]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFiles = async (files: FileList) => {
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
      base64: await fileToBase64(file),
      isExisting: false
    }));

    const newPhotos = await Promise.all(photoPromises);
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 5)
    }));
  };

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleNeedInputChange = (field: string, value: any) => {
    setCurrentNeed(prev => ({ ...prev, [field]: value }));
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
      typeInfo: needTypeInfo,
      isExisting: false
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

  const removeNeed = (needId: number | string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.filter(need => need.id !== needId)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    if (!formData.category) {
      newErrors.category = 'La catégorie est obligatoire';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (!formData.coutTotalProjet || parseFloat(formData.coutTotalProjet) <= 0) {
      newErrors.coutTotalProjet = 'Le coût total du projet est obligatoire';
    }

    if (!formData.budgetDisponible || parseFloat(formData.budgetDisponible) < 0) {
      newErrors.budgetDisponible = 'Le budget disponible est obligatoire';
    }

    if (formData.coutTotalProjet && formData.budgetDisponible) {
      if (parseFloat(formData.budgetDisponible) > parseFloat(formData.coutTotalProjet)) {
        newErrors.budgetDisponible = 'Le budget disponible ne peut pas dépasser le coût total';
      }
    }

    if (formData.photos.length === 0) {
      newErrors.photos = 'Au moins une photo est requise';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        coutTotalProjet: parseFloat(formData.coutTotalProjet),
        budgetDisponible: parseFloat(formData.budgetDisponible),
        photos: formData.photos.map(photo => 
          photo.isExisting ? photo.url : photo.base64
        ),
        needs: formData.needs.map(need => ({
          id: need.isExisting ? need.id : undefined,
          type: need.type,
          titre: need.titre,
          description: need.description,
          montantCible: need.montantCible ? parseFloat(need.montantCible) : null,
          quantiteCible: need.quantiteCible ? parseInt(need.quantiteCible) : null,
          unite: need.unite,
          priorite: need.priorite
        }))
      };

      await updateProject(updateData);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        router.push(`/projects/${projectId}`);
      }, 2000);

    } catch (error: any) {
      console.error('Erreur:', error);
      setErrors({ form: error.message });
    }
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthor && !userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions pour modifier ce projet.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voir le projet
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Modifications enregistrées !</h2>
          <p className="text-gray-600 mb-6">Redirection vers le projet...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Modifier le projet</h1>
                <p className="text-gray-600">{project.reference}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errors.form}</span>
              </div>
            </div>
          )}

          {/* Informations générales */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Informations générales
            </h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl ${
                      errors.category ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
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
                      className={`w-full px-4 py-3 border-2 rounded-xl ${
                        errors.endDate ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl ${
                    errors.title ? 'border-red-400' : 'border-gray-200'
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
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl resize-none ${
                    errors.description ? 'border-red-400' : 'border-gray-200'
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

          {/* Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Budget du projet
            </h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Comment ça fonctionne ?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Coût total</strong>: Montant nécessaire pour réaliser le projet</li>
                    <li>• <strong>Budget disponible</strong>: Ce que votre établissement a déjà</li>
                    <li>• <strong>À collecter</strong>: La différence sera proposée aux donateurs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coût total du projet (Ar) *
                </label>
                <input
                  type="number"
                  value={formData.coutTotalProjet}
                  onChange={(e) => handleInputChange('coutTotalProjet', e.target.value)}
                  placeholder="10000000"
                  className={`w-full px-4 py-3 border-2 rounded-xl ${
                    errors.coutTotalProjet ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formData.coutTotalProjet && (
                  <p className="mt-1 text-xs text-gray-600">
                    {parseInt(formData.coutTotalProjet).toLocaleString()} Ariary
                  </p>
                )}
                {errors.coutTotalProjet && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.coutTotalProjet}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget déjà disponible (Ar) *
                </label>
                <input
                  type="number"
                  value={formData.budgetDisponible}
                  onChange={(e) => handleInputChange('budgetDisponible', e.target.value)}
                  placeholder="2000000"
                  className={`w-full px-4 py-3 border-2 rounded-xl ${
                    errors.budgetDisponible ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {formData.budgetDisponible && (
                  <p className="mt-1 text-xs text-gray-600">
                    {parseInt(formData.budgetDisponible).toLocaleString()} Ariary
                  </p>
                )}
                {errors.budgetDisponible && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.budgetDisponible}
                  </p>
                )}
              </div>
            </div>

            {formData.coutTotalProjet && formData.budgetDisponible && (
              <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Montant à collecter:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {Math.max(0, parseInt(formData.coutTotalProjet) - parseInt(formData.budgetDisponible)).toLocaleString()} Ar
                  </span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ 
                      width: `${Math.min(100, (parseInt(formData.budgetDisponible) / parseInt(formData.coutTotalProjet)) * 100)}%` 
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>Budget actuel: {((parseInt(formData.budgetDisponible) / parseInt(formData.coutTotalProjet)) * 100).toFixed(1)}%</span>
                  <span>Objectif: 100%</span>
                </div>
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Photos du projet *</h3>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              } ${errors.photos ? 'border-red-400' : ''}`}
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
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
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
                      alt="Photo"
                      className="w-full h-24 object-cover rounded-xl border-2"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Besoins additionnels */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Besoins additionnels</h3>
              <button
                type="button"
                onClick={() => setShowNeedForm(!showNeedForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Ajouter un besoin
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Le besoin monétaire principal est calculé automatiquement à partir du coût total et du budget disponible. Ajoutez ici les besoins additionnels (matériel, vivres, etc.)
              </p>
            </div>

            {showNeedForm && (
              <div className="p-6 bg-gray-50 rounded-xl border-2 mb-6">
                <h4 className="font-semibold mb-4">Nouveau besoin</h4>
                <div className="space-y-4">
                  <select
                    value={currentNeed.type}
                    onChange={(e) => handleNeedInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  >
                    <option value="">Type de besoin</option>
                    {needTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={currentNeed.titre}
                    onChange={(e) => handleNeedInputChange('titre', e.target.value)}
                    placeholder="Titre du besoin"
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  />

                  <textarea
                    value={currentNeed.description}
                    onChange={(e) => handleNeedInputChange('description', e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-3 border-2 rounded-lg"
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    {currentNeed.type === 'MONETAIRE' && (
                      <input
                        type="number"
                        value={currentNeed.montantCible}
                        onChange={(e) => handleNeedInputChange('montantCible', e.target.value)}
                        placeholder="Montant cible (Ar)"
                        className="w-full px-4 py-3 border-2 rounded-lg"
                      />
                    )}

                    {(currentNeed.type === 'MATERIEL' || currentNeed.type === 'VIVRES') && (
                      <>
                        <input
                          type="number"
                          value={currentNeed.quantiteCible}
                          onChange={(e) => handleNeedInputChange('quantiteCible', e.target.value)}
                          placeholder="Quantité"
                          className="w-full px-4 py-3 border-2 rounded-lg"
                        />
                        <input
                          type="text"
                          value={currentNeed.unite}
                          onChange={(e) => handleNeedInputChange('unite', e.target.value)}
                          placeholder="Unité (kg, pièces...)"
                          className="w-full px-4 py-3 border-2 rounded-lg"
                        />
                      </>
                    )}

                    <select
                      value={currentNeed.priorite}
                      onChange={(e) => handleNeedInputChange('priorite', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 rounded-lg"
                    >
                      {priorityLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowNeedForm(false)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={addNeed}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {formData.needs.length > 0 ? (
              <div className="space-y-4">
                {formData.needs.map(need => (
                  <div key={need.id} className="p-4 bg-gray-50 rounded-xl border-2 flex items-start justify-between hover:border-blue-300 transition-all">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        need.type === 'MONETAIRE' ? 'bg-green-100 text-green-600' :
                        need.type === 'MATERIEL' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {need.typeInfo?.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{need.titre}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            priorityLevels.find(p => p.value === need.priorite)?.color
                          }`}>
                            {priorityLevels.find(p => p.value === need.priorite)?.label}
                          </span>
                        </div>
                        {need.description && (
                          <p className="text-sm text-gray-600 mb-2">{need.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">Type: {need.typeInfo?.label || need.type}</span>
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Aucun besoin additionnel</p>
                <p className="text-sm text-gray-400 mt-1">
                  Le besoin monétaire principal est géré automatiquement
                </p>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={() => router.back()}
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
                    Enregistrement en cours...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              Les modifications seront visibles immédiatement après l'enregistrement
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}