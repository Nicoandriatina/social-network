// // app/dashboard/layout.tsx
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import jwt from "jsonwebtoken";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return redirect("/login");
//   }

//   try {
//     jwt.verify(token, process.env.JWT_SECRET!);
//     // ✅ OK, on laisse passer
//   } catch (err) {
//     console.error("❌ Token invalide ou expiré :", err);
//     return redirect("/login");
//   }

//   return <>{children}</>;
// }

// app/(dashboard)/dashboard/layout.tsx (exemple)
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();                 // <= important
  const token = store.get("token")?.value;
  if (!token) redirect("/login");
  return <>{children}</>;
}
