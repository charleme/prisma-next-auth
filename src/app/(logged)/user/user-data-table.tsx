"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { useUserColumns } from "~/app/(logged)/user/user-columns";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import React from "react";
import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import { getUserFilters } from "~/app/(logged)/user/get-user-filters";
import { api } from "~/trpc/react";

export function ServerSideDataTable({
  canViewActive,
  children,
}: {
  canViewActive: boolean;
  children: React.ReactNode;
}) {
  const columns = useUserColumns(canViewActive);
  const userFilters = getUserFilters(canViewActive);

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
