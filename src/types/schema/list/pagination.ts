import { z } from "zod";
import { DEFAULT_TABLE_PAGE_SIZES } from "~/types/constants/table";

export const paginationSchema = z.object({
  per_page: z.number(),
  page: z.number(),
  sort_by: z.string().nullish(),
  sort_order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const getPaginationListParamsSchema = (
  perPageOptions: readonly [number, ...number[]] = DEFAULT_TABLE_PAGE_SIZES,
) =>
  z.object({
    per_page: getPerPageStringifyOptions(perPageOptions)
      .optional()
      .transform((v) => (v ? +v : undefined)),
    page: z
      .string()
      .optional()
      .transform((v) => (v ? +v : undefined)),
    sort_by: z.string().nullish(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });

export type PaginationProps = z.infer<typeof paginationSchema>;

export function getPerPageStringifyOptions<T extends number>(
  perPageOptionNumber: readonly [T, ...T[]],
) {
  const option = perPageOptionNumber.map(String) as [`${T}`, ...`${T}`[]];
  return z.enum(option).transform((value) => Number(value) as T);
}
