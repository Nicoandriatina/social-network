// components/ProfilComponent/ProfileViewDonateur.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Gift, 
  Target, 
  DollarSign,
  Lock,
  MessageCircle,
  UserPlus,
  Clock,
  CheckCircle,
  Building2,
  User,
  FileText,
  Send,
  Calendar,
  Package,
  Share2,
  Heart,
  MessageSquare,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  destination: {
    type: string;
    name: string;
    etablissement?: string;
  };
  project?: {
    id: string;
    titre: string;
  };
};

type SupportedProject = {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  etablissement?: {
    nom: string;
  };
  donationCount: number;
  totalAmount: number;
  lastDonation: string;
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

type ProfileViewProps = {
  profile: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
    telephone?: string;
    facebook?: string;
    twitter?: string;
    profession?: string;
    adressePostale?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    donateur?: {
      donorType?: string;
      sector?: string;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewDonateur({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [supportedProjects, setSupportedProjects] = useState<SupportedProject[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    projectsSupported: 0,
    lastDonationDate: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"donations" | "projects" | "shared">("donations");

  useEffect(() => {
    fetchDonorData();
  }, [profile.id]);

  const fetchDonorData = async () => {
    setLoading(true);
    try {
      const [donationsRes, projectsRes, sharedRes] = await Promise.all([
        fetch(`/api/donateurs/${profile.id}/donations`, { credentials: "include" }),
        fetch(`/api/donateurs/${profile.id}/projects`, { credentials: "include" }),
        fetch(`/api/donateurs/${profile.id}/shared-projects`, { credentials: "include" })
      ]);

      if (donationsRes.ok) {
        const data = await donationsRes.json();
        setDonations(data.donations || []);
        setStats(data.stats || stats);
      }

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setSupportedProjects(data.projects || []);
      }

      if (sharedRes.ok) {
        const data = await sharedRes.json();
        setSharedProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    router.push(`/dashboard/messages?userId=${profile.id}`);
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

  const getVisibleDonations = () => {
    if (profile.isFriend) return donations;
    return donations.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo + Profile Info */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-80 md:h-96 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-b-2xl overflow-hidden">
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
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-sm"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Message
                    </button>
                    <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Amis
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 font-semibold shadow-sm"
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
                    <p className="text-lg text-gray-600 mb-2">
                      {profile.profession || "Ami de l'éducation"}
                    </p>
                    
                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200">
                        <Gift className="w-4 h-4" />
                        {stats.totalDonations} donation{stats.totalDonations !== 1 ? 's' : ''}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                        <Target className="w-4 h-4" />
                        {stats.projectsSupported} projet{stats.projectsSupported !== 1 ? 's' : ''}
                      </span>
                      {profile.isFriend && stats.totalAmount > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                          <DollarSign className="w-4 h-4" />
                          {formatMontant(stats.totalAmount)} Ar
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Message
                      </button>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Amis
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold"
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
                  onClick={() => setActiveTab("donations")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "donations"
                      ? "text-emerald-600 border-b-4 border-emerald-600"
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
                  onClick={() => setActiveTab("projects")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "projects"
                      ? "text-emerald-600 border-b-4 border-emerald-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Target className="w-5 h-5" />
                  Projets soutenus
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {supportedProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("shared")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "shared"
                      ? "text-emerald-600 border-b-4 border-emerald-600"
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
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900 text-sm mb-1">
                      Profil limité
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Devenez ami pour voir tous les détails
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* About Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">À propos</h3>
              
              <div className="space-y-3">
                {profile.donateur?.donorType && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.donateur.donorType}
                      </p>
                    </div>
                  </div>
                )}

                {profile.donateur?.sector && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Secteur</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.donateur.sector}
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
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition"
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="break-all">{profile.email}</span>
                    </a>
                  )}
                  
                  {profile.telephone && (
                    <a
                      href={`tel:${profile.telephone}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition"
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
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
                  <p className="text-gray-500 mt-4">Chargement...</p>
                </div>
              </div>
            ) : (
              <>
                {/* TAB: Donations */}
                {activeTab === "donations" && (
                  <div className="space-y-4">
                    {getVisibleDonations().length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucune donation</p>
                      </div>
                    ) : (
                      <>
                        {getVisibleDonations().map((don) => {
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
                                    
                                    {don.destination && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200">
                                        {don.destination.type === 'project' ? (
                                          <>
                                            <FileText className="w-4 h-4" />
                                            Projet
                                          </>
                                        ) : don.destination.type === 'etablissement' ? (
                                          <>
                                            <Building2 className="w-4 h-4" />
                                            École
                                          </>
                                        ) : (
                                          <>
                                            <User className="w-4 h-4" />
                                            Enseignant
                                          </>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {profile.isFriend && don.type === "MONETAIRE" && don.montant && (
                                  <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                                    <p className="text-2xl font-bold text-green-600">
                                      {formatMontant(don.montant)} Ar
                                    </p>
                                  </div>
                                )}
                              </div>

                              {don.destination && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                  <p className="text-sm text-gray-600 mb-1">Destinataire</p>
                                  <p className="font-semibold text-gray-900">
                                    {don.destination.name}
                                  </p>
                                  {don.destination.etablissement && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {don.destination.etablissement}
                                    </p>
                                  )}
                                  {don.project && (
                                    <Link
                                      href={`/projects/${don.project.id}`}
                                      className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline mt-2"
                                    >
                                      Voir le projet
                                      <ArrowRight className="w-4 h-4" />
                                    </Link>
                                  )}
                                </div>
                              )}

                              {!profile.isFriend && don.type === "MONETAIRE" && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Montant visible pour les amis uniquement
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(don.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {!profile.isFriend && donations.length > 3 && (
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 text-center">
                            <Lock className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                            <p className="text-gray-700 font-medium mb-1">
                              + {donations.length - 3} donation{donations.length - 3 > 1 ? 's' : ''} supplémentaire{donations.length - 3 > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              Ajoutez-le en ami pour tout voir
                            </p>
                            <button
                              onClick={onSendFriendRequest}
                              disabled={isSending}
                              className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                            >
                              <UserPlus className="w-5 h-5" />
                              Ajouter en ami
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* TAB: Projets soutenus */}
                {activeTab === "projects" && (
                  <div className="space-y-4">
                    {supportedProjects.length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun projet soutenu</p>
                      </div>
                    ) : (
                      supportedProjects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900 flex-1">
                                  {project.titre}
                                </h3>
                                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
                                  {project.categorie}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {project.description}
                              </p>
                              
                              {project.etablissement && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                  <Building2 className="w-4 h-4" />
                                  {project.etablissement.nom}
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <Gift className="w-4 h-4" />
                                  {project.donationCount} don{project.donationCount > 1 ? 's' : ''}
                                </span>
                                
                                {profile.isFriend && project.totalAmount > 0 && (
                                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                                    <DollarSign className="w-4 h-4" />
                                    {formatMontant(project.totalAmount)} Ar
                                  </span>
                                )}
                                
                                <Link
                                  href={`/projects/${project.id}`}
                                  className="ml-auto flex items-center gap-1 text-sm text-emerald-600 hover:underline font-semibold"
                                >
                                  Voir le projet
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                                <Calendar className="w-4 h-4" />
                                Dernier don: {new Date(project.lastDonation).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
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
                              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-emerald-600" />
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
                                <h3 className="text-xl font-bold text-gray-900 flex-1 hover:text-emerald-600 transition">
                                  {project.titre}
                                </h3>
                                <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
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