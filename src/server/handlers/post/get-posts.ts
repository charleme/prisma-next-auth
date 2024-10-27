import type { Prisma } from "@prisma/client";
import { type ExtArgs, type HandlerDbClient } from "~/server/db";
import type { PaginationProps } from "~/types/schema/list/pagination";
import { type SearchPostFilter } from "~/types/schema/post/search-post-schema";
import { type User } from "next-auth";
import { hasRole } from "~/lib/has-role";
import { Role } from "~/types/enum/Role";
import { z } from "zod";

export const getCurrentUserPostFilters = ({
  currentUser,
}: {
  currentUser: User;
}): Prisma.Args<HandlerDbClient["post"], "findMany">["where"] => {
  const isAdmin = hasRole(currentUser, Role.Admin);

  if (isAdmin) {
    return {};
  }

  return {
    OR: [
      {
        authorId: currentUser.id,
      },
      {
        published: true,
      },
    ],
  };
};

export function searchPosts<Select extends Prisma.PostSelect<ExtArgs>>({
  db,
  select,
  filters: filters,
  paginationProps,
  currentUser,
}: {
  db: HandlerDbClient;
  select: Select;
  paginationProps: PaginationProps;
  filters: SearchPostFilter;
  currentUser: User;
}) {
  let orderBy: Prisma.Args<typeof db.post, "findMany">["orderBy"];
  const sortOrder = paginationProps.sort_order;

  const myOwnPostFilter: Prisma.Args<typeof db.post, "findMany">["where"] =
    filters.ownPost
      ? {
          authorId: currentUser.id,
        }
      : {};

  switch (paginationProps.sort_by) {
    case null:
    case undefined:
      break;
    case "title":
      orderBy = { title: sortOrder };
      break;
    case "author_fullName":
      orderBy = [
        { author: { firstName: sortOrder } },
        { author: { lastName: sortOrder } },
      ];
      break;
    case "_count_comments":
      orderBy = { comments: { _count: sortOrder } };
      break;
    case "published":
      orderBy = { published: sortOrder };
      break;
    default:
      throw new Error(`Invalid sort_by value: ${paginationProps.sort_by}`);
  }

  return db.post.paginate(
    {
      select: select ?? {},
      where: {
        title: {
          contains: filters.title,
        },
        ...myOwnPostFilter,
        ...getCurrentUserPostFilters({ currentUser }),
      },
    },
    {
      page: paginationProps.page,
      per_page: paginationProps.per_page,
      orderBy: orderBy,
    },
  );
}

export function listPosts<Select extends Prisma.PostSelect<ExtArgs>>({
  db,
  select,
  authorId,
  currentUser,
}: {
  db: HandlerDbClient;
  select: Select;
  authorId: string;
  currentUser: User;
}) {
  const currentUserFilters = getCurrentUserPostFilters({ currentUser });

  return db.post.findMany({
    where: {
      ...currentUserFilters,
      authorId,
    },
    select,
  });
}

export function getPostCount({
  db,
  from,
  to,
}: {
  db: HandlerDbClient;
  from: Date;
  to: Date;
}) {
  return db.post.count({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });
}

export async function getPostCountPerDay({
  db,
  from,
  to,
}: {
  db: HandlerDbClient;
  from: Date;
  to: Date;
}) {
  const result = await db.$queryRaw`
    SELECT
      DATE(DATETIME("createdAt" / 1000, 'unixepoch')) AS "date",
      COUNT(*) AS "posts"
      FROM Post
      WHERE "createdAt" >= ${from}
      AND "createdAt" <= ${to}
      GROUP BY DATE(DATETIME("createdAt" / 1000, 'unixepoch'))
      ORDER BY DATE(DATETIME("createdAt" / 1000, 'unixepoch')) ASC
     `;

  return getPostCountPerDaySchema.parse(result);
}

const getPostCountPerDaySchema = z.array(
  z.object({
    date: z.coerce.date(),
    posts: z.coerce.number(),
  }),
);
