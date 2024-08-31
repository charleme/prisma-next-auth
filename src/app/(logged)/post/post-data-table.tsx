"use client";

import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { type PropsWithChildren } from "react";
import { postFilters } from "~/app/(logged)/post/post-filters";
import { postColumns } from "~/app/(logged)/post/post-columns";
import { api } from "~/trpc/react";

export const PostDataTable = ({ children }: PropsWithChildren) => {
  const serverTableOptions = useSearchParamsDataTable({
    filters: postFilters,
    useQuery: (filters) => api.post.search.useQuery(filters),
  });

  const table = useReactTable({
    ...serverTableOptions,
    columns: postColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={postFilters}>
        {children}
      </DataTableToolbar>
    </DataTable>
  );
};
