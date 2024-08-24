"use client";

import { type UserListItem } from "~/types/query/user/list";
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
import { userFilters } from "~/app/(logged)/user-filters";

export function ComplexUserList({ users }: { users: UserListItem[] }) {
  const columns = getUserColumns();

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={userFilters} />
    </DataTable>
  );
}
