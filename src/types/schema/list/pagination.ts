import { z } from "zod";

export const paginationSchema = z.object({
  per_page: z.number(),
  page: z.number(),
  sort_by: z.string().nullish(),
  sort_order: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationProps = z.infer<typeof paginationSchema>;

export function getPerPageStringifyOptions<T extends number>(
  perPageOptionNumber: readonly [T, ...T[]],
) {
  const option = perPageOptionNumber.map(String) as [`${T}`, ...`${T}`[]];
  return z.enum(option).transform((value) => Number(value) as T);
}
