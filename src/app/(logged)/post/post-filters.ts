import { type DataTableServerFilterField } from "~/types/data-table";

export const postFilters = [
  {
    placeholder: "Title",
    value: "title",
    variant: "input",
  },
] as const satisfies DataTableServerFilterField[];
