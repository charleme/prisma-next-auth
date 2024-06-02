"use client";

import { SlidersHorizontal } from "lucide-react";
import type { Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { z } from "zod";
import React from "react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

const metaSchema = z
  .object({
    viewSelector: z.string().or(z.custom<React.ReactNode>()).optional(),
  })
  .optional();

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <SlidersHorizontal className="mr-2 size-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const meta = metaSchema.parse(column.columnDef.meta);
            const label = meta?.viewSelector ?? column.id;

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                <span className="truncate">{label}</span>
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
