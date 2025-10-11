import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HeaderWithDropdown from "@/components/Header";
import { SocketProvider } from "@/app/contexts/SocketContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();
  
  if (!auth) {
    redirect("/login");
  }

  // Récupérer les données utilisateur complètes
  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      type: true,
      etablissement: {
        select: {
          id: true,
          nom: true,
          type: true,
          niveau: true
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SocketProvider userId={auth.id}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header global */}
        <HeaderWithDropdown 
          user={{
            fullName: user.fullName,
            email: user.email,
            etablissement: user.etablissement
          }}
          userType={user.type}
        />
        
        {/* Contenu des pages */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </SocketProvider>
  );
}