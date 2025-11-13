"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, MapPin, Edit, Share2, Heart, 
  DollarSign, Package, ShoppingCart, TrendingUp, Users,
  Target, CheckCircle, Clock, AlertCircle
} from 'lucide-react';

// Types
interface ProjectDetailsClientProps {
  projectId: string;
}

interface Project {
  id: string;
  reference: string;
  titre: string;
  description: string;
  categorie: string;
  photos: string[];
  budgetEstime?: number;
  datePublication: string;
  dateDebut?: string;
  dateFin?: string;
  createdAt: string;
  updatedAt: string;
  auteur: {
    id: string;
    fullName: string;
    avatar?: string;
    email: string;
  };
  etablissement: {
    id: string;
    nom: string;
    type: string;
    niveau: string;
    adresse?: string;
  };
  besoins: Array<{
    id: string;
    type: string;
    titre: string;
    description: string;
    montantCible?: number;
    quantiteCible?: number;
    unite?: string;
    montantRecu: number;
    quantiteRecue: number;
    pourcentage: number;
    statut: string;
    priorite: number;
    donCount: number;
    createdAt: string;
  }>;
  dons: Array<{
    id: string;
    libelle: string;
    type: string;
    quantite?: number;
    montant?: number;
    statut: string;
    dateEnvoi?: string;
    dateReception?: string;
    createdAt: string;
    donateur: {
      id: string;
      fullName: string;
      avatar?: string;
    };
    need?: {
      id: string;
      titre: string;
      type: string;
    };
  }>;
  stats: {
    donCount: number;
    totalRaised: number;
    uniqueDonors: number;
  };
}

// Hook personnalisé
const useProjectDetails = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    if (!projectId) {
      setError("ID du projet requis");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Client - Fetching project:', projectId);
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Projet non trouvé');
        }
        if (response.status === 401) {
          throw new Error('Vous devez être connecté pour voir ce projet');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la récupération du projet');
      }

      const data = await response.json();
      console.log('✅ Project loaded:', data.project?.titre);
      
      setProject(data.project);
      setError(null);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  return { project, loading, error, refreshProject: fetchProjectDetails };
};

// Composant principal
export default function ProjectDetailsClient({ projectId }: ProjectDetailsClientProps) {
  const router = useRouter();
  const { project, loading, error } = useProjectDetails(projectId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'CONSTRUCTION': 'Construction',
      'REHABILITATION': 'Réhabilitation', 
      'AUTRES': 'Autres'
    };
    return labels[category] || category;
  };

  const getNeedIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      'MONETAIRE': <DollarSign className="w-5 h-5" />,
      'MATERIEL': <Package className="w-5 h-5" />,
      'VIVRES': <ShoppingCart className="w-5 h-5" />
    };
    return icons[type] || <Package className="w-5 h-5" />;
  };

  const getNeedColor = (type: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; gauge: string }> = {
      'MONETAIRE': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', gauge: 'bg-green-500' },
      'MATERIEL': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', gauge: 'bg-blue-500' },
      'VIVRES': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', gauge: 'bg-orange-500' }
    };
    return colors[type] || colors['MATERIEL'];
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      'EN_COURS': <Clock className="w-4 h-4" />,
      'TERMINE': <CheckCircle className="w-4 h-4" />,
      'ANNULE': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || icons['EN_COURS'];
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'EN_COURS': 'bg-blue-100 text-blue-700 border-blue-300',
      'TERMINE': 'bg-green-100 text-green-700 border-green-300',
      'ANNULE': 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || colors['EN_COURS'];
  };

  const getPriorityLabel = (priority: number) => {
    const labels: Record<number, { text: string; color: string }> = {
      1: { text: 'Haute', color: 'bg-red-100 text-red-700' },
      2: { text: 'Moyenne', color: 'bg-yellow-100 text-yellow-700' },
      3: { text: 'Basse', color: 'bg-gray-100 text-gray-700' }
    };
    return labels[priority] || labels[2];
  };

  const goBack = () => router.push('/dashboard');
  const goToEdit = () => router.push(`/projects/${projectId}/edit`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du projet...</p>
          <p className="text-xs text-gray-400 mt-2">ID: {projectId}</p>
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
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-xs text-gray-400 mb-6">ID: {projectId}</p>
          <button onClick={goBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Détails du projet</h1>
              <p className="text-sm text-gray-500">{project.reference}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={goToEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Share2 className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {project.photos && project.photos.length > 0 && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-gray-100 relative">
                  <img src={project.photos[selectedImageIndex]} alt="Photo du projet" className="w-full h-full object-cover" />
                </div>
                {project.photos.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {project.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                      >
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-800">{project.titre}</h2>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                      {getCategoryLabel(project.categorie)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Publié le {formatDate(project.datePublication)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.etablissement?.adresse || 'Non spécifié'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>

              {(project.dateDebut || project.dateFin) && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Planification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.dateDebut && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date de début</label>
                        <div className="text-gray-800 font-medium">{formatDate(project.dateDebut)}</div>
                      </div>
                    )}
                    {project.dateFin && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date de fin</label>
                        <div className="text-gray-800 font-medium">{formatDate(project.dateFin)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {project.besoins && project.besoins.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Besoins du projet
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {project.besoins.filter(n => n.statut === 'TERMINE').length} / {project.besoins.length} complétés
                  </span>
                </h3>
                <div className="space-y-4">
                  {project.besoins.map((need) => {
                    const colors = getNeedColor(need.type);
                    const priorityInfo = getPriorityLabel(need.priorite);
                    const statusInfo = getStatusColor(need.statut);
                    const percentage = need.pourcentage || 0;
                    
                    return (
                      <div key={need.id} className={`p-5 rounded-xl border-2 ${colors.border} ${colors.bg}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.text} bg-white border-2 ${colors.border}`}>
                            {getNeedIcon(need.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-800">{need.titre}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>{priorityInfo.text}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusInfo}`}>
                                {getStatusIcon(need.statut)}
                                {need.statut === 'EN_COURS' ? 'En cours' : need.statut === 'TERMINE' ? 'Terminé' : 'Annulé'}
                              </span>
                            </div>
                            {need.description && <p className="text-sm text-gray-600 mb-3">{need.description}</p>}
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                  {need.type === 'MONETAIRE' ? 'Progression financière' : 'Progression'}
                                </span>
                                <span className={`font-bold ${colors.text}`}>{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="h-3 bg-white rounded-full overflow-hidden border-2 shadow-inner">
                                <div className={`h-full ${colors.gauge} transition-all duration-500`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                {need.type === 'MONETAIRE' ? (
                                  <>
                                    <span className="font-semibold text-green-700">{formatAmount(need.montantRecu || 0)} Ar</span>
                                    <span className="text-gray-500">sur {formatAmount(need.montantCible || 0)} Ar</span>
                                  </>
                                ) : (
                                  <>
                                    <span className={`font-semibold ${colors.text}`}>{need.quantiteRecue || 0} {need.unite}</span>
                                    <span className="text-gray-500">sur {need.quantiteCible || 0} {need.unite}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Progression globale</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {project.besoins.length > 0 
                        ? ((project.besoins.reduce((sum, n) => sum + (n.pourcentage || 0), 0) / project.besoins.length).toFixed(1))
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {project.dons && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Donations reçues ({project.dons.length})
                </h3>
                {project.dons.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Aucune donation pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {project.dons.slice(0, 5).map((don) => (
                      <div key={don.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {don.donateur?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AN'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{don.donateur?.fullName || 'Anonyme'}</div>
                            <div className="text-sm text-gray-600 mt-1">{don.libelle}</div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>Type: {don.type}</span>
                              {don.quantite && <span>• Quantité: {don.quantite}</span>}
                              {don.createdAt && <span>• {formatDate(don.createdAt)}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Donateurs</span>
                  </div>
                  <span className="font-bold text-blue-700">{project.stats?.uniqueDonors || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Collecté</span>
                  </div>
                  <span className="font-bold text-green-700">{formatAmount(project.stats?.totalRaised || 0)} Ar</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">Total dons</span>
                  </div>
                  <span className="font-bold text-purple-700">{project.stats?.donCount || 0}</span>
                </div>
                {project.besoins && project.besoins.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Besoins</span>
                    </div>
                    <span className="font-bold text-orange-700">{project.besoins.length}</span>
                  </div>
                )}
              </div>
            </div>

            {project.etablissement && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  Établissement
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Nom</div>
                    <div className="font-medium text-gray-800">{project.etablissement.nom}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Type</div>
                    <div className="font-medium text-gray-800">
                      {project.etablissement.type === 'PUBLIC' ? 'Public' : 'Privé'} • {project.etablissement.niveau}
                    </div>
                  </div>
                  {project.etablissement.adresse && (
                    <div>
                      <div className="text-sm text-gray-500">Adresse</div>
                      <div className="font-medium text-gray-800">{project.etablissement.adresse}</div>
                    </div>
                  )}
                  {project.auteur && (
                    <div>
                      <div className="text-sm text-gray-500">Responsable</div>
                      <div className="font-medium text-gray-800">{project.auteur.fullName}</div>
                      <div className="text-sm text-gray-500">{project.auteur.email}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button onClick={goToEdit} className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg flex items-center justify-center gap-2 font-medium">
                  <Edit className="w-4 h-4" />
                  Modifier le projet
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Télécharger le rapport
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Contacter les donateurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}