import { z } from "zod";

export const roleGeneralFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export type RoleGeneralFormData = z.infer<typeof roleGeneralFormSchema>;
