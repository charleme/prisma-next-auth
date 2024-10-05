import type { User } from "next-auth";
import { Role } from "~/types/enum/Role";
import { type DbClient } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { type DeleteComment } from "~/types/schema/comment/delete-comment-schema";

export const deleteCommentGuard = async (
  authUser: User,
  input: DeleteComment,
  db: DbClient,
) => {
  const comment = await getDeletedComment(input, db);

  if (!comment)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comment not found",
    });
  return deleteCommentClientGuard(authUser, comment);
};

const getDeletedComment = async (input: DeleteComment, db: DbClient) => {
  return await db.comment.findUnique({
    where: { id: input.commentId },
    select: { authorId: true },
  });
};

export const deleteCommentClientGuard = (
  authUser: User,
  comment: NonNullable<Awaited<ReturnType<typeof getDeletedComment>>>,
) => {
  if (authUser.roles.includes(Role.Admin)) {
    return true;
  }

  return comment.authorId === authUser.id;
};
