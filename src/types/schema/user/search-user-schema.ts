import { type z } from "zod";
import { generateRequestSchemaFromFilters } from "~/types/schema/list/filters";
import { userFilters } from "~/app/(logged)/user/user-filters";

export const userSearchParamsSchema =
  generateRequestSchemaFromFilters(userFilters);

export type SearchUserFilter = z.infer<typeof userSearchParamsSchema>;
