import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { registerSchema } from "~/types/schema/auth/register";
import { register } from "~/server/handlers/auth/auth";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => await register({ db: ctx.db, input })),
});
