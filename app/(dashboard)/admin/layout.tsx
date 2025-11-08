// app/(dashboard)/admin/layout.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavigation from "@/components/admin/AdminNavigation";
// import AdminHeader from "@/components/admin/AdminHeader";
// import AdminNavigation from "@/components/admin/AdminNavigation";

export const metadata = {
  title: "Administration - Mada Social Network",
  description: "Espace d'administration",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérification stricte de l'authentification
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?redirect=/admin");
  }

  let adminData: { 
    userId: string; 
    role: string; 
  } | null = null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== "SUPERADMIN") {
      // Log tentative d'accès non autorisé
      console.warn(`⚠️ Tentative d'accès admin non autorisé: ${decoded.userId}`);
      redirect("/"); // Redirection vers page d'accueil
    }

    adminData = decoded;

  } catch (error) {
    console.error("❌ Erreur vérification token admin:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Admin Global - Client Component */}
      <AdminHeader userId={adminData.userId} />

      {/* Navigation secondaire - Client Component */}
      <AdminNavigation />

      {/* Contenu principal */}
      <main className="min-h-[calc(100vh-128px)]">
        {children}
      </main>

      {/* Footer Admin */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>
              © 2024 Mada Social Network - Plateforme d'administration
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-indigo-600">Documentation</a>
              <a href="#" className="hover:text-indigo-600">Support</a>
              <a href="#" className="hover:text-indigo-600">Changelog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}