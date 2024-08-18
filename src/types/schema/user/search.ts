import { type z } from "zod";
import { generateRequestSchemaFromFilters } from "~/types/schema/list/filters";
import { userFilters } from "~/app/(logged)/userFilters";

export const userListParamsSchema =
  generateRequestSchemaFromFilters(userFilters);

export type SearchUserFilter = z.infer<typeof userListParamsSchema>;
