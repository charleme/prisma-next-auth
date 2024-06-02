"use client";

import * as React from "react";
import type { DataTableFilterField } from "~/types/data-table";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DataTableFacetedFilter } from "~/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options";
import { DebouncedInput } from "~/components/form/debounce-input";

interface DataTableToolbarProps<TData extends object>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData extends object>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter !== "";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {filterFields.map((column) => {
          if (column.variant === "global") {
            return (
              <DebouncedInput
                key="global"
                placeholder={column.placeholder}
                value={(table.getState().globalFilter as string | number) ?? ""}
                onChange={(value) => table.setGlobalFilter(value)}
                className="h-8 w-40 lg:w-64"
              />
            );
          }
          if (column.variant === "input") {
            return (
              table.getColumn(column.value ? String(column.value) : "") && (
                <DebouncedInput
                  key={String(column.value)}
                  placeholder={column.placeholder}
                  value={
                    (table.getColumn(String(column.value))?.getFilterValue() as
                      | string
                      | number) ?? ""
                  }
                  onChange={(value) =>
                    table.getColumn(String(column.value))?.setFilterValue(value)
                  }
                  className="h-8 w-40 lg:w-64"
                />
              )
            );
          }
          if (column.variant === "multiSelect") {
            return (
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : "",
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
            );
          }
        })}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              table.resetColumnFilters();
              table.resetGlobalFilter();
            }}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {table.options.enableHiding !== false && (
          <DataTableViewOptions table={table} />
        )}
      </div>
    </div>
  );
}
