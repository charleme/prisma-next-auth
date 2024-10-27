import { z } from "zod";

export const readUserSchema = z.object({
  userId: z.string(),
});

export type ReadUser = z.infer<typeof readUserSchema>;
