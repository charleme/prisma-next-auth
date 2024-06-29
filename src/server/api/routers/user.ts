import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureByGuard,
} from "~/server/api/trpc";
import { listUser, searchUser } from "~/server/handlers/user/get-users";
import { searchUserSchema } from "~/types/schema/user/search";
import { createUserSchema } from "~/types/schema/auth/register";
import { register } from "~/server/handlers/user/create-user";
import { createUserGuard } from "~/server/guard/user/create-user";

export const userRouter = createTRPCRouter({
  create: protectedProcedureByGuard(createUserGuard)
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => await register({ db: ctx.db, input })),

  list: protectedProcedure.query(async ({ ctx }) => {
    return listUser({
      db: ctx.db,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        active: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),

  search: protectedProcedure
    .input(searchUserSchema)
    .query(async ({ ctx, input }) => {
      const [items, count] = await searchUser({
        db: ctx.db,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          active: true,
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        filters: input,
        paginationProps: input,
      });

      return {
        items,
        count,
      };
    }),
});
