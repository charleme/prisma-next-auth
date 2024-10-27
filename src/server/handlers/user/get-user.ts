import type { Prisma } from "@prisma/client";
import { type DbClient, type ExtArgs, type HandlerDbClient } from "~/server/db";

export function getUserByIdOrThrow<Select extends Prisma.UserSelect>({
  db,
  select,
  userId,
}: {
  db: HandlerDbClient;
  select: Select;
  userId: string;
}) {
  return db.user.findUniqueOrThrow({
    where: { id: userId },
    select,
  });
}

export function getActiveUserByEmailOrThrow<Select extends Prisma.UserSelect>({
  db,
  select,
  email,
}: {
  db: DbClient;
  select: Select;
  email: string;
}) {
  return db.user.findUniqueOrThrow({
    where: { email, active: true },
    select,
  });
}

export function getActiveUserByIdOrThrow<
  Select extends Prisma.UserSelect<ExtArgs>,
>({ db, select, id }: { db: DbClient; select: Select; id: string }) {
  return db.user.findUniqueOrThrow({
    where: { id, active: true },
    select,
  });
}
