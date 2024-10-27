import { type User } from "next-auth";
import { type UpdateUserPassword } from "~/types/schema/user/update-user-password-schema";

export const updateUserPasswordGuard = ({
  authUser,
  input,
}: {
  authUser: User;
  input: UpdateUserPassword;
}) => {
  return updateUserPasswordClientGuard({ authUser, userId: input.userId });
};

export const updateUserPasswordClientGuard = ({
  authUser,
  userId,
}: {
  authUser: User;
  userId: string;
}) => {
  return authUser.id === userId;
};
