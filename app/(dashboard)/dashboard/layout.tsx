// app/(dashboard)/dashboard/layout.tsx (exemple)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();                 // <= important
  const token = store.get("token")?.value;
  if (!token) redirect("/login");
  return <>{children}</>;
}
