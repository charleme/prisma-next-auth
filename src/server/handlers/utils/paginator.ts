import { type Prisma, type PrismaClient } from "@prisma/client";
import type { PaginationProps } from "~/types/schema/list/pagination";

type Models = Prisma.TypeMap["meta"]["modelProps"];

export function paginator<
  Model extends Models,
  Select extends Prisma.Args<Model, "findMany">["select"] | undefined,
>(
  db: PrismaClient,
  model: Model,
  findManyArgs: {
    select?: Select;
    where: Prisma.Args<Model, "findMany">["where"];
  },
  paginationProps: PaginationProps,
): Promise<
  [Prisma.Result<PrismaClient["user"], { select: Select }, "findMany">, number]
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientModel: any = db[model];

  const { per_page, page, sort_by, sort_order } = paginationProps;

  // Prisma Client query that retrieves data based
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return db.$transaction([
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    clientModel.findMany({
      select: findManyArgs.select,
      where: findManyArgs.where,
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: sort_by
        ? {
            [sort_by]: sort_order,
          }
        : undefined,
    }),

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    clientModel.count({ where: findManyArgs.where }),
  ]);
}
