import { type User } from "next-auth";
import { type Role } from "~/types/enum/Role";

export function hasAtLeastOneRole(user: User, roles: Role[]) {
  return roles.some((role) => user.roles.includes(role));
}

export function hasRole(user: User, role: Role) {
  return user.roles.includes(role);
}
