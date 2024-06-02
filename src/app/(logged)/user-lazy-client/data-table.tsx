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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type DataTableFilterField } from "~/types/data-table";
import { Role } from "~/types/enum/Role";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { useLazyDataTable } from "~/hooks/use-lazy-data-table";
import { api } from "~/trpc/react";

export function ComplexUserLazyList() {
  const columns = getUserColumns();

  const { ...lazyTableOptions } = useLazyDataTable<UserListItem>({
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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable table={table}>
            <DataTableToolbar table={table} filterFields={filterFields} />
          </DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
