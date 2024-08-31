import { type DbClient, type ExtArgs } from "~/server/db";
import type { Prisma } from "@prisma/client";

export async function getPost<Select extends Prisma.PostSelect<ExtArgs>>(
  db: DbClient,
  postId: string,
  select: Select,
) {
  return await db.post.findUniqueOrThrow({
    where: { id: postId },
    select,
  });
}
