import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureByGuard,
  protectedProcedureByGuardWithInput,
} from "~/server/api/trpc";
import { readPostsGuard } from "~/server/guard/post/read-posts-guard";
import {
  getPostCount,
  getPostCountPerDay,
  searchPosts,
} from "~/server/handlers/post/get-posts";
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
          authorId: true,
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
        currentUser: ctx.session.user,
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
        title: true,
        content: true,
        authorId: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
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

  getComments: protectedProcedureByGuardWithInput(
    readPostGuard,
    readPostSchema,
  ).query(async ({ ctx, input }) => {
    return await getPost(ctx.db, input.id, {
      id: true,
      comments: {
        select: {
          id: true,
          content: true,
          authorId: true,
          createdAt: true,
          author: {
            select: {
              fullName: true,
            },
          },
        },
      },
    });
  }),

  getPostCountPerDay: protectedProcedure.query(async ({ ctx }) => {
    const previousWeek = new Date();
    previousWeek.setDate(previousWeek.getDate() - 7);
    previousWeek.setHours(0, 0, 0, 0);

    const now = new Date();

    return getPostCountPerDay({
      db: ctx.db,
      from: previousWeek,
      to: now,
    });
  }),
  getPostEvolution: protectedProcedure.query(async ({ ctx }) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    twoWeeksAgo.setHours(0, 0, 0, 0);

    const previousWeek = new Date();
    previousWeek.setDate(previousWeek.getDate() - 7);
    previousWeek.setHours(0, 0, 0, 0);

    const now = new Date();

    const [currentWeekCount, previousWeekCount] = await Promise.all([
      getPostCount({
        db: ctx.db,
        from: previousWeek,
        to: now,
      }),
      getPostCount({
        db: ctx.db,
        from: twoWeeksAgo,
        to: previousWeek,
      }),
    ]);

    const rateBetweenWeeks = previousWeekCount
      ? currentWeekCount / previousWeekCount
      : null;

    return {
      currentWeekCount,
      rateBetweenWeeks,
    };
  }),
});
