import { type Prisma } from "@prisma/client";
import { type PaginationProps } from "~/types/schema/list/pagination";
import { type SearchUserFilter } from "~/types/schema/user/search";
import { type ExtArgs, type DbClient } from "~/server/db";

export function listUser<Select extends Prisma.UserSelect<ExtArgs>>({
  db,
  select,
}: {
  db: DbClient;
  select: Select;
}) {
  return db.user.findMany({
    select,
  });
}

export function searchUser<Select extends Prisma.UserSelect<ExtArgs>>({
  db,
  select,
  filters,
  paginationProps,
}: {
  db: DbClient;
  select: Select;
  paginationProps: PaginationProps;
  filters: SearchUserFilter;
}) {
  return db.user.paginate(
    {
      select: select ?? {},
      where: {
        email: {
          contains: filters.email,
        },
        roles: {
          some: {
            id: {
              in: filters.roles,
            },
          },
        },
        OR: [
          {
            firstName: {
              contains: filters.global,
            },
          },
          {
            lastName: {
              contains: filters.global,
            },
          },
          {
            email: {
              contains: filters.global,
            },
          },
        ],
      },
    },
    paginationProps,
  );
}
