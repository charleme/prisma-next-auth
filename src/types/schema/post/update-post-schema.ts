import { z } from "zod";

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
});

export type UpdatePost = z.infer<typeof updatePostSchema>;
