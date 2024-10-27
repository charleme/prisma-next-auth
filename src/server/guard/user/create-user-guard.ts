import { Role } from "~/types/enum/Role";
import { type User } from "next-auth";

export const createUserGuard = ({ authUser }: { authUser: User }) => {
  return authUser.roles.includes(Role.Admin);
};
