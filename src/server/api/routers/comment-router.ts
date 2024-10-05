import {
  createTRPCRouter,
  protectedProcedureByGuardWithInput,
} from "~/server/api/trpc";
import { deleteCommentGuard } from "~/server/guard/comment/delete-comment-guard";
import { deleteCommentSchema } from "~/types/schema/comment/delete-comment-schema";
import { deleteComment } from "~/server/handlers/comment/delete-comment";
import { createCommentGuard } from "~/server/guard/comment/create-comment-guard";
import { createCommentSchema } from "~/types/schema/comment/create-delete-schema";
import { createComment } from "~/server/handlers/comment/create-comment";

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
});
