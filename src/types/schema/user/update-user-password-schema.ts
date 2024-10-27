import { z } from "zod";

const passwordSchema = z.string().trim().min(5);
export const updateUserPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ["confirmPassword"],
    message: "The two passwords are not identical",
  });

export const updateUserPasswordSchema = z.object({
  userId: z.string(),
  password: passwordSchema,
});

export type UpdateUserPasswordForm = z.infer<
  typeof updateUserPasswordFormSchema
>;
export type UpdateUserPassword = z.infer<typeof updateUserPasswordSchema>;
