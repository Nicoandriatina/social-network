"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, AlertCircle, CheckCircle2, Heart } from "lucide-react";

const DonationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    libelle: '',
    type: 'MONETAIRE',
    quantite: '',
    destinationType: 'project', // project, etablissement, personnel
    destinationId: '',
    photos: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Charger les données initiales
      loadDestinations();
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const loadDestinations = async () => {
    // Charger les projets disponibles
    try {
      const projectsResponse = await fetch('/api/projects');
      if (projectsResponse.ok) {
        const data = await projectsResponse.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Erreur chargement projets:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
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
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
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
      photos: [...prev.photos, ...newPhotos].slice(0, 3)
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

    if (!formData.libelle.trim()) {
      newErrors.libelle = 'Le libellé est obligatoire';
    }

    if (!formData.destinationId) {
      newErrors.destinationId = 'Veuillez sélectionner une destination';
    }

    if (formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') {
      if (!formData.quantite || parseInt(formData.quantite) <= 0) {
        newErrors.quantite = 'La quantité est obligatoire pour ce type de don';
      }
    }

    return newErrors;
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
        libelle: formData.libelle,
        type: formData.type,
        quantite: formData.quantite ? parseInt(formData.quantite) : null,
        photos: formData.photos.map(photo => photo.base64),
        // Destination selon le type
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

      // Succès
      onSuccess(result.donation);
      onClose();
      
      // Reset form
      setFormData({
        libelle: '',
        type: 'MONETAIRE',
        quantite: '',
        destinationType: 'project',
        destinationId: '',
        photos: []
      });

    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Faire un don</h2>
              <p className="text-sm text-slate-500">Soutenez un projet ou un établissement</p>
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
          {/* Erreur générale */}
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
                  className={`p-3 border-2 rounded-xl text-center transition-all ${
                    formData.type === type.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-slate-500">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Libellé */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description du don *
            </label>
            <input
              type="text"
              value={formData.libelle}
              onChange={(e) => handleInputChange('libelle', e.target.value)}
              placeholder="Ex: Don de 500,000 Ar pour la rénovation"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.libelle ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {errors.libelle && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.libelle}
              </p>
            )}
          </div>

          {/* Quantité (si vivres ou non-vivres) */}
          {(formData.type === 'VIVRES' || formData.type === 'NON_VIVRES') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quantité *
              </label>
              <input
                type="number"
                value={formData.quantite}
                onChange={(e) => handleInputChange('quantite', e.target.value)}
                placeholder="Nombre d'unités"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.quantite ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {errors.quantite && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.quantite}
                </p>
              )}
            </div>
          )}

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Destination du don *
            </label>
            <select
              value={formData.destinationId}
              onChange={(e) => handleInputChange('destinationId', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                errors.destinationId ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500'
              }`}
            >
              <option value="">Sélectionnez un projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.titre} - {project.etablissement?.nom}
                </option>
              ))}
            </select>
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
                dragActive ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400'
              }`}
            >
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                Glissez vos photos ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-slate-500">
                JPG, PNG • Max 3 photos • 5MB chacune
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
              <div className="grid grid-cols-3 gap-3 mt-3">
                {formData.photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4" />
                Créer le don
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;