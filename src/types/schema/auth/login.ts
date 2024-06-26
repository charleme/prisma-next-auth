import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(5),
});

export type LoginFormData = z.infer<typeof loginSchema>;
