import { z } from "zod";

export const deleteCommentSchema = z.object({
  commentId: z.string(),
});

export type DeleteComment = z.infer<typeof deleteCommentSchema>;
