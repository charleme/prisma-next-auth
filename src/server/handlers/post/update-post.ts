import { type DbClient } from "~/server/db";
import { type User } from "next-auth";
import { type UpdatePost } from "~/types/schema/post/update-post-schema";

export const updatePost = async (
  db: DbClient,
  currentUser: User,
  post: UpdatePost,
) => {
  return await db.post.update({
    where: { id: post.id },
    data: {
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: currentUser.id,
    },
  });
};
