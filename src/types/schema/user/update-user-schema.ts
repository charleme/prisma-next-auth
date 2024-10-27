import { z } from "zod";
import { Role } from "~/types/enum/Role";

export const updateUserFormSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    roles: z.array(z.nativeEnum(Role)).min(1),
    active: z.boolean(),
  })
  .strict();

export const updateUserSchema = updateUserFormSchema.extend({
  userId: z.string(),
});

export type UpdateUserForm = z.infer<typeof updateUserFormSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
