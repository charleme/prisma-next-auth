import { type z } from "zod";
import { generateRequestSchemaFromFilters } from "~/types/schema/list/filters";
import { getUserFilters } from "~/app/(logged)/user/get-user-filters";

export const userSearchParamsSchema =
  generateRequestSchemaFromFilters(getUserFilters());

export type SearchUserFilter = z.infer<typeof userSearchParamsSchema>;
