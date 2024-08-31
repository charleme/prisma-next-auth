import { type DbClient } from "~/server/db";

export const deletePost = async (db: DbClient, postId: string) => {
  return await db.post.delete({
    where: { id: postId },
  });
};
