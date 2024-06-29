import { DataTableSelectAllRow } from "~/components/molecule/data-table/data-table-select-all-row";
import { DataTableSelectOneRow } from "~/components/molecule/data-table/data-table-select-one-row";

export const DEFAULT_TABLE_PAGE_SIZES = [10, 25, 50, 100] as const;

export const SELECTION_COLUMN = {
  id: "selection",
  header: DataTableSelectAllRow,
  cell: DataTableSelectOneRow,
  enableSorting: false,
  enableHiding: false,
} as const;
