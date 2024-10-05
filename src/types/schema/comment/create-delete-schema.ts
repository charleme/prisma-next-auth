import { z } from "zod";

export const createCommentFormSchema = z.object({
  content: z.string().min(1, { message: "This field is required" }),
});

export const createCommentSchema = createCommentFormSchema.and(
  z.object({
    postId: z.string(),
  }),
);

export type CreateCommentForm = z.infer<typeof createCommentFormSchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
