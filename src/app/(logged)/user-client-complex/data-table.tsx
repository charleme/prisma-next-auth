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
import { getUserColumns } from "~/app/(logged)/userColumns";
import { type DataTableFilterField } from "~/types/data-table";
import { DataTableToolbar } from "~/components/molecule/data-table/data-table-toolbar";
import { getUserFilters } from "~/app/(logged)/userFilters";

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

  const filterFields: DataTableFilterField<UserListItem>[] = getUserFilters();

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
