import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { type Column } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import React from "react";

interface DataTableColumnHeaderButtonProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  onClick?: () => void;
}

export function DataColumnHeaderButtonInner<TData, TValue>(
  {
    column,
    title,
    className,
    onClick,
  }: DataTableColumnHeaderButtonProps<TData, TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      ref={ref}
      aria-label={
        column.getIsSorted() === "desc"
          ? "Sorted descending. Click to sort ascending."
          : column.getIsSorted() === "asc"
            ? "Sorted ascending. Click to sort descending."
            : "Not sorted. Click to sort ascending."
      }
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => onClick?.()}
    >
      <span>{title}</span>
      {column.getCanSort() && column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 size-4" aria-hidden="true" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 size-4" aria-hidden="true" />
      ) : (
        <ChevronsUpDown className="ml-2 size-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export const DataColumnHeaderButton = React.forwardRef(
  DataColumnHeaderButtonInner,
) as <TData, TValue>(
  props: DataTableColumnHeaderButtonProps<TData, TValue> & {
    ref?: React.ForwardedRef<HTMLButtonElement>;
  },
) => ReturnType<typeof DataColumnHeaderButtonInner>;
