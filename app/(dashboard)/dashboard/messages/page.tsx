// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";
// import MessagesPage from "@/components/MessagesPage";

// export default async function DashboardMessagesPage() {
//   const auth = await getAuthUser();
  
//   if (!auth) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: auth.id },
//     select: { 
//       id: true,
//       fullName: true, 
//       type: true 
//     }
//   });

//   if (!user) {
//     redirect("/login");
//   }

//   // 🔍 DEBUG : Logs serveur (visibles dans le terminal)
//   console.log('=====================================');
//   console.log('🔑 Current User ID (auth):', auth.id);
//   console.log('👤 User from database:', user);
//   console.log('=====================================');

//   return (
//     <MessagesPage 
//       currentUserId={auth.id}
//       currentUser={{ 
//         fullName: user.fullName, 
//         type: user.type 
//       }} 
//     />
//   );
// }
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessagesPage from "@/components/MessagesPage";
import { SocketProvider } from "@/app/contexts/SocketContext";


export default async function DashboardMessagesPage() {
  const auth = await getAuthUser();
  
  if (!auth) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { 
      id: true,
      fullName: true, 
      type: true 
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <SocketProvider userId={auth.id}>
      <MessagesPage 
        currentUserId={auth.id}
        currentUser={{ 
          fullName: user.fullName, 
          type: user.type 
        }} 
      />
    </SocketProvider>
  );
}