import { type CreateUser } from "~/types/schema/user/create-user-schema";
import { hash } from "bcrypt";
import { type HandlerDbClient } from "~/server/db";

export const createUser = async ({
  db,
  input,
}: {
  db: HandlerDbClient;
  input: CreateUser;
}) => {
  const hashedPassword = await hash(input.password, 10);

  await db.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      roles: {
        connect: input.roles.map((role) => ({ id: role })),
      },
      active: input.active,
    },
  });
};
