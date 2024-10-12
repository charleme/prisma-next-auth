import { type z } from "zod";
import { updatePostFormSchema } from "~/types/schema/post/update-post-schema";

export const createPostSchema = updatePostFormSchema;

export type CreatePost = z.infer<typeof createPostSchema>;
