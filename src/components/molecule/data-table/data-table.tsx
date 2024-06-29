import * as React from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DataTablePagination } from "~/components/molecule/data-table/data-table-pagination";
import { z } from "zod";
import { Skeleton } from "~/components/ui/skeleton";
import { clsx } from "clsx";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;
}

const metaTableSchema = z
  .object({
    isInitialLoading: z.boolean().optional(),
    isLoading: z.boolean().optional(),
  })
  .optional();

export function DataTable<TData>({
  table,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const meta = metaTableSchema.parse(table.options.meta);
  const isInitialLoading = !!meta?.isInitialLoading;
  const isLoading = !!meta?.isLoading;

  return (
    <div
      className={cn("w-full space-y-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isInitialLoading ? (
            <TableBody>
              {Array.from({ length: table.getState().pagination.pageSize }).map(
                (_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: table.getAllColumns().length }).map(
                      (_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          ) : (
            <TableBody className={clsx({ "opacity-60": isLoading })}>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination
          table={table}
          isInitialLoading={isInitialLoading}
        />
      </div>
    </div>
  );
}
