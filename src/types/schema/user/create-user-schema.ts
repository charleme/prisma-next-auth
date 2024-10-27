import * as z from "zod";
import { Role } from "~/types/enum/Role";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(5),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  roles: z.array(z.nativeEnum(Role)).min(1),
  active: z.boolean(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
