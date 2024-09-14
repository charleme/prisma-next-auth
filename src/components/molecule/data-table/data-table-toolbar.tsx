"use client";

import * as React from "react";
import type { DataTableFilterField } from "~/types/data-table";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { DataTableViewOptions } from "~/components/molecule/data-table/data-table-view-options";
import { z } from "zod";
import { DataTableFilters } from "~/components/molecule/data-table/filters/data-table-filters";

interface DataTableToolbarProps<TData extends object>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: Readonly<DataTableFilterField<TData>[]>;
}

export function DataTableToolbar<TData extends object>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const resetFilters = () => {
    table.resetGlobalFilter();
    table.resetColumnFilters();
  };

  const onResetFilters =
    z
      .object({
        onResetFilters: z.function().optional(),
      })
      .optional()
      .parse(table.options.meta)?.onResetFilters ?? resetFilters;

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {filterFields.map((column) => (
          <DataTableFilters
            table={table}
            column={column}
            key={column.value.toString()}
          />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => onResetFilters()}
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
