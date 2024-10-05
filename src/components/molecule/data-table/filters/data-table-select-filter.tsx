import type { DataTableFilterFieldVariants } from "~/types/data-table";
import type { Column } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import * as React from "react";

export function DataTableSelectFilter<TData extends object>({
  tableColumn,
  columnData,
}: {
  columnData: DataTableFilterFieldVariants<TData>[
    | "selectNumber"
    | "selectString"];
  tableColumn: Column<TData>;
}) {
  return (
    <Select value={tableColumn.getFilterValue()?.toString()}>
      <SelectTrigger>
        <SelectValue placeholder={columnData.label} />
      </SelectTrigger>
      <SelectContent>
        {columnData.options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            onSelect={() =>
              tableColumn?.setFilterValue(() =>
                tableColumn?.setFilterValue(option.value),
              )
            }
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
