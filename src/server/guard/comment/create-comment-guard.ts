import {
  type getReadPost,
  readPostClientGuard,
  readPostGuard,
} from "~/server/guard/post/read-post-guard";
import type { User } from "next-auth";
import type { HandlerDbClient } from "~/server/db";
import { type CreateComment } from "~/types/schema/comment/create-delete-schema";
import { TRPCError } from "@trpc/server";

export const createCommentGuard = async ({
  authUser,
  input,
  db,
}: {
  authUser: User;
  input: CreateComment;
  db: HandlerDbClient;
}) => {
  const post = await db.post.findUnique({
    where: { id: input.postId },
    select: { id: true },
  });

  if (!post) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Post not found",
    });
  }

  return readPostGuard({ authUser, input: post, db });
};

export const createCommentClientGuard = (
  authUser: User,
  post: NonNullable<Awaited<ReturnType<typeof getReadPost>>>,
) => {
  return readPostClientGuard(authUser, post);
};
