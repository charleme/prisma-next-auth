import { type HandlerDbClient } from "~/server/db";
import { type User } from "next-auth";
import { type UpdateUser } from "~/types/schema/user/update-user-schema";
import { viewActiveFieldUserGuard } from "~/server/guard/user/view-active-field-user-guard";
import { updateUserRoleGuard } from "~/server/guard/user/update-user-role-guard";
import { hash } from "bcrypt";

export const updateUser = async ({
  db,
  authUser,
  updateUser,
}: {
  db: HandlerDbClient;
  authUser: User;
  updateUser: UpdateUser;
}) => {
  const canUpdateActiveField = viewActiveFieldUserGuard({ authUser });
  const canUpdateRole = updateUserRoleGuard({
    authUser,
  });

  await db.user.update({
    where: {
      id: updateUser.userId,
    },
    data: {
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      active: canUpdateActiveField ? updateUser.active : undefined,
      roles: canUpdateRole
        ? {
            connect: updateUser.roles.map((role) => ({ id: role })),
          }
        : undefined,
    },
  });
};

export const updateUserPassword = async ({
  db,
  userId,
  newPassword,
}: {
  db: HandlerDbClient;
  userId: string;
  newPassword: string;
}) => {
  const hashedPassword = await hash(newPassword, 10);

  return db.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};
