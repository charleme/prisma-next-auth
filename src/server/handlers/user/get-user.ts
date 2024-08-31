import type { Prisma } from "@prisma/client";
import { type DbClient, type ExtArgs } from "~/server/db";

export function getUserByEmailOrThrow<Select extends Prisma.UserSelect>({
  db,
  select,
  email,
}: {
  db: DbClient;
  select: Select;
  email: string;
}) {
  return db.user.findUniqueOrThrow({
    where: { email },
    select,
  });
}

export function getUserByIdOrThrow<Select extends Prisma.UserSelect<ExtArgs>>({
  db,
  select,
  id,
}: {
  db: DbClient;
  select: Select;
  id: string;
}) {
  return db.user.findUniqueOrThrow({
    where: { id },
    select,
  });
}
