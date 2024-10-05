import { type DbClient } from "~/server/db";

export const deleteComment = async (db: DbClient, commentId: string) => {
  return await db.comment.delete({
    where: { id: commentId },
  });
};
