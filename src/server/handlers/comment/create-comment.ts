import { type DbClient } from "~/server/db";
import { type User } from "next-auth";
import { type CreateComment } from "~/types/schema/comment/create-delete-schema";

export const createComment = async (
  db: DbClient,
  currentUser: User,
  comment: CreateComment,
) => {
  return await db.comment.create({
    data: {
      postId: comment.postId,
      content: comment.content,
      authorId: currentUser.id,
    },
    select: { id: true },
  });
};
