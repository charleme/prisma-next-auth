import type { Prisma } from "@prisma/client";
import type { DbClient, ExtArgs } from "~/server/db";
import type { PaginationProps } from "~/types/schema/list/pagination";
import { type SearchPostFilter } from "~/types/schema/post/search";

export function searchPosts<Select extends Prisma.PostSelect<ExtArgs>>({
  db,
  select,
  filters: filters,
  paginationProps,
}: {
  db: DbClient;
  select: Select;
  paginationProps: PaginationProps;
  filters: SearchPostFilter;
}) {
  let orderBy: Prisma.Args<typeof db.post, "findMany">["orderBy"];
  const sortOrder = paginationProps.sort_order;

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
      },
    },
    {
      page: paginationProps.page,
      per_page: paginationProps.per_page,
      orderBy: orderBy,
    },
  );
}
