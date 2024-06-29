import type { Prisma } from "@prisma/client";
import type { DbClient } from "~/server/db";

export function listRole<Select extends Prisma.RoleSelect>({
  db,
  select,
}: {
  db: DbClient;
  select: Select;
}) {
  return db.role.findMany({
    select,
  });
}
