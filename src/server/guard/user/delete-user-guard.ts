import { Role } from "~/types/enum/Role";
import { type User } from "next-auth";

/**
 * Admin can delete all users
 */
export const deleteUserGuard = ({ authUser }: { authUser: User }) => {
  return authUser.roles.includes(Role.Admin);
};
