/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";

import { db, type DbClient } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";
import { handleErrors } from "~/server/handlers/error";
import { type DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";
import { type Role } from "~/types/enum/Role";
import { type User } from "next-auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const errorFormatter = ({
  shape,
  error,
}: {
  shape: DefaultErrorShape;
  error: TRPCError;
}) => {
  const errorData = handleErrors(error.cause);

  return {
    ...shape,
    data: {
      ...shape.data,
      code: errorData ? "UNPROCESSABLE_CONTENT" : shape.data.code,
      errors: errorData,
    },
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter,
});

export type TrpcFormatedError = ReturnType<typeof errorFormatter>;

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedureByRole = (...roleIds: Role[]) => {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const hasRight = roleIds.some((roleId) =>
      ctx.session.user.roles.includes(roleId),
    );

    if (!hasRight) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  });
};

export function protectedProcedureByGuard(
  guard: (authUser: User, db: DbClient) => boolean,
) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const isValid = guard(ctx.session.user, ctx.db);

    if (!isValid) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  });
}

export function protectedProcedureByGuardWithInput<Output = unknown>(
  guard: (authUser: User, input: Output, db: DbClient) => boolean,
  schema: Zod.Schema<Output>,
) {
  return protectedProcedure.input(schema).use(async ({ ctx, input, next }) => {
    const parsedInput = schema.parse(input);

    const isValid = guard(ctx.session.user, parsedInput, db);

    if (isValid) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    return next();
  });
}
