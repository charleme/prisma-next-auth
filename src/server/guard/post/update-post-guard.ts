import type { User } from "next-auth";
import { TRPCError } from "@trpc/server";
import type { DbClient } from "~/server/db";
import { type UpdatePost } from "~/types/schema/post/update-post-schema";

export const updatePostGuard = async (
  authUser: User,
  input: UpdatePost,
  db: DbClient,
) => {
  const post = await db.post.findUnique({
    where: { id: input.id },
    select: { authorId: true },
  });

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  return post.authorId === authUser.id;
};
