import { type RegisterFormData } from "~/types/schema/auth/register";
import { type PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

export const register = async ({
  db,
  input,
}: {
  db: PrismaClient;
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
