import {
  createTRPCRouter,
  protectedProcedureByRights,
} from "~/server/api/trpc";
import { Right } from "~/types/enum/Right";
import { z } from "zod";
import { roleGeneralFormSchema } from "~/types/schema/role/role-general-form";
import { roleRightFormSchema } from "~/types/schema/role/role-right-form";
import { TRPCError } from "@trpc/server";

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
      return ctx.db.role.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });
    }),
  getRights: protectedProcedureByRights([Right.VIEW_ROLE])
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const role = await ctx.db.role.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          rights: {
            select: {
              id: true,
            },
          },
        },
      });
      return role.rights.map((right) => right.id);
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
  updateRights: protectedProcedureByRights([Right.UPDATE_ROLE])
    .input(roleRightFormSchema)
    .mutation(async ({ ctx, input }) => {
      const rightAction = input.checked ? "connect" : "disconnect";
      await ctx.db.role.update({
        where: { id: input.id },
        data: {
          rights: {
            [rightAction]: {
              id: input.rightId,
            },
          },
        },
      });
    }),
});
