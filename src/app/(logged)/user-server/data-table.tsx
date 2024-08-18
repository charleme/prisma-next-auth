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
import React from "react";
import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import { userFilters } from "~/app/(logged)/userFilters";
import { api } from "~/trpc/react";
import { type UserSearchItem } from "~/types/query/user/search";

export function ServerSideDataTable({
  children,
}: {
  children: React.ReactNode;
}) {
  const columns = getUserColumns();

  const serverTableOptions = useSearchParamsDataTable<
    UserSearchItem,
    typeof userFilters
  >({
    useQuery: api.user.search.useQuery,
    filters: userFilters,
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
