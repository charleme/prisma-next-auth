import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureByGuardWithInput,
} from "~/server/api/trpc";
import { deleteCommentGuard } from "~/server/guard/comment/delete-comment-guard";
import { deleteCommentSchema } from "~/types/schema/comment/delete-comment-schema";
import { deleteComment } from "~/server/handlers/comment/delete-comment";
import { createCommentGuard } from "~/server/guard/comment/create-comment-guard";
import { createCommentSchema } from "~/types/schema/comment/create-delete-schema";
import { createComment } from "~/server/handlers/comment/create-comment";
import {
  getCommentCount,
  getCommentCountPerDay,
} from "~/server/handlers/comment/get-comments";

export const commentRouter = createTRPCRouter({
  delete: protectedProcedureByGuardWithInput(
    deleteCommentGuard,
    deleteCommentSchema,
  ).mutation(({ input, ctx }) => {
    return deleteComment(ctx.db, input.commentId);
  }),
  create: protectedProcedureByGuardWithInput(
    createCommentGuard,
    createCommentSchema,
  ).mutation(({ input, ctx }) => {
    return createComment(ctx.db, ctx.session.user, input);
  }),

  getCommentCountPerDay: protectedProcedure.query(async ({ ctx }) => {
    const previousWeek = new Date();
    previousWeek.setDate(previousWeek.getDate() - 7);
    previousWeek.setHours(0, 0, 0, 0);

    const now = new Date();

    return getCommentCountPerDay({
      db: ctx.db,
      from: previousWeek,
      to: now,
    });
  }),

  getCommentEvolution: protectedProcedure.query(async ({ ctx }) => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    twoWeeksAgo.setHours(0, 0, 0, 0);

    const previousWeek = new Date();
    previousWeek.setDate(previousWeek.getDate() - 7);
    previousWeek.setHours(0, 0, 0, 0);

    const now = new Date();

    const [currentWeekCount, previousWeekCount] = await Promise.all([
      getCommentCount({
        db: ctx.db,
        from: previousWeek,
        to: now,
      }),
      getCommentCount({
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
