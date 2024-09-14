import type { DataTableFilterFieldVariants } from "~/types/data-table";
import type { Column } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { useId } from "react";

export function DataTableCheckboxFilter<TData extends object>({
  tableColumn,
  columnData,
}: {
  columnData: DataTableFilterFieldVariants<TData>["checkbox"];
  tableColumn: Column<TData>;
}) {
  const inputId = useId();
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
      <Label htmlFor={inputId}>{columnData.label}</Label>
      <Checkbox
        id={inputId}
        checked={Boolean(tableColumn.getFilterValue())}
        onCheckedChange={(checked) =>
          tableColumn.setFilterValue(Boolean(checked))
        }
      />
    </div>
  );
}
