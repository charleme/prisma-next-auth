import { paginationSchema } from "~/types/schema/list/pagination";
import { z } from "zod";

export const userFilterSchema = z.object({
  global: z.string().optional().default(""),
  email: z.string().optional(),
  roles: z.array(z.coerce.number()).optional(),
});

export const searchUserSchema = paginationSchema.and(userFilterSchema);

export type SearchUserFilter = z.infer<typeof userFilterSchema>;
