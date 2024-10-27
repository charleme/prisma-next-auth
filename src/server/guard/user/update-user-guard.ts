import type { User } from "next-auth";
import type { HandlerDbClient } from "~/server/db";
import { type UpdateUser } from "~/types/schema/user/update-user-schema";
import { TRPCError } from "@trpc/server";
import { Role } from "~/types/enum/Role";
import { type Guard } from "~/types/guard";

/**
 * Admin can update all users and user can update themselves.
 */
export const updateUserGuard = (async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: UpdateUser;
  db: HandlerDbClient;
}) => {
  const user = await getUpdatedUser(input, db);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  return updateUserClientGuard(authUser, user);
}) satisfies Guard<UpdateUser>;

const getUpdatedUser = async (input: UpdateUser, db: HandlerDbClient) => {
  return await db.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
      active: true,
    },
  });
};

export const updateUserClientGuard = (
  authUser: User,
  updatedUser: NonNullable<Awaited<ReturnType<typeof getUpdatedUser>>>,
) => {
  return (
    authUser.roles.includes(Role.Admin) ||
    (authUser.id === updatedUser.id && updatedUser.active)
  );
};
