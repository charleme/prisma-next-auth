import {
  createTRPCRouter,
  protectedProcedureByRights,
} from "~/server/api/trpc";
import { Right } from "~/types/enum/Right";
import { z } from "zod";
import { roleGeneralFormSchema } from "~/types/schema/role/roleGeneralForm";

export const roleRouter = createTRPCRouter({
  list: protectedProcedureByRights([Right.VIEW_ROLE])
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
  get: protectedProcedureByRights([Right.VIEW_ROLE])
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.role.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    }),
  create: protectedProcedureByRights([Right.UPDATE_ROLE])
    .input(roleGeneralFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.create({
        data: {
          name: input.name,
          description: input.description,
        },
        select: {
          id: true,
        },
      });
    }),
  update: protectedProcedureByRights([Right.UPDATE_ROLE])
    .input(roleGeneralFormSchema.extend({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),
});
