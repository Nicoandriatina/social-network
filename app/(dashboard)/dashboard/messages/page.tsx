import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessagesPage from "@/components/MessagesPage";

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
      avatar: true,
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
  
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 72px)' }}>
      <div className="flex-1 overflow-hidden">
        <MessagesPage 
          currentUserId={auth.id}
          currentUser={{ 
            fullName: user.fullName, 
            avatar: user.avatar,
            type: user.type 
          }} 
        />
      </div>
    </div>
  );
}