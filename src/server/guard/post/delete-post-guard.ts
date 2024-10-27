import type { User } from "next-auth";
import { Role } from "~/types/enum/Role";
import { type DeletePost } from "~/types/schema/post/delete-post-schema";
import { type HandlerDbClient } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { type Guard } from "~/types/guard";

export const deletePostGuard: Guard<DeletePost> = async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: DeletePost;
  db: HandlerDbClient;
}) => {
  const post = await getDeletedPost(input, db);

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  return deletePostClientGuard(authUser, post);
};

const getDeletedPost = async (input: DeletePost, db: HandlerDbClient) => {
  return await db.post.findUnique({
    where: { id: input.postId },
    select: { authorId: true },
  });
};

export const deletePostClientGuard = (
  authUser: User,
  post: NonNullable<Awaited<ReturnType<typeof getDeletedPost>>>,
) => {
  if (authUser.roles.includes(Role.Admin)) {
    return true;
  }

  return post.authorId === authUser.id;
};
