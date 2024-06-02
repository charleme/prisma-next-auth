"use client";

import { type UserListItem } from "~/types/query/user/list";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/data-table";
import { getUserColumns } from "~/app/(logged)/userColumns";
import { type DataTableFilterField } from "~/types/data-table";
import { Role } from "~/types/enum/Role";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { type api } from "~/trpc/server";
import React from "react";
import { useServerDataTable } from "~/hooks/use-server-data-table";

export function ServerSideDataTable({
  usersPromise,
}: {
  usersPromise: ReturnType<typeof api.user.search>;
}) {
  const columns = getUserColumns();

  const filterFields: DataTableFilterField<UserListItem>[] = [
    {
      variant: "global",
      value: "global",
      placeholder: "Search by name, email, or role...",
    },
    {
      variant: "input",
      value: "email",
      placeholder: "Filter by email...",
    },
    {
      variant: "multiSelect",
      label: "Role",
      value: "roles",
      options: [
        {
          label: "Admin",
          value: Role.Admin.toString(),
        },

        {
          label: "User",
          value: Role.User.toString(),
        },
      ],
    },
  ];

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
      <DataTableToolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
}
