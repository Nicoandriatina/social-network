"use client";
import React, { useState, useRef } from 'react';
import { 
  Calendar, Upload, X, Plus, AlertCircle, CheckCircle2, 
  DollarSign, Package, ShoppingCart, Trash2, ChevronDown,
  ArrowLeft, ArrowRight, Save, FileText, Image, Target, Check
} from 'lucide-react';

const ProjectPublicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    reference: '',
    category: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    coutTotalProjet: '',
    budgetDisponible: '',
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

  // Définition des étapes
  const steps = [
    { id: 1, title: 'Informations', icon: FileText, desc: 'Détails du projet' },
    { id: 2, title: 'Budget', icon: DollarSign, desc: 'Coûts et financement' },
    { id: 3, title: 'Photos', icon: Image, desc: 'Images du projet' },
    { id: 4, title: 'Besoins', icon: Target, desc: 'Ressources nécessaires' },
    { id: 5, title: 'Confirmation', icon: Check, desc: 'Vérification finale' }
  ];

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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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

  const handleNeedInputChange = (field, value) => {
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
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
    }

    if (step === 2) {
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
    }

    if (step === 3) {
      if (formData.photos.length === 0) {
        newErrors.photos = 'Au moins une photo est requise';
      }
    }

    if (step === 4) {
      if (formData.needs.length === 0) {
        newErrors.needs = 'Ajoutez au moins un besoin pour votre projet';
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
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
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
        coutTotalProjet: parseFloat(formData.coutTotalProjet),
        budgetDisponible: parseFloat(formData.budgetDisponible),
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
        headers: { 'Content-Type': 'application/json' },
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

  // Rendu du contenu selon l'étape
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

            <div className="grid md:grid-cols-2 gap-6">
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
                  Date de fin estimée
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.coutTotalProjet ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.budgetDisponible ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
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
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Montant à collecter via la plateforme:</span>
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
        );

      case 3:
        return (
          <div className="space-y-6">
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
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.photos}
              </p>
            )}

            {formData.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
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
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucune photo ajoutée</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Liste des besoins</h3>
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
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.needs}
                </p>
              </div>
            )}

            {showNeedForm && (
              <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Nouveau besoin</h4>
                
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
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Aucun besoin ajouté</p>
                <p className="text-sm text-gray-400 mt-1">
                  Ajoutez les besoins de votre projet pour faciliter les dons
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Récapitulatif de votre projet</h3>
              </div>
              <p className="text-sm text-gray-600">
                Vérifiez toutes les informations avant de publier votre projet
              </p>
            </div>

            {/* Informations générales */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Informations générales
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence:</span>
                  <span className="font-medium text-gray-800">{formData.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="font-medium text-gray-800">
                    {categories.find(c => c.value === formData.category)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Titre:</span>
                  <span className="font-medium text-gray-800">{formData.title}</span>
                </div>
                {formData.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de début:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(formData.startDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {formData.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de fin:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(formData.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Budget
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Coût total:</span>
                  <span className="font-bold text-gray-800">
                    {parseInt(formData.coutTotalProjet).toLocaleString()} Ar
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget disponible:</span>
                  <span className="font-medium text-gray-800">
                    {parseInt(formData.budgetDisponible).toLocaleString()} Ar
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-dashed">
                  <span className="text-gray-600 font-semibold">À collecter:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {Math.max(0, parseInt(formData.coutTotalProjet) - parseInt(formData.budgetDisponible)).toLocaleString()} Ar
                  </span>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-600" />
                Photos ({formData.photos.length})
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {formData.photos.map(photo => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                  />
                ))}
              </div>
            </div>

            {/* Besoins */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Besoins du projet ({formData.needs.length})
              </h4>
              <div className="space-y-3">
                {formData.needs.map(need => (
                  <div key={need.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      need.type === 'MONETAIRE' ? 'bg-green-100 text-green-600' :
                      need.type === 'MATERIEL' ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {need.typeInfo.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{need.titre}</p>
                      <p className="text-xs text-gray-600">
                        {need.montantCible && `${parseInt(need.montantCible).toLocaleString()} Ar`}
                        {need.quantiteCible && `${need.quantiteCible} ${need.unite}`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(need.priorite)}`}>
                      {priorityLevels.find(p => p.value === need.priorite)?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Description du projet</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {formData.description}
              </p>
            </div>

            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.form}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header avec indicateur d'étapes */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Publier un nouveau projet</h1>
              <p className="text-gray-600">Étape {currentStep} sur {steps.length}</p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center hidden md:block">
                    <p className={`text-xs font-medium ${
                      currentStep >= step.id ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ligne de connexion */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </button>

            <div className="text-sm text-gray-500">
              Étape {currentStep} / {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publier le projet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPublicationForm;