import { useCurrentUser } from "./useCurrentUser";
import { can, type Permission } from "@/lib/rbac";

export function useAuthClient() {
  const { user } = useCurrentUser();
  const isAllowed = (perm: Permission) => {
    if (!user) return false;
    return can(user.role, perm);
  };
  return { user, isAllowed };
}
