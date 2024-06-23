import { type RegisterFormData } from "~/types/schema/auth/register";
import { hash } from "bcrypt";
import { type DbClient } from "~/server/db";

export const register = async ({
  db,
  input,
}: {
  db: DbClient;
  input: RegisterFormData;
}) => {
  const hashedPassword = await hash(input.password, 10);

  await db.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });
};
