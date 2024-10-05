import { type DataTableServerFilterField } from "~/types/data-table";

export const postFilters = [
  {
    placeholder: "Filter by title...",
    value: "title",
    variant: "input",
  },
  {
    variant: "checkbox",
    value: "ownPost",
    label: "My posts",
  },
] as const satisfies DataTableServerFilterField[];
