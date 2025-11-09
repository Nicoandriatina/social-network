// app/(dashboard)/admin/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import TopDonorsSection from "@/components/admin/TopDonorSection";
import SuperAdminDashboard from "@/components/admin/superAdminDashboard";

export const metadata = {
  title: "Dashboard Admin - Mada Social Network",
  description: "Tableau de bord administrateur de la plateforme",
};

export default async function AdminDashboardPage() {
  // Vérification de l'authentification et du rôle
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
      type: string;
    };

    if (decoded.role !== "SUPERADMIN") {
      redirect("/"); // Redirection si pas super admin
    }

  } catch (error) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Complet avec tous les graphiques et stats */}
      <SuperAdminDashboard />
      
      {/* Section Top Donateurs - Mise en avant */}
      <div className="max-w-[1600px] mx-auto px-6 pb-6">
        <TopDonorsSection />
      </div>
    </div>
  );
}