import { createTRPCRouter, protectedProcedureByGuard } from "~/server/api/trpc";
import { readPostsGuard } from "~/server/guard/post/read-posts-guard";
import { searchPosts } from "~/server/handlers/post/get-posts";
import { postSearchParamsSchema } from "~/types/schema/post/search-post-schema";

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
});
