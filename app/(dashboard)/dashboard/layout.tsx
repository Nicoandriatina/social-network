// // app/(dashboard)/dashboard/layout.tsx (exemple)
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const store = await cookies();                 // <= important
//   const token = store.get("token")?.value;
//   if (!token) redirect("/login");
//   return <>{children}</>;
// }

import { redirect } from "next/navigation";
// import { SocketProvider } from "@/contexts/SocketContext";
import { getAuthUser } from "@/lib/auth";
import { SocketProvider } from "@/app/contexts/SocketContext";

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const auth = await getAuthUser();
  
  if (!auth) {
    redirect("/login");
  }

  return (
    <SocketProvider userId={auth.id}>
      {children}
    </SocketProvider>
  );
}