import { z } from "zod";

export const paginationSchema = z.object({
  per_page: z.number(),
  page: z.number(),
  sort_by: z.string().nullish(),
  sort_order: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationProps = z.infer<typeof paginationSchema>;
