import {
  createTRPCRouter,
  protectedProcedureByGuard,
  protectedProcedureByGuardWithInput,
} from "~/server/api/trpc";
import { readPostsGuard } from "~/server/guard/post/read-posts-guard";
import { searchPosts } from "~/server/handlers/post/get-posts";
import { postSearchParamsSchema } from "~/types/schema/post/search-post-schema";
import { readPostGuard } from "~/server/guard/post/read-post-guard";
import { readPostSchema } from "~/types/schema/post/read-post-schema";
import { getPost } from "~/server/handlers/post/get-post";
import { updatePostGuard } from "~/server/guard/post/update-post-guard";
import { updatePostSchema } from "~/types/schema/post/update-post-schema";
import { updatePost } from "~/server/handlers/post/update-post";
import { createPostGuard } from "~/server/guard/post/create-post-guard";
import { createPostSchema } from "~/types/schema/post/create-post-schema";
import { createPost } from "~/server/handlers/post/create-post";
import { deletePost } from "~/server/handlers/post/delete-post";
import { deletePostGuard } from "~/server/guard/post/delete-post-guard";
import { deletePostSchema } from "~/types/schema/post/delete-post-schema";

export const postRouter = createTRPCRouter({
  search: protectedProcedureByGuard(readPostsGuard)
    .input(postSearchParamsSchema)
    .query(async ({ ctx, input }) => {
      const [items, count] = await searchPosts({
        db: ctx.db,
        select: {
          id: true,
          title: true,
          published: true,
          author: {
            select: {
              fullName: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        filters: input,
        paginationProps: input,
      });

      return {
        items,
        count,
      };
    }),

  read: protectedProcedureByGuardWithInput(readPostGuard, readPostSchema).query(
    async ({ ctx, input }) => {
      return await getPost(ctx.db, input.id, {
        id: true,
        //TODO: Add more fields
      });
    },
  ),

  update: protectedProcedureByGuardWithInput(
    updatePostGuard,
    updatePostSchema,
  ).mutation(async ({ ctx, input }) => {
    return await updatePost(ctx.db, ctx.session.user, input);
  }),

  create: protectedProcedureByGuardWithInput(
    createPostGuard,
    createPostSchema,
  ).mutation(async ({ ctx, input }) => {
    return await createPost(ctx.db, ctx.session.user, input);
  }),

  delete: protectedProcedureByGuardWithInput(
    deletePostGuard,
    deletePostSchema,
  ).mutation(async ({ ctx, input }) => {
    return await deletePost(ctx.db, input.postId);
  }),
});
