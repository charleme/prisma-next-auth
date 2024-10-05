"use client";

import { useSearchParamsDataTable } from "~/hooks/use-search-params-data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { type PropsWithChildren } from "react";
import { postFilters } from "~/app/(logged)/post/post-filters";
import { usePostColumns } from "~/app/(logged)/post/use-post-columns";
import { api } from "~/trpc/react";
import { type DataTableFilterField } from "~/types/data-table";
import { type PostSearchItem } from "~/types/query/post/search";

export const PostDataTable = ({ children }: PropsWithChildren) => {
  const serverTableOptions = useSearchParamsDataTable({
    filters: postFilters,
    useQuery: (filters) => api.post.search.useQuery(filters),
  });

  const columns = usePostColumns();

  const table = useReactTable({
    ...serverTableOptions,
    initialState: {
      ...serverTableOptions.initialState,
      columnVisibility: {
        ownPost: false, // column always hide
      },
    },
    columns,
    enableRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        // Have to use "as" because filtering post on an not existing column
        filterFields={postFilters as DataTableFilterField<PostSearchItem>[]}
      >
        {children}
      </DataTableToolbar>
    </DataTable>
  );
};
