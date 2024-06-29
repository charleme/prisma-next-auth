"use client";

import { type UserListItem } from "~/types/query/user/list";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "~/components/molecule/data-table/data-table";
import { getUserColumns } from "~/app/(logged)/userColumns";

export function SimpleUserList({ users }: { users: UserListItem[] }) {
  const columns = getUserColumns();
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableHiding: false,
    enableSorting: false,
    enableRowSelection: false,
  });

  return <DataTable table={table} />;
}
