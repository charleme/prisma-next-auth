import * as z from "zod";

export const deleteUserSchema = z.object({
  userId: z.string(),
});

export type DeleteUser = z.infer<typeof deleteUserSchema>;
