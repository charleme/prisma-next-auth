import { Role } from "~/types/enum/Role";
import { type Guard } from "~/types/guard";
import { type User } from "next-auth";

/**
 * Only admin can update active.
 */
export const updateUserRoleGuard = (({ authUser }: { authUser: User }) => {
  return authUser.roles.includes(Role.Admin);
}) satisfies Guard;
