import { Checkbox } from "~/components/ui/checkbox";
import { type Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
};

export function DataTableSelectAllRow<TData>({ table }: Props<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}
