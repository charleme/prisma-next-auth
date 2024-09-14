import { DebouncedInput } from "~/components/form/debounce-input";
import { DataTableFacetedFilter } from "~/components/molecule/data-table/filters/data-table-faceted-filter";
import * as React from "react";
import { type DataTableFilterField } from "~/types/data-table";
import { type Table } from "@tanstack/react-table";
import { DataTableSelectFilter } from "~/components/molecule/data-table/filters/data-table-select-filter";
import { DataTableCheckboxFilter } from "~/components/molecule/data-table/filters/data-table-checkbox-filter";

type Props<TData extends object> = {
  table: Table<TData>;
  column: DataTableFilterField<TData>;
};

export function DataTableFilters<TData extends object>({
  table,
  column,
}: Props<TData>) {
  if (column.variant === "global") {
    return (
      <DebouncedInput
        placeholder={column.placeholder}
        value={(table.getState().globalFilter as string | number) ?? ""}
        onChange={(value) => table.setGlobalFilter(value)}
        className="h-8 w-40 lg:w-64"
      />
    );
  }
  const tableColumn = table.getColumn(String(column.value));

  if (column.variant === "input") {
    return (
      tableColumn && (
        <DebouncedInput
          placeholder={column.placeholder}
          value={
            (tableColumn.getFilterValue() as
              | string
              | number
              | null
              | undefined) ?? ""
          }
          onChange={(value) => tableColumn?.setFilterValue(value)}
          className="h-8 w-40 lg:w-64"
        />
      )
    );
  }
  if (
    column.variant === "multiSelectNumber" ||
    column.variant === "multiSelectString"
  ) {
    return (
      tableColumn && (
        <DataTableFacetedFilter tableColumn={tableColumn} columnData={column} />
      )
    );
  }
  if (column.variant === "selectString" || column.variant === "selectNumber") {
    return (
      tableColumn && (
        <DataTableSelectFilter columnData={column} tableColumn={tableColumn} />
      )
    );
  }
  if (column.variant === "checkbox") {
    return (
      tableColumn && (
        <DataTableCheckboxFilter
          columnData={column}
          tableColumn={tableColumn}
        />
      )
    );
  }

  throw new Error("unknown filter");
}
