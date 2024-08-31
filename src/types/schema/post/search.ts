import { type z } from "zod";
import { generateRequestSchemaFromFilters } from "~/types/schema/list/filters";
import { postFilters } from "~/app/(logged)/post/post-filters";

export const postSearchParamsSchema =
  generateRequestSchemaFromFilters(postFilters);

export type SearchPostFilter = z.infer<typeof postSearchParamsSchema>;
