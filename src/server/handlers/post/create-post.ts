import { type CreatePost } from "~/types/schema/post/create-post-schema";
import { type DbClient } from "~/server/db";
import { type User } from "next-auth";

export const createPost = async (
  db: DbClient,
  currentUser: User,
  post: CreatePost,
) => {
  return await db.post.create({
    data: {
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: currentUser.id,
    },
    select: { id: true },
  });
};
