import type { Prisma } from "@prisma/client";
import { type ExtArgs, type HandlerDbClient } from "~/server/db";
import { type User } from "next-auth";
import { getCurrentUserPostFilters } from "~/server/handlers/post/get-posts";
import { z } from "zod";

const getCurrentUserCommentFilters = ({
  currentUser,
}: {
  currentUser: User;
}): Prisma.Args<HandlerDbClient["comment"], "findMany">["where"] => {
  return {
    post: getCurrentUserPostFilters({ currentUser }),
  };
};

export function listComments<Select extends Prisma.CommentSelect<ExtArgs>>({
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
  const currentUserFilters = getCurrentUserCommentFilters({ currentUser });

  return db.comment.findMany({
    where: {
      ...currentUserFilters,
      authorId,
    },
    select,
  });
}

export function getCommentCount({
  db,
  from,
  to,
}: {
  db: HandlerDbClient;
  from: Date;
  to: Date;
}) {
  return db.comment.count({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
    },
  });
}

export async function getCommentCountPerDay({
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
      COUNT(*) AS "comments"
      FROM Comment
      WHERE "createdAt" >= ${from}
      AND "createdAt" <= ${to}
      GROUP BY DATE(DATETIME("createdAt" / 1000, 'unixepoch'))
      ORDER BY DATE(DATETIME("createdAt" / 1000, 'unixepoch')) ASC
     `;

  return getCommentCountPerDaySchema.parse(result);
}

const getCommentCountPerDaySchema = z.array(
  z.object({
    date: z.coerce.date(),
    comments: z.coerce.number(),
  }),
);
