import { z } from "zod";

export const roleRightFormSchema = z.object({
  id: z.number(),
  rightId: z.number(),
  checked: z.boolean(),
});

export type RoleRightFormData = z.infer<typeof roleRightFormSchema>;
