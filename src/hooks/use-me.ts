import { useSession } from "next-auth/react";
import { hasAtLeastOneRole, hasRole } from "~/lib/has-role";
import { type Role } from "~/types/enum/Role";

export const useMe = () => {
  const session = useSession();
  const user = session.data?.user;
  return {
    user: user,
    hasAtLeastOneRole: (roles: Role[]) =>
      !!user && hasAtLeastOneRole(user, roles),
    hasRole: (role: Role) => !!user && hasRole(user, role),
  };
};
