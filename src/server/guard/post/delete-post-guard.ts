import type { User } from "next-auth";
import { Role } from "~/types/enum/Role";
import { type DeletePost } from "~/types/schema/post/delete-post-schema";
import { type DbClient } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const deletePostGuard = async (
  authUser: User,
  input: DeletePost,
  db: DbClient,
) => {
  if (authUser.roles.includes(Role.Admin)) {
    return true;
  }

  const post = await db.post.findUnique({
    where: { id: input.postId },
    select: { authorId: true },
  });

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  return post.authorId === authUser.id;
};
