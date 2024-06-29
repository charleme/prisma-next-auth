import { Checkbox } from "~/components/ui/checkbox";
import { type Row } from "@tanstack/react-table";

type Props<TData> = {
  row: Row<TData>;
};

export function DataTableSelectOneRow<TData>({ row }: Props<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}
