"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { getUserColumns } from "~/app/(logged)/userColumns";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import { type api } from "~/trpc/server";
import React, { type PropsWithChildren } from "react";
import { useServerDataTable } from "~/hooks/use-server-data-table";
import { getUserFilters } from "~/app/(logged)/userFilters";

export function ServerSideDataTable({
  usersPromise,
  children,
}: PropsWithChildren<{
  usersPromise: ReturnType<typeof api.user.search>;
}>) {
  const columns = getUserColumns();

  const filterFields = getUserFilters();

  const serverTableOptions = useServerDataTable({
    query: usersPromise,
    filterFields,
  });

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...serverTableOptions,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        {children}
      </DataTableToolbar>
    </DataTable>
  );
}
