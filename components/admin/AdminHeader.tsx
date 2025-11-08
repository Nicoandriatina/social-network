// components/admin/AdminHeader.tsx
"use client";

import { Shield, Bell, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  userId: string;
}

export default function AdminHeader({ userId }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      // Redirection vers login
      router.push("/login");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      // Forcer la redirection même en cas d'erreur
      router.push("/login");
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Administration</h1>
              <p className="text-xs text-indigo-100">Mada Social Network</p>
            </div>
          </div>

          {/* Navigation et actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Paramètres */}
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Profil admin */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="text-right">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-indigo-100">
                  {userId.substring(0, 8)}...
                </p>
              </div>
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold">
                SA
              </div>
            </div>

            {/* Déconnexion */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}