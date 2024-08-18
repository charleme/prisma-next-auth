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
import { useLazyDataTable } from "~/hooks/use-lazy-data-table";
import { api } from "~/trpc/react";
import type { UserSearchItem } from "~/types/query/user/search";
import { userFilters } from "~/app/(logged)/userFilters";

export function ComplexUserLazyList() {
  const columns = getUserColumns();

  const { ...lazyTableOptions } = useLazyDataTable<UserSearchItem>({
    useQuery: api.user.search.useQuery,
  });

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...lazyTableOptions,
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={userFilters} />
    </DataTable>
  );
}
