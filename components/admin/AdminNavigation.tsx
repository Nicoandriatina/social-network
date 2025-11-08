// components/admin/AdminNavigation.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Utilisateurs" },
    { href: "/admin/donations", label: "Dons" },
    { href: "/admin/projects", label: "Projets" },
    { href: "/admin/moderation", label: "Modération" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/settings", label: "Paramètres" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[64px] z-40">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  py-4 px-2 border-b-2 transition-colors font-medium text-sm
                  ${isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}