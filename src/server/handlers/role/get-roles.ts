import type { Prisma } from "@prisma/client";
import { type HandlerDbClient } from "~/server/db";

export function listRole<Select extends Prisma.RoleSelect>({
  db,
  select,
}: {
  db: HandlerDbClient;
  select: Select;
}) {
  return db.role.findMany({
    select,
  });
}
