import { type ExtArgs, type HandlerDbClient } from "~/server/db";
import type { Prisma } from "@prisma/client";

export async function getPost<Select extends Prisma.PostSelect<ExtArgs>>(
  db: HandlerDbClient,
  postId: string,
  select: Select,
) {
  return await db.post.findUniqueOrThrow({
    where: { id: postId },
    select,
  });
}
