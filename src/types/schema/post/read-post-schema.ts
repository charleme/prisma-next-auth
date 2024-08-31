import { z } from "zod";

export const readPostSchema = z.object({
  id: z.string(),
});

export type ReadPost = z.infer<typeof readPostSchema>;
