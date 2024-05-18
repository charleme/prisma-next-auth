import { createTRPCRouter, protectedProcedureByRoles } from "~/server/api/trpc";
import { Right } from "~/types/enum/Right";
import { z } from "zod";

export const roleRouter = createTRPCRouter({
  list: protectedProcedureByRoles([Right.VIEW_RIGHT])
    .input(z.void())
    .query(async ({ ctx }) => {
      return ctx.db.role.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: {
              users: true,
              rights: true,
            },
          },
        },
      });
    }),
});
