import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const gate = await requirePermission("admin:panel");
  if (!gate.ok) redirect("/login"); // ou page 403
  return <>{children}</>;
}
