import { type HandlerDbClient } from "~/server/db";

export const deletePost = async (db: HandlerDbClient, postId: string) => {
  return await db.post.delete({
    where: { id: postId },
  });
};
