import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
