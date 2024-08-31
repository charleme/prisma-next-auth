import { Prisma, PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends({
    model: {
      $allModels: {
        async exists<T>(
          this: T,
          where: Prisma.Args<T, "findFirst">["where"],
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
          return !!(await (context as any).findFirst({ where }));
        },
        /**
         * Get the paginated results of a query and the total count of the results
         */
        async paginate<
          T,
          Select extends Prisma.Args<T, "findMany">["select"] | undefined,
        >(
          this: T,
          findManyArgs: {
            select?: Select;
            where: Prisma.Args<T, "findMany">["where"];
          },
          paginationProps: {
            per_page: number;
            page: number;
            orderBy: Prisma.Args<T, "findMany">["orderBy"];
          },
        ): Promise<[Prisma.Result<T, { select: Select }, "findMany">, number]> {
          // Get the current model at runtime
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context: any = Prisma.getExtensionContext(this);

          const { per_page, page, orderBy } = paginationProps;

          // Prisma Client query that retrieves data based
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            context.findMany({
              select: findManyArgs.select,
              where: findManyArgs.where,
              skip: page * per_page,
              take: per_page,
              orderBy: orderBy,
            }),

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            context.count({ where: findManyArgs.where }),
          ]);
        },
      },
    },
    result: {
      user: {
        fullName: {
          // the dependencies
          needs: { firstName: true, lastName: true },
          compute(user) {
            // the computation logic
            return `${user.firstName} ${user.lastName}`;
          },
        },
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

export type DbClient = ReturnType<typeof createPrismaClient>;

export type ExtArgs = DbClient["$extends"]["extArgs"];

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
