import { type Prisma, type PrismaClient } from "@prisma/client";
import { paginator } from "~/server/handlers/utils/paginator";
import { type PaginationProps } from "~/types/schema/list/pagination";
import { type SearchUserFilter } from "~/types/schema/user/search";

export function listUser<Select extends Prisma.UserSelect>({
  db,
  select,
}: {
  db: PrismaClient;
  select: Select;
}) {
  return db.user.findMany({
    select,
  });
}

export function searchUser<Select extends Prisma.UserSelect>({
  db,
  select,
  filters,
  paginationProps,
}: {
  db: PrismaClient;
  select: Select;
  paginationProps: PaginationProps;
  filters: SearchUserFilter;
}) {
  return paginator(
    db,
    "user",
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
