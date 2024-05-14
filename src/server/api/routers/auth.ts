import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { hash } from "bcrypt";
import { registerSchema } from "~/types/schema/register";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(
      async ({ input: { email, password, lastName, firstName }, ctx }) => {
        const hashedPassword = await hash(password, 10);

        await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
          },
        });
      },
    ),
});
