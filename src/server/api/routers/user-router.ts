import {
  createTRPCRouter,
  protectedProcedure,
  protectedProcedureByGuard,
  protectedProcedureByGuardWithInput,
} from "~/server/api/trpc";
import {
  getUserCount,
  listUser,
  searchUser,
} from "~/server/handlers/user/get-users";
import { createUserSchema } from "~/types/schema/user/create-user-schema";
import { createUser } from "~/server/handlers/user/create-user";
import { createUserGuard } from "~/server/guard/user/create-user-guard";
import { userSearchParamsSchema } from "~/types/schema/user/search-user-schema";
import { readUserGuard } from "~/server/guard/user/read-user-guard";
import { readUserSchema } from "~/types/schema/user/read-user-schema";
import { updateUserSchema } from "~/types/schema/user/update-user-schema";
import { updateUserGuard } from "~/server/guard/user/update-user-guard";
import { getUserByIdOrThrow } from "~/server/handlers/user/get-user";
import {
  updateUser,
  updateUserPassword,
} from "~/server/handlers/user/update-user";
import { deleteUserGuard } from "~/server/guard/user/delete-user-guard";
import { deleteUserSchema } from "~/types/schema/user/delete-user-schema";
import { deleteUser } from "~/server/handlers/user/delete-user";
import { updateUserPasswordGuard } from "~/server/guard/user/update-user-password-guard";
import { updateUserPasswordSchema } from "~/types/schema/user/update-user-password-schema";
import { listPosts } from "~/server/handlers/post/get-posts";
import { listComments } from "~/server/handlers/comment/get-comments";

export const userRouter = createTRPCRouter({
  read: protectedProcedureByGuardWithInput(readUserGuard, readUserSchema).query(
    async ({ input, ctx }) => {
      return await getUserByIdOrThrow({
        db: ctx.db,
        userId: input.userId,
        select: {
          id: true,
          active: true,
          firstName: true,
          lastName: true,
          fullName: true,
          email: true,
          roles: {
            select: {
              id: true,
            },
          },
        },
      });
    },
  ),

  create: protectedProcedureByGuard(createUserGuard)
    .input(createUserSchema)
    .mutation(
      async ({ input, ctx }) => await createUser({ db: ctx.db, input }),
    ),

  update: protectedProcedureByGuardWithInput(
    updateUserGuard,
    updateUserSchema,
  ).mutation(async ({ input, ctx }) => {
    return await ctx.db.$transaction((tx) =>
      updateUser({
        db: tx,
        updateUser: input,
        authUser: ctx.session.user,
      }),
    );
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return listUser({
      db: ctx.db,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        fullName: true,
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
    .input(userSearchParamsSchema)
    .query(async ({ ctx, input }) => {
      const [items, count] = await searchUser({
        db: ctx.db,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          fullName: true,
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

  delete: protectedProcedureByGuard(deleteUserGuard)
    .input(deleteUserSchema)
    .mutation(async ({ ctx, input }) => {
      await deleteUser({ db: ctx.db, input });
    }),

  updatePassword: protectedProcedureByGuardWithInput(
    updateUserPasswordGuard,
    updateUserPasswordSchema,
  ).mutation(async ({ ctx, input }) => {
    await updateUserPassword({
      db: ctx.db,
      userId: input.userId,
      newPassword: input.password,
    });
  }),

  listPosts: protectedProcedureByGuardWithInput(
    readUserGuard,
    readUserSchema,
  ).query(async ({ ctx, input }) => {
    return await listPosts({
      db: ctx.db,
      select: {
        id: true,
        title: true,
        published: true,
        authorId: true,
        author: {
          select: {
            fullName: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      authorId: input.userId,
      currentUser: ctx.session.user,
    });
  }),

  listComments: protectedProcedureByGuardWithInput(
    readUserGuard,
    readUserSchema,
  ).query(async ({ ctx, input }) => {
    return await listComments({
      db: ctx.db,
      select: {
        id: true,
        createdAt: true,
        post: {
          select: {
            id: true,
            author: {
              select: {
                fullName: true,
              },
            },
            title: true,
          },
        },
      },
      authorId: input.userId,
      currentUser: ctx.session.user,
    });
  }),
  userCount: protectedProcedure.query(async ({ ctx }) =>
    getUserCount({ db: ctx.db }),
  ),
});
