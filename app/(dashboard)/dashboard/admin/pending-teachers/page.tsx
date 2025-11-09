"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Calendar,
  User,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react";

type Teacher = {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    telephone: string;
    avatar?: string;
    createdAt: string;
  };
  position?: string;
  experience?: string;
  degree?: string;
  validated: boolean;
  startYear?: number;
  endYear?: number;
  isCurrentTeacher?: boolean;
};

export default function PendingTeachersPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "current" | "former">("all");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (!loading) {
      console.log("========== DEBUG CLIENT SIDE ==========");
      console.log("User:", user);
      console.log("======================================");

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.typeProfil !== "ETABLISSEMENT") {
        setError("Vous devez être un établissement pour accéder à cette page");
        setLoadingTeachers(false);
        return;
      }

      if (user.etablissement?.id) {
        fetchPendingTeachers(user.etablissement.id);
      } else {
        setError("Établissement non trouvé");
        setLoadingTeachers(false);
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    let filtered = teachers;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatus === "current") {
      filtered = filtered.filter(t => t.isCurrentTeacher);
    } else if (filterStatus === "former") {
      filtered = filtered.filter(t => !t.isCurrentTeacher);
    }

    setFilteredTeachers(filtered);
  }, [searchTerm, filterStatus, teachers]);

  const fetchPendingTeachers = async (etabId: string) => {
    try {
      const res = await fetch(`/api/etablissements/${etabId}/teachers/pending`, {
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${res.status}`);
      }

      const data = await res.json();
      setTeachers(data.teachers || []);
      setFilteredTeachers(data.teachers || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleValidate = async (teacherId: string, etabId: string) => {
    setValidatingId(teacherId);
    try {
      const res = await fetch(
        `/api/etablissements/${etabId}/teachers/${teacherId}/validate`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur lors de la validation");
      }

      setTeachers(teachers.filter((t) => t.id !== teacherId));
      setSelectedTeacher(null);
      
      // Toast de succès
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top';
      toast.textContent = '✓ Enseignant validé avec succès !';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (err) {
      alert("❌ " + (err instanceof Error ? err.message : "Erreur serveur"));
    } finally {
      setValidatingId(null);
    }
  };

  const handleReject = async (teacherId: string, etabId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir rejeter cette demande ?")) return;
    
    setRejectingId(teacherId);
    try {
      // TODO: Implémenter l'endpoint de rejet
      setTeachers(teachers.filter((t) => t.id !== teacherId));
      setSelectedTeacher(null);
    } catch (err) {
      alert("❌ Erreur lors du rejet");
    } finally {
      setRejectingId(null);
    }
  };

  if (loading || loadingTeachers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4 font-medium text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.typeProfil !== "ETABLISSEMENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold mb-2 text-xl">Accès refusé</p>
          <p className="text-gray-600 mb-6">Cette page est réservée aux établissements</p>
          <Link 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Clock className="w-8 h-8" />
                  Validation des enseignants
                </h1>
                <p className="text-indigo-100 text-lg">
                  Établissement : <span className="font-semibold text-white">{user.etablissement?.nom}</span>
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{teachers.length}</div>
                  <div className="text-indigo-100 text-sm">en attente</div>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === "all"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus("current")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === "current"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Actuels
                </button>
                <button
                  onClick={() => setFilterStatus("former")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === "former"
                      ? "bg-amber-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Anciens
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Liste des enseignants */}
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tout est à jour !</h2>
            <p className="text-gray-500 text-lg">
              {searchTerm || filterStatus !== "all" 
                ? "Aucun résultat pour cette recherche"
                : "Aucun enseignant en attente de validation"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-indigo-200"
              >
                {/* En-tête de la carte */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <AvatarDisplay
                      name={teacher.user.fullName}
                      avatar={teacher.user.avatar}
                      size="xl"
                      showBorder={true}
                    />

                    {/* Info principale */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {teacher.user.fullName}
                          </h3>
                          {teacher.position && (
                            <p className="text-sm text-indigo-600 font-medium mt-1 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              {teacher.position}
                            </p>
                          )}
                        </div>
                        
                        {/* Badge statut */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          teacher.isCurrentTeacher
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {teacher.isCurrentTeacher ? "✓ Actuel" : "⏱ Ancien"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corps de la carte */}
                <div className="p-6 space-y-4">
                  {/* Coordonnées */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600 truncate">{teacher.user.email}</span>
                    </div>
                    {teacher.user.telephone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{teacher.user.telephone}</span>
                      </div>
                    )}
                  </div>

                  {/* Période d'enseignement */}
                  {(teacher.startYear || teacher.endYear) && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-900">
                          Période d'enseignement
                        </span>
                      </div>
                      <p className="text-sm text-indigo-700 font-medium">
                        {teacher.startYear && `De ${teacher.startYear}`}
                        {teacher.endYear ? ` à ${teacher.endYear}` : " à aujourd'hui"}
                      </p>
                    </div>
                  )}

                  {/* Informations supplémentaires */}
                  <div className="grid grid-cols-2 gap-3">
                    {teacher.experience && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Expérience</span>
                        </div>
                        <p className="text-sm text-gray-900 font-semibold">{teacher.experience}</p>
                      </div>
                    )}
                    {teacher.degree && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500 font-medium">Diplôme</span>
                        </div>
                        <p className="text-sm text-gray-900 font-semibold truncate">{teacher.degree}</p>
                      </div>
                    )}
                  </div>

                  {/* Date d'inscription */}
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-400">
                      Demande envoyée le {new Date(teacher.user.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 border-t flex gap-3">
                  <button
                    onClick={() => handleValidate(teacher.id, user.etablissement?.id || "")}
                    disabled={validatingId === teacher.id || rejectingId === teacher.id}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {validatingId === teacher.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Validation...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Valider
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleReject(teacher.id, user.etablissement?.id || "")}
                    disabled={validatingId === teacher.id || rejectingId === teacher.id}
                    className="px-6 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    title="Rejeter la demande"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}