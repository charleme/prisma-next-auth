import { z, type ZodType } from "zod";
import {
  type DataTableFilterFieldVariantsFields,
  type DataTableServerFilterField,
} from "~/types/data-table";
import { paginationSchema } from "~/types/schema/list/pagination";

const requestParamsSchema = {
  global: z.string().optional(),
  input: z.string().optional(),
  multiSelectString: z.string().array().optional(),
  multiSelectNumber: z.number().array().optional(),
  selectString: z.string().optional(),
  selectNumber: z.number().optional(),
  checkbox: z.boolean(),
} as const;

type RequestParams<Filters extends Readonly<DataTableServerFilterField[]>> = {
  [K in Filters[number] as K["value"]]: (typeof requestParamsSchema)[K["variant"]];
};

export function generateRequestSchemaFromFilters<
  Filters extends Readonly<DataTableServerFilterField[]>,
>(filters: Filters) {
  const schema = Object.fromEntries(
    filters.map((filter) => {
      return [filter.value, requestParamsSchema[filter.variant]];
    }),
  ) as RequestParams<Filters>;
  return z.object(schema).and(paginationSchema);
}

type UrlParsedParams<Filters extends Readonly<DataTableServerFilterField[]>> = {
  [Filter in Filters[number] as Filter["value"]]: (typeof urlParamSchema)[Filter["variant"]];
};

const urlParamSchema = {
  global: z.string().optional(),
  input: z.string().optional(),
  multiSelectString: z
    .string()
    .optional()
    .transform((v) => (v !== "" ? v?.split(".") : undefined)),
  multiSelectNumber: z
    .string()
    .optional()
    .transform((v) => (v !== "" ? v?.split(".").map(Number) : undefined)),
  selectString: z.string().optional(),
  selectNumber: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),
  checkbox: z
    .literal("true")
    .or(z.literal("false"))
    .optional()
    .transform((v) => v === "true"),
} satisfies {
  [Key in keyof DataTableFilterFieldVariantsFields]: ZodType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    string | undefined
  >;
};

export function generateUrlSchemaFromFilters<
  Filters extends Readonly<DataTableServerFilterField[]>,
>(filters: Filters) {
  const schema = Object.fromEntries(
    filters.map((filter) => {
      return [filter.value, urlParamSchema[filter.variant]];
    }),
  ) as UrlParsedParams<Filters>;
  return z.object({
    ...schema,
    page: z.coerce.number().optional(),
    per_page: z.coerce.number().optional(),
    sort_by: z.string().optional(),
    sort_order: z.enum(["asc", "desc"]).optional(),
  });
}

export type RequestInput<
  Filters extends Readonly<DataTableServerFilterField[]>,
> = z.infer<ReturnType<typeof generateRequestSchemaFromFilters<Filters>>>;
