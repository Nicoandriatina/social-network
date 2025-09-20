// app/dashboard/page.tsx
"use client";

import DonateurDashboard from "@/components/ProfilComponent/DashboardDonateur";
import EnseignantDashboard from "@/components/ProfilComponent/DashboardEnseign";
import EtabDashboard from "@/components/ProfilComponent/DashboardEtab";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";


export default function DashboardPage() {
  const { user, loading } = useCurrentUser();

  if (loading) return <p className="text-center mt-20">Chargement du profil...</p>;
  if (!user) return <p className="text-red-500 text-center">Non autorisé</p>;

  if (user.typeProfil === "ETABLISSEMENT") return <EtabDashboard user={user} />;
  if (user.typeProfil === "ENSEIGNANT")   return <EnseignantDashboard user={user} />;
  if (user.typeProfil === "DONATEUR")     return <DonateurDashboard user={user} />;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Bienvenue, {user.nom} 👋</h1>
      <p>Type de profil : <strong>{user.typeProfil}</strong></p>
      <p>Rôle : <strong>{user.role}</strong></p>
    </div>
  );
}
