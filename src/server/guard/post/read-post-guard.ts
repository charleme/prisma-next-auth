import type { User } from "next-auth";
import { Role } from "~/types/enum/Role";
import { type ReadPost } from "~/types/schema/post/read-post-schema";
import { type DbClient } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const readPostGuard = async (
  authUser: User,
  input: ReadPost,
  db: DbClient,
) => {
  if (authUser.roles.includes(Role.Admin)) {
    return true;
  }

  const post = await db.post.findUnique({
    where: { id: input.id },
    select: { authorId: true, published: true },
  });

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  return post.published === true || post.authorId === authUser.id;
};
