import type { User } from "next-auth";

export const readPostsGuard = (_authUser: User) => {
  return true;
};
