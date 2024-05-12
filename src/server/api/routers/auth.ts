import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { hash } from "bcrypt";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: { email, password }, ctx }) => {
      const hashedPassword = await hash(password, 10);

      await ctx.db.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    }),
});
