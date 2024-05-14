import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
