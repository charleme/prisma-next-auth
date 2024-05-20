"use client";

import { DataTable } from "~/components/data-table/data-table";
import { type RoleListQueryOutput } from "~/types/query/role";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type User } from "next-auth";
import { getRoleColumns } from "~/app/(logged)/role/columns";

export default function RoleList({
  roles,
  authUser,
}: {
  roles: RoleListQueryOutput;
  authUser: User;
}) {
  const table = useReactTable({
    data: roles,
    columns: getRoleColumns(authUser),
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}
