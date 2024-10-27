import type { User } from "next-auth";
import { TRPCError } from "@trpc/server";
import type { HandlerDbClient } from "~/server/db";
import { type UpdatePost } from "~/types/schema/post/update-post-schema";

export const updatePostGuard = async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: UpdatePost;
  db: HandlerDbClient;
}) => {
  const post = await getUpdatedPost(input, db);

  if (!post)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  return updatePostClientGuard(authUser, post);
};

const getUpdatedPost = async (input: UpdatePost, db: HandlerDbClient) => {
  return await db.post.findUnique({
    where: { id: input.id },
    select: { authorId: true },
  });
};

export const updatePostClientGuard = (
  authUser: User,
  post: NonNullable<Awaited<ReturnType<typeof getUpdatedPost>>>,
) => {
  return post.authorId === authUser.id;
};
