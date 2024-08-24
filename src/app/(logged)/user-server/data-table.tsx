"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { getUserColumns } from "~/app/(logged)/user-columns";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import React from "react";
import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import { userFilters } from "~/app/(logged)/user-filters";
import { api } from "~/trpc/react";

export function ServerSideDataTable({
  children,
}: {
  children: React.ReactNode;
}) {
  const columns = getUserColumns();

  const serverTableOptions = useSearchParamsDataTable({
    filters: userFilters,
    useQuery: (filters) => api.user.search.useQuery(filters),
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
      <DataTableToolbar table={table} filterFields={userFilters}>
        {children}
      </DataTableToolbar>
    </DataTable>
  );
}
