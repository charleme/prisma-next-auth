import type { User } from "next-auth";
import { Role } from "~/types/enum/Role";
import { type ReadPost } from "~/types/schema/post/read-post-schema";
import { type HandlerDbClient } from "~/server/db";
import { TRPCError } from "@trpc/server";

/**
 * User can read all post if admin else only published and own posts
 */
export const readPostGuard = async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: ReadPost;
  db: HandlerDbClient;
}) => {
  const post = await getReadPost(input, db);

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });

  return readPostClientGuard(authUser, post);
};

export const getReadPost = async (input: ReadPost, db: HandlerDbClient) => {
  return await db.post.findUnique({
    where: { id: input.id },
    select: { authorId: true, published: true },
  });
};

export const readPostClientGuard = (
  authUser: User,
  post: NonNullable<Awaited<ReturnType<typeof getReadPost>>>,
) => {
  if (authUser.roles.includes(Role.Admin)) {
    return true;
  }

  return post.published || post.authorId === authUser.id;
};
