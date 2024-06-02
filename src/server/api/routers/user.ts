import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { listUser, searchUser } from "~/server/handlers/user/getUsers";
import { searchUserSchema } from "~/types/schema/user/search";

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listUser({
      db: ctx.db,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
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
