import { z } from "zod";

export const updatePostFormSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }).max(255),
  content: z.string().min(1, { message: "This field is required" }),
  published: z.boolean(),
});

export const updatePostSchema = updatePostFormSchema.and(
  z.object({
    id: z.string(),
  }),
);

export type UpdatePostForm = z.infer<typeof updatePostFormSchema>;

export type UpdatePost = z.infer<typeof updatePostSchema>;
