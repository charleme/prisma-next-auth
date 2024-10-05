import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }).max(255),
  content: z.string().min(1, { message: "This field is required" }),
  published: z.boolean(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
