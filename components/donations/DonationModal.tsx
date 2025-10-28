"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, AlertCircle, Heart, Building2, GraduationCap, FileText, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";

const ImprovedDonationModalV2 = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'MONETAIRE',
    montant: '',
    items: [],
    destinationType: 'project',
    destinationId: '',
    photos: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour les destinations
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [currentItem, setCurrentItem] = useState({ name: '', quantity: '' });

  // Fermer le dropdown si on clique à l'extérieur
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
      loadDestinations();
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, formData.destinationType]);

  const loadDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const response = await fetch('/api/donations/destinations');
      if (response.ok) {
        const data = await response.json();
        
        // Sélectionner les bonnes destinations selon le type
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'destinationType') {
      setFormData(prev => ({
        ...prev,
        destinationId: ''
      }));
      setSearchTerm('');
      loadDestinations();
    }

    if (field === 'type') {
      setFormData(prev => ({
        ...prev,
        items: [],
        montant: ''
      }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.destinationId) {
      newErrors.destinationId = 'Veuillez sélectionner un bénéficiaire';
    }

    if (formData.type === 'MONETAIRE') {
      if (!formData.montant || parseFloat(formData.montant) <= 0) {
        newErrors.montant = 'Le montant est obligatoire';
      }
    } else {
      if (formData.items.length === 0) {
        newErrors.items = 'Veuillez ajouter au moins un article';
      }
    }

    return newErrors;
  };

  const generateLibelle = () => {
    if (formData.type === 'MONETAIRE') {
      const montantFormate = new Intl.NumberFormat('fr-MG').format(parseInt(formData.montant) || 0);
      return `Don de ${montantFormate} Ar`;
    } else {
      const totalItems = formData.items.length;
      const itemNames = formData.items.map(item => item.name).join(', ');
      return `Don de ${totalItems} article${totalItems > 1 ? 's' : ''}: ${itemNames}`;
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const donationData = {
        libelle: generateLibelle(),
        type: formData.type,
        montant: formData.type === 'MONETAIRE' ? parseFloat(formData.montant) : undefined,
        items: formData.type !== 'MONETAIRE' ? formData.items : undefined,
        photos: formData.photos.map(photo => photo.base64),
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
      
      setFormData({
        type: 'MONETAIRE',
        montant: '',
        items: [],
        destinationType: 'project',
        destinationId: '',
        photos: []
      });
      setCurrentItem({ name: '', quantity: '' });
      setSearchTerm('');

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

  const formatNumber = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('fr-MG').format(parseInt(value));
  };

  // Filtrer les destinations selon la recherche
  const filteredDestinations = destinations.filter(dest => {
    const searchLower = searchTerm.toLowerCase();
    const name = (dest.nom || dest.fullName || dest.titre || '').toLowerCase();
    const secondary = (dest.type || dest.niveau || dest.etablissementNom || '').toLowerCase();
    return name.includes(searchLower) || secondary.includes(searchLower);
  });

  // Limiter à 10 résultats
  const displayedDestinations = filteredDestinations.slice(0, 10);

  // Trouver la destination sélectionnée
  const selectedDestination = destinations.find(d => d.id === formData.destinationId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-slate-200 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Faire un don</h2>
              <p className="text-sm text-slate-500">Soutenez l'éducation malgache</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{errors.form}</span>
              </div>
            </div>
          )}

          {/* Type de don */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Type de don *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'MONETAIRE', label: 'Monétaire', icon: '💰', desc: 'Don en argent' },
                { value: 'VIVRES', label: 'Vivres', icon: '🍎', desc: 'Nourriture' },
                { value: 'NON_VIVRES', label: 'Matériel', icon: '📚', desc: 'Équipements' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    formData.type === type.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-semibold">{type.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Montant (si monétaire) */}
          {formData.type === 'MONETAIRE' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                💰 Montant en Ariary *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.montant}
                  onChange={(e) => handleInputChange('montant', e.target.value)}
                  placeholder="Exemple: 500000"
                  className={`w-full px-4 py-4 pr-16 border-2 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.montant ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500 bg-white'
                  }`}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-bold text-lg">
                  Ar
                </span>
              </div>
              {formData.montant && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-slate-600">
                    Montant: <span className="font-bold text-green-600 text-lg">{formatNumber(formData.montant)} Ariary</span>
                  </p>
                </div>
              )}
              {errors.montant && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.montant}
                </p>
              )}
            </div>
          )}

          {/* Articles (si vivres ou non-vivres) */}
          {(formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                📦 Articles à donner *
              </label>
              
              {formData.items.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-slate-600 font-medium">Articles ajoutés ({formData.items.length}):</p>
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{formData.type === 'VIVRES' ? '🍎' : '📚'}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-sm text-slate-500">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-dashed border-blue-300">
                <p className="text-sm font-medium text-slate-700">Ajouter un article</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={formData.type === 'VIVRES' ? 'Ex: Riz, Huile...' : 'Ex: Cahiers, Stylos...'}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Quantité"
                      min="1"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter cet article
                </button>
              </div>

              {errors.items && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.items}
                </p>
              )}
            </div>
          )}

          {/* Type de destination */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              À qui souhaitez-vous faire ce don ? *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    <div className="flex items-center gap-3 mb-2">
                      <TypeIcon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{typeInfo.label}</span>
                    </div>
                    <p className="text-xs text-slate-500">{typeInfo.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sélection du bénéficiaire AVEC RECHERCHE */}
          <div ref={dropdownRef}>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Bénéficiaire * <span className="text-xs font-normal text-slate-500">(Tapez pour rechercher)</span>
            </label>
            
            {loadingDestinations ? (
              <div className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-2"></div>
                <span className="text-slate-600">Chargement...</span>
              </div>
            ) : (
              <div className="relative">
                {/* Barre de recherche */}
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

                {/* Affichage de la sélection actuelle */}
                {selectedDestination && !isDropdownOpen && (
                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <AvatarDisplay
                      name={selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
                      avatar={selectedDestination.avatar}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {selectedDestination.nom || selectedDestination.fullName || selectedDestination.titre}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedDestination.type || selectedDestination.niveau || selectedDestination.etablissementNom}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, destinationId: '' }));
                        setSearchTerm('');
                      }}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Dropdown des résultats */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50">
                    {displayedDestinations.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        {searchTerm ? 
                          `Aucun résultat pour "${searchTerm}"` : 
                          `Aucun ${getDestinationTypeInfo(formData.destinationType).label.toLowerCase()} disponible`
                        }
                      </div>
                    ) : (
                      <>
                        {displayedDestinations.map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              handleInputChange('destinationId', option.id);
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                            className={`w-full p-3 text-left transition-all flex items-center gap-3 border-b border-slate-100 last:border-b-0 ${
                              formData.destinationId === option.id
                                ? 'bg-emerald-50'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* Avatar avec AvatarDisplay */}
                            <AvatarDisplay
                              name={option.nom || option.fullName || option.titre}
                              avatar={option.avatar}
                              size="sm"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {option.nom || option.fullName || option.titre}
                              </p>
                              {(option.type || option.niveau || option.etablissementNom) && (
                                <p className="text-sm text-slate-500 truncate">
                                  {option.type || option.niveau || option.etablissementNom}
                                </p>
                              )}
                            </div>

                            {formData.destinationId === option.id && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                        
                        {/* Indicateur si plus de résultats */}
                        {filteredDestinations.length > 10 && (
                          <div className="p-3 bg-slate-50 text-center text-sm text-slate-600">
                            {filteredDestinations.length - 10} autre(s) résultat(s). 
                            <span className="text-emerald-600 font-medium"> Affinez votre recherche.</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {errors.destinationId && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.destinationId}
              </p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Photos (optionnel)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">
                Glissez vos photos ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG • Max 5 photos • 5MB chacune
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
              <div className="grid grid-cols-5 gap-3 mt-3">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white flex items-center justify-between gap-3 p-6 border-t border-slate-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Créer le don
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDonationModalV2;