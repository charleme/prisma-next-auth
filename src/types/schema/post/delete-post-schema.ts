import { z } from "zod";

export const deletePostSchema = z.object({
  postId: z.string(),
});

export type DeletePost = z.infer<typeof deletePostSchema>;
