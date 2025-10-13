"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  school?: string;
  position?: string;
  experience?: string;
  degree?: string;
  validated: boolean;
};

export default function PendingTeachersPage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      // 🔍 DEBUG - Afficher les infos de l'utilisateur
      console.log("========== DEBUG CLIENT SIDE ==========");
      console.log("User complet:", JSON.stringify(user, null, 2));
      console.log("User typeProfil:", user?.typeProfil);
      console.log("User etablissement:", user?.etablissement);
      console.log("User etablissementId:", user?.etablissementId);
      console.log("======================================");

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.typeProfil !== "ETABLISSEMENT") {
        console.error("❌ AccÃ¨s refusÃ©: utilisateur n'est pas un Ã©tablissement");
        console.error("typeProfil actuel:", user.typeProfil);
        setError("Vous devez Ãªtre un Ã©tablissement pour accÃ©der Ã  cette page");
        setLoadingTeachers(false);
        return;
      }

      if (user.etablissement?.id) {
        console.log("âœ… Fetching teachers pour l'Ã©tablissement:", user.etablissement.id);
        fetchPendingTeachers(user.etablissement.id);
      } else {
        console.error("❌ Pas d'ID d'Ã©tablissement trouvÃ©");
        setError("Ã‰tablissement non trouvÃ©");
        setLoadingTeachers(false);
      }
    }
  }, [user, loading, router]);

  const fetchPendingTeachers = async (etabId: string) => {
    try {
      console.log("🔄 Fetching URL:", `/api/etablissements/${etabId}/teachers/pending`);
      
      const res = await fetch(
        `/api/etablissements/${etabId}/teachers/pending`,
        {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("📥 Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ Erreur API:", errorData);
        throw new Error(errorData.error || `Erreur ${res.status}`);
      }

      const data = await res.json();
      console.log("âœ… Données reçues:", data);
      setTeachers(data.teachers || []);
      setError(null);
    } catch (err) {
      console.error("❌ Erreur dans fetchPendingTeachers:", err);
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
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur lors de la validation");
      }

      setTeachers(teachers.filter((t) => t.id !== teacherId));
      alert("âœ… Enseignant validÃ© avec succÃ¨s!");
    } catch (err) {
      alert("âŒ " + (err instanceof Error ? err.message : "Erreur serveur"));
    } finally {
      setValidatingId(null);
    }
  };

  if (loading || loadingTeachers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-500 mt-4 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-500 font-semibold mb-4 text-lg">Non authentifiÃ©</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (user.typeProfil !== "ETABLISSEMENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <p className="text-red-600 font-semibold mb-2 text-lg">AccÃ¨s refusÃ©</p>
          <p className="text-gray-600 mb-2">Cette page est rÃ©servÃ©e aux Ã©tablissements</p>
          <p className="text-sm text-gray-500 mb-6">Votre profil: {user.typeProfil}</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ✅ Validation des enseignants
            </h1>
            <p className="text-gray-600">
              Établissement : <span className="font-semibold">{user.etablissement?.nom}</span>
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mt-2">
              {teachers.length} en attente
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b">
              <p className="text-red-600">⚠️ {error}</p>
            </div>
          )}

          {teachers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-900 text-xl font-semibold mb-2">Tout est à jour !</p>
              <p className="text-gray-500">Aucun enseignant en attente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Téléphone</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Poste</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold">
                            {teacher.user.fullName[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium">{teacher.user.fullName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{teacher.user.email}</td>
                      <td className="p-4 text-sm text-gray-600">{teacher.user.telephone || "—"}</td>
                      <td className="p-4 text-sm text-gray-600">{teacher.position || "—"}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleValidate(teacher.id, user.etablissement?.id || "")}
                          disabled={validatingId === teacher.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {validatingId === teacher.id ? "⏳" : "✓ Valider"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}