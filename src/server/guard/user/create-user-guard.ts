import { type User } from "next-auth";
import { Role } from "~/types/enum/Role";

export const createUserGuard = (authUser: User) => {
  return authUser.roles.includes(Role.Admin);
};
