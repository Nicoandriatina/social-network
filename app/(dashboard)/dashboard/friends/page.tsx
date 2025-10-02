import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import FriendsManagementPage from "@/components/FriendsManagementPage";

export default async function FriendsPage() {
  const auth = await getAuthUser();
  
  if (!auth) {
    redirect("/login");
  }

  return <FriendsManagementPage currentUserId={auth.id} />;
}