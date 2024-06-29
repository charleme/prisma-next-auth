import { ArrowDown, ArrowUp, EyeOff } from "lucide-react";
import { type Column } from "@tanstack/react-table";

import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import React from "react";
import { DataColumnHeaderButton } from "~/components/molecule/data-table/data-column-header-button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [openMenu, setOpenMenu] = React.useState(false);

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  if (!column.getCanHide()) {
    return (
      <DataColumnHeaderButton
        column={column}
        title={title}
        onClick={() => column.toggleSorting()}
      />
    );
  }

  return (
    <DropdownMenu open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
      <DropdownMenuTrigger asChild>
        <DataColumnHeaderButton
          column={column}
          title={title}
          onClick={() => {
            setOpenMenu((cur) => !cur);
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {column.getCanSort() && (
          <>
            <DropdownMenuItem
              aria-label="Sort ascending"
              onClick={() => column.toggleSorting(false)}
            >
              <ArrowUp
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem
              aria-label="Sort descending"
              onClick={() => column.toggleSorting(true)}
            >
              <ArrowDown
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Desc
            </DropdownMenuItem>
          </>
        )}
        {column.getCanSort() && column.getCanHide() && (
          <DropdownMenuSeparator />
        )}
        {column.getCanHide() && (
          <DropdownMenuItem
            aria-label="Hide column"
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Hide
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
