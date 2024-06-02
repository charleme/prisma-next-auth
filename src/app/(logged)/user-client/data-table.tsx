"use client";

import { type UserListItem } from "~/types/query/user/list";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/data-table";
import { getUserColumns } from "~/app/(logged)/userColumns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
