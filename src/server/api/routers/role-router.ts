import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { listRole } from "~/server/handlers/role/get-roles";

export const roleRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listRole({
      db: ctx.db,
      select: {
        id: true,
        name: true,
      },
    });
  }),
});
