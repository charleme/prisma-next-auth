import { type HandlerDbClient } from "~/server/db";
import { type DeleteUser } from "~/types/schema/user/delete-user-schema";

export const deleteUser = async ({
  db,
  input,
}: {
  db: HandlerDbClient;
  input: DeleteUser;
}) => {
  await db.user.delete({
    where: {
      id: input.userId,
    },
  });
};
