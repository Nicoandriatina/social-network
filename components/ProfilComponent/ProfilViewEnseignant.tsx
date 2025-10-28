// components/ProfilComponent/ProfileViewEnseignant.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Award,
  Calendar,
  Building2,
  User,
  Lock,
  MessageCircle,
  UserPlus,
  Clock,
  CheckCircle,
  BookOpen,
  FileText,
  ExternalLink,
  Share2,
  Heart,
  MessageSquare,
  ArrowRight,
  Trophy,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";

type Experience = {
  id: string;
  poste: string;
  etablissement: string;
  debut: string;
  fin?: string;
  enCours: boolean;
  description: string;
};

type Formation = {
  id: string;
  diplome: string;
  etablissement: string;
  annee: string;
  description?: string;
};

type Certification = {
  id: string;
  titre: string;
  organisme: string;
  date: string;
  lien?: string;
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
    facebook?: string;
    twitter?: string;
    telephone?: string;
    adressePostale?: string;
    isFriend: boolean;
    friendRequestPending: boolean;
    enseignant?: {
      school?: string;
      position?: string;
      experience?: string;
      degree?: string;
      validated: boolean;
    };
    etablissement?: {
      nom: string;
      type: string;
      niveau: string;
    };
  };
  onSendFriendRequest: () => void;
  isSending: boolean;
};

export default function ProfileViewEnseignant({
  profile,
  onSendFriendRequest,
  isSending,
}: ProfileViewProps) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"experience" | "formation" | "certifications" | "shared">("experience");

  useEffect(() => {
    fetchTeacherData();
  }, [profile.id]);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const [expRes, formRes, certRes, sharedRes] = await Promise.all([
        fetch(`/api/enseignants/${profile.id}/experiences`, { credentials: "include" }),
        fetch(`/api/enseignants/${profile.id}/formations`, { credentials: "include" }),
        fetch(`/api/enseignants/${profile.id}/certifications`, { credentials: "include" }),
        fetch(`/api/enseignants/${profile.id}/shared-projects`, { credentials: "include" })
      ]);

      if (expRes.ok) {
        const data = await expRes.json();
        setExperiences(data.experiences || []);
      }
      if (formRes.ok) {
        const data = await formRes.json();
        setFormations(data.formations || []);
      }
      if (certRes.ok) {
        const data = await certRes.json();
        setCertifications(data.certifications || []);
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

  const calculateYearsOfExperience = () => {
    if (experiences.length === 0) return 0;
    const sortedExp = [...experiences].sort((a, b) => 
      new Date(a.debut).getTime() - new Date(b.debut).getTime()
    );
    const firstJob = new Date(sortedExp[0].debut);
    const now = new Date();
    return Math.floor((now.getTime() - firstJob.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  const getVisibleExperiences = () => {
    if (profile.isFriend) return experiences;
    return experiences.slice(0, 2);
  };

  const getVisibleFormations = () => {
    if (profile.isFriend) return formations;
    return formations.slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo + Profile Info */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-80 md:h-96 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-b-2xl overflow-hidden">
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
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-sm"
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold shadow-sm"
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
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {profile.nom}
                      </h1>
                      {profile.enseignant?.validated && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          Vérifié
                        </span>
                      )}
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-2">
                      {profile.enseignant?.position || "Enseignant"}
                    </p>
                    
                    {profile.etablissement && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{profile.etablissement.nom}</span>
                      </div>
                    )}
                    
                    {/* Stats Pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {experiences.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
                          <Briefcase className="w-4 h-4" />
                          {calculateYearsOfExperience()} ans d'expérience
                        </span>
                      )}
                      {formations.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                          <GraduationCap className="w-4 h-4" />
                          {formations.length} formation{formations.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {certifications.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                          <Award className="w-4 h-4" />
                          {certifications.length} certification{certifications.length > 1 ? 's' : ''}
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold"
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold"
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
                  onClick={() => setActiveTab("experience")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "experience"
                      ? "text-indigo-600 border-b-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  Expériences
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {experiences.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("formation")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "formation"
                      ? "text-indigo-600 border-b-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  Formations
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {formations.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("certifications")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "certifications"
                      ? "text-indigo-600 border-b-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Award className="w-5 h-5" />
                  Certifications
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {certifications.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("shared")}
                  className={`flex items-center gap-2 px-4 py-3 font-semibold transition whitespace-nowrap ${
                    activeTab === "shared"
                      ? "text-indigo-600 border-b-4 border-indigo-600"
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
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-indigo-900 text-sm mb-1">
                      Profil limité
                    </p>
                    <p className="text-xs text-indigo-700 leading-relaxed">
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
                {profile.enseignant?.position && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Poste</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.enseignant.position}
                      </p>
                    </div>
                  </div>
                )}

                {profile.etablissement && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Établissement</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.etablissement.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        {profile.etablissement.type} - {profile.etablissement.niveau}
                      </p>
                    </div>
                  </div>
                )}

                {profile.adressePostale && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Localisation</p>
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
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition"
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="break-all">{profile.email}</span>
                    </a>
                  )}
                  
                  {profile.telephone && (
                    <a
                      href={`tel:${profile.telephone}`}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-indigo-600 transition"
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
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-gray-500 mt-4">Chargement...</p>
                </div>
              </div>
            ) : (
              <>
                {/* TAB: Expériences */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    {getVisibleExperiences().length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucune expérience</p>
                      </div>
                    ) : (
                      <>
                        {getVisibleExperiences().map((exp) => (
                          <div
                            key={exp.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900">
                                      {exp.poste}
                                    </h3>
                                    <p className="text-indigo-600 font-medium">
                                      {exp.etablissement}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                      <Calendar className="w-4 h-4" />
                                      {formatDate(exp.debut)} - {exp.enCours ? "Aujourd'hui" : exp.fin ? formatDate(exp.fin) : "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {exp.enCours && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                                  <Target className="w-3 h-3" />
                                  En cours
                                </span>
                              )}
                            </div>

                            {profile.isFriend ? (
                              exp.description && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {exp.description}
                                  </p>
                                </div>
                              )
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <Lock className="w-4 h-4" />
                                  Description visible pour les amis uniquement
                                </p>
                              </div>
                            )}
                          </div>
                        ))}

                        {!profile.isFriend && experiences.length > 2 && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 text-center">
                            <Lock className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                            <p className="text-gray-700 font-medium mb-1">
                              + {experiences.length - 2} expérience{experiences.length - 2 > 1 ? 's' : ''} supplémentaire{experiences.length - 2 > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              Ajoutez-le en ami pour tout voir
                            </p>
                            <button
                              onClick={onSendFriendRequest}
                              disabled={isSending}
                              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
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

                {/* TAB: Formations */}
                {activeTab === "formation" && (
                  <div className="space-y-4">
                    {getVisibleFormations().length === 0 ? (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucune formation</p>
                      </div>
                    ) : (
                      <>
                        {getVisibleFormations().map((form) => (
                          <div
                            key={form.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                          >
                            <div className="flex items-start gap-4 mb-3">
                              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900">
                                    {form.diplome}
                                  </h3>
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-semibold">
                                    <Calendar className="w-3 h-3" />
                                    {form.annee}
                                  </span>
                                </div>
                                <p className="text-purple-600 font-medium mb-2">
                                  {form.etablissement}
                                </p>
                                {profile.isFriend && form.description && (
                                  <div className="bg-purple-50 rounded-lg p-3 mt-3">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {form.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {!profile.isFriend && formations.length > 2 && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 text-center">
                            <Lock className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                            <p className="text-gray-700 font-medium mb-1">
                              + {formations.length - 2} formation{formations.length - 2 > 1 ? 's' : ''} supplémentaire{formations.length - 2 > 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                              Ajoutez-le en ami pour tout voir
                            </p>
                            <button
                              onClick={onSendFriendRequest}
                              disabled={isSending}
                              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
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

                {/* TAB: Certifications */}
                {activeTab === "certifications" && (
                  <div className="space-y-4">
                    {profile.isFriend ? (
                      certifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">Aucune certification</p>
                        </div>
                      ) : (
                        certifications.map((cert) => (
                          <div
                            key={cert.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-2">
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                                      {cert.titre}
                                    </h3>
                                    <p className="text-yellow-600 font-medium mb-2">
                                      {cert.organisme}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Calendar className="w-4 h-4" />
                                      {new Date(cert.date).toLocaleDateString('fr-FR', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                      })}
                                    </div>
                                  </div>
                                  {cert.lien && (
                                    <a
                                      href={cert.lien}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold whitespace-nowrap"
                                    >
                                      Voir
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Contenu réservé aux amis
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Les certifications professionnelles sont visibles uniquement pour les contacts acceptés
                          </p>
                          <button
                            onClick={onSendFriendRequest}
                            disabled={isSending}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                          >
                            <UserPlus className="w-5 h-5" />
                            Ajouter en ami
                          </button>
                        </div>
                      </div>
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
                              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-indigo-600" />
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
                                <h3 className="text-xl font-bold text-gray-900 flex-1 hover:text-indigo-600 transition">
                                  {project.titre}
                                </h3>
                                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-semibold whitespace-nowrap">
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