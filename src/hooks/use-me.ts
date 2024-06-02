import { useSession } from "next-auth/react";
import { hasAtLeastOneRole, hasRole } from "~/lib/has-role";
import { type Role } from "~/types/enum/Role";

export const useMe = () => {
  const session = useSession();
  const user = session.data?.user;
  return {
    user: user,
    hasAtLeastOneRight: (roles: Role[]) =>
      !!user && hasAtLeastOneRole(user, roles),
    hasRight: (role: Role) => !!user && hasRole(user, role),
  };
};
