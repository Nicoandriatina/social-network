// components/ProfilComponent/ProfileViewEtablissement.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  FileText,
  Gift,
  Lock,
  MessageCircle,
  UserPlus,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  Package,
  Send,
  Share2,
  Heart,
  MessageSquare,
  ExternalLink,
  User,
  Target,
  TrendingUp,
  Award,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  titre: string;
  description: string;
  reference: string;
  photos: string[];
  categorie: string;
  datePublication: string;
  auteur?: {
    fullName: string;
    avatar?: string;
  };
  donCount?: number;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
};

type Donation = {
  id: string;
  libelle: string;
  type: string;
  quantite: number | null;
  montant: number | null;
  statut: string;
  dateEnvoi?: string;
  dateReception?: string;
  createdAt: string;
  donateur?: {
    fullName: string;
    avatar?: string;
  };
  project?: {
    titre: string;
    id: string;
  };
};

type SharedProject = {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  photos: string[];
  etablissement?: {
    nom: string;
  };
  auteur: {
    fullName: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  sharedAt: string;
};

type Stats = {
  totalProjects: number;
  totalDonations: number;
  totalAmount: number;
  totalDonors: number;
};

type ProfileViewProps = {
  profile: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
    telephone?: string;
    facebook?: string;
    twitter?: string;
    adressePostale?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    etablissement?: {
      nom: string;
      type: string;
      niveau: string;
      adresse?: string;
      anneeCreation?: number;
      nbEleves?: number;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewEtablissement({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalDonors: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"projets" | "donations" | "shared">("projets");

  useEffect(() => {
    fetchEtablissementData();
  }, [profile.id]);

  const fetchEtablissementData = async () => {
    setLoading(true);
    setError(null);
    
    if (!profile.id) {
      setError("ID de profil manquant");
      setLoading(false);
      return;
    }
    
    try {
      const [projectsRes, donationsRes, sharedRes, statsRes] = await Promise.all([
        fetch(`/api/etablissements/${profile.id}/projects`, { credentials: "include" }),
        fetch(`/api/etablissements/${profile.id}/donations`, { credentials: "include" }),
        fetch(`/api/etablissements/${profile.id}/shared-projects`, { credentials: "include" }),
        fetch(`/api/etablissements/${profile.id}/stats`, { credentials: "include" })
      ]);
      
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
      }

      if (donationsRes.ok) {
        const data = await donationsRes.json();
        setDonations(data.donations || []);
      }

      if (sharedRes.ok) {
        const data = await sharedRes.json();
        setSharedProjects(data.projects || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats || stats);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    router.push(`/messages?userId=${profile.id}`);
  };

  const formatMontant = (montant: number | null) => {
    if (!montant) return "0";
    return new Intl.NumberFormat('fr-MG').format(montant);
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      EN_ATTENTE: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
      ENVOYE: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      RECEPTIONNE: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" }
    };
    return badges[statut as keyof typeof badges] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
  };

  const getStatutLabel = (statut: string) => {
    const labels = {
      EN_ATTENTE: "En attente",
      ENVOYE: "Envoyé",
      RECEPTIONNE: "Réceptionné"
    };
    return labels[statut as keyof typeof labels] || statut;
  };

  const getStatutIcon = (statut: string) => {
    const icons = {
      EN_ATTENTE: Clock,
      ENVOYE: Send,
      RECEPTIONNE: CheckCircle
    };
    return icons[statut as keyof typeof icons] || Clock;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo + Profile Info */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-80 md:h-96 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-b-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Header */}
          <div className="px-4 md:px-6 pb-4">
            <div className="relative">
              {/* Avatar */}
              <div className="absolute -top-24 md:-top-32">
                <div className="bg-white rounded-full p-2 shadow-xl">
                  <AvatarDisplay
                    name={profile.nom}
                    avatar={profile.avatar}
                    size="2xl"
                    className="w-32 h-32 md:w-40 md:h-40"
                  />
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex justify-end pt-4 gap-3">
                {profile.isFriend ? (
                  <>
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Message
                    </button>
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Partenaire
                    </div>
                  </>
                ) : profile.friendRequestPending ? (
                  <div className="flex items-center gap-2 px-6 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg font-semibold border border-yellow-200">
                    <Clock className="w-5 h-5" />
                    Demande envoyée
                  </div>
                ) : (
                  <button
                    onClick={onSendFriendRequest}
                    disabled={isSending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-sm"
                  >
                    <UserPlus className="w-5 h-5" />
                    {isSending ? "Envoi..." : "Ajouter"}
                  </button>
                )}
              </div>

              {/* Name & Info */}
              <div className="pt-20 md:pt-6 pb-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      {profile.nom}
                    </h1>
                    
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-2">
                      <Building2 className="w-5 h-5" />
                      <span>
                        {profile.etablissement?.type === "PUBLIC" ? "Établissement Public" : "Établissement Privé"}
                        {" • "}
                        {profile.etablissement?.niveau}
                      </span>
                    </div>
                    
                    {profile.etablissement?.adresse && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.etablissement.adresse}</span>
                      </div>
                    )}
                    
                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                        <FileText className="w-4 h-4" />
                        {stats.totalProjects} projet{stats.totalProjects > 1 ? 's' : ''}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                        <Gift className="w-4 h-4" />
                        {stats.totalDonations} donation{stats.totalDonations > 1 ? 's' : ''}
                      </span>
                      {profile.isFriend && stats.totalAmount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200">
                          <DollarSign className="w-4 h-4" />
                          {formatMontant(stats.totalAmount)} Ar
                        </span>
                      )}
                      {stats.totalDonors > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                          <Users className="w-4 h-4" />
                          {stats.totalDonors} donateur{stats.totalDonors > 1 ? 's' : ''}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium border border-pink-200">
                        <Share2 className="w-4 h-4" />
                        {sharedProjects.length} partage{sharedProjects.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Mobile */}
                <div className="flex md:hidden gap-2 mt-4">
                  {profile.isFriend ? (
                    <>
                      <button
                        onClick={handleSendMessage}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Message
                      </button>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Partenaire
                      </div>
                    </>
                  ) : profile.friendRequestPending ? (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg font-semibold border border-yellow-200">
                      <Clock className="w-5 h-5" />
                      Demande envoyée
                    </div>
                  ) : (
                    <button
                      onClick={onSendFriendRequest}
                      disabled={isSending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold"
                    >
                      <UserPlus className="w-5 h-5" />
                      {isSending ? "Envoi..." : "Ajouter"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-t border-gray-200 -mx-4 md:-mx-6">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide px-4 md:px-6">
                <button
                  onClick={() => setActiveTab("projets")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "projets"
                      ? "text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Projets
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {projects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("donations")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "donations"
                      ? "text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Gift className="w-5 h-5" />
                  Donations
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {donations.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("shared")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "shared"
                      ? "text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Share2 className="w-5 h-5" />
                  Partages
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {sharedProjects.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Privacy Alert */}
            {!profile.isFriend && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm mb-1">
                      Profil limité
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Devenez partenaire pour voir tous les détails
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* About Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">À propos</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.etablissement?.type === "PUBLIC" ? "Public" : "Privé"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Niveau</p>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.etablissement?.niveau}
                    </p>
                  </div>
                </div>

                {profile.etablissement?.anneeCreation && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Année de création</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.etablissement.anneeCreation}
                      </p>
                    </div>
                  </div>
                )}

                {profile.etablissement?.nbEleves && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Nombre d'élèves</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.etablissement.nbEleves}
                      </p>
                    </div>
                  </div>
                )}

                {profile.adressePostale && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Adresse</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.adressePostale}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card - Only for friends */}
            {profile.isFriend && (
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Contact</h3>
                
                <div className="space-y-3">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition"
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="break-all">{profile.email}</span>
                    </a>
                  )}
                  
                  {profile.telephone && (
                    <a
                      href={`tel:${profile.telephone}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition"
                    >
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{profile.telephone}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="text-gray-500 mt-4">Chargement...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchEtablissementData}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <>
                {/* TAB: Projets */}
                {activeTab === "projets" && (
                  <div className="space-y-4">
                    {projects.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun projet publié</p>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  {project.titre}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                  Référence: {project.reference}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
                                {project.categorie}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {project.description}
                            </p>

                            {/* Project Image */}
                            {project.photos && project.photos.length > 0 && (
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <img
                                  src={project.photos[0]}
                                  alt={project.titre}
                                  className="w-full h-48 md:h-64 object-cover"
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                {project.donCount !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <Gift className="w-4 h-4" />
                                    {project.donCount}
                                  </span>
                                )}
                                {project.likesCount !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <Heart className="w-4 h-4" />
                                    {project.likesCount}
                                  </span>
                                )}
                                {project.commentsCount !== undefined && (
                                  <span className="flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4" />
                                    {project.commentsCount}
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/projects/${project.id}`}
                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-semibold"
                              >
                                Voir le projet
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB: Donations */}
                {activeTab === "donations" && (
                  <div className="space-y-4">
                    {donations.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucune donation reçue</p>
                      </div>
                    ) : (
                      donations.map((don) => {
                        const StatutIcon = getStatutIcon(don.statut);
                        const statutStyle = getStatutBadge(don.statut);
                        
                        return (
                          <div
                            key={don.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">
                                  {don.libelle}
                                </h3>
                                
                                <div className="flex flex-wrap gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                    {don.type === "MONETAIRE" ? (
                                      <>
                                        <DollarSign className="w-4 h-4" />
                                        Monétaire
                                      </>
                                    ) : don.type === "VIVRES" ? (
                                      <>
                                        <Package className="w-4 h-4" />
                                        Vivres
                                      </>
                                    ) : (
                                      <>
                                        <Package className="w-4 h-4" />
                                        Matériel
                                      </>
                                    )}
                                  </span>
                                  
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border ${statutStyle.bg} ${statutStyle.text} ${statutStyle.border}`}>
                                    <StatutIcon className="w-4 h-4" />
                                    {getStatutLabel(don.statut)}
                                  </span>
                                </div>
                              </div>
                              
                              {don.type === "MONETAIRE" && don.montant && (
                                <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                                  <p className="text-2xl font-bold text-green-600">
                                    {formatMontant(don.montant)} Ar
                                  </p>
                                </div>
                              )}
                            </div>

                            {don.donateur && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                <div className="flex items-center gap-3">
                                  {don.donateur.avatar ? (
                                    <img 
                                      src={don.donateur.avatar} 
                                      alt={don.donateur.fullName}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-600">
                                      Don de <span className="font-semibold text-gray-900">{don.donateur.fullName}</span>
                                    </p>
                                    {don.project && (
                                      <Link
                                        href={`/projects/${don.project.id}`}
                                        className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                                      >
                                        Pour le projet: {don.project.titre}
                                        <ExternalLink className="w-3 h-3" />
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-4 h-4" />
                              Reçu le {new Date(don.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB: Projets partagés */}
                {activeTab === "shared" && (
                  <div className="space-y-4">
                    {sharedProjects.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun projet partagé</p>
                      </div>
                    ) : (
                      sharedProjects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          {/* Share Header */}
                          <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {profile.nom}
                                  <span className="font-normal text-gray-600"> a partagé un projet</span>
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(project.sharedAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Project Content */}
                          <Link href={`/projects/${project.id}`} className="block">
                            <div className="p-6">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900 flex-1 hover:text-blue-600 transition">
                                  {project.titre}
                                </h3>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
                                  {project.categorie}
                                </span>
                              </div>

                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {project.description}
                              </p>

                              {/* Project Image */}
                              {project.photos && project.photos.length > 0 && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                  <img
                                    src={project.photos[0]}
                                    alt={project.titre}
                                    className="w-full h-48 md:h-64 object-cover"
                                  />
                                </div>
                              )}

                              {/* Project Info */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="w-4 h-4" />
                                  <span>Par {project.auteur.fullName}</span>
                                </div>
                                
                                {project.etablissement && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 className="w-4 h-4" />
                                    {project.etablissement.nom}
                                  </div>
                                )}
                              </div>

                              {/* Project Stats */}
                              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                  <Heart className="w-4 h-4" />
                                  {project.likesCount}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MessageSquare className="w-4 h-4" />
                                  {project.commentsCount}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Share2 className="w-4 h-4" />
                                  {project.sharesCount}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}