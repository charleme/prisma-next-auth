import { type User } from "next-auth";
import { type Right } from "~/types/enum/Right";

export function hasAtLeastOneRight(user: User, rights: Right[]) {
  return rights.some((right) => user.rights.includes(right));
}
