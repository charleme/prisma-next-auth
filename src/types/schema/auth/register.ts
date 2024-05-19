import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(5),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
