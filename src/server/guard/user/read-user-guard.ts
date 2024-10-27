import type { User } from "next-auth";
import type { HandlerDbClient } from "~/server/db";
import { type ReadUser } from "~/types/schema/user/read-user-schema";
import { Role } from "~/types/enum/Role";
import { type Guard } from "~/types/guard";

/**
 * All user can view all active users and admin can view all users.
 */
export const readUserGuard = (async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: ReadUser;
  db: HandlerDbClient;
}) => {
  const readUser = await getReadUser(input, db);
  return readUserClientGuard(authUser, readUser);
}) satisfies Guard<ReadUser>;

const getReadUser = async (input: ReadUser, db: HandlerDbClient) => {
  return await db.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      active: true,
    },
  });
};

export const readUserClientGuard = (
  authUser: User,
  user: Awaited<ReturnType<typeof getReadUser>>,
) => {
  return authUser.roles.includes(Role.Admin) || user !== null;
};
