"use client";

import { DataTable } from "~/components/data-table/data-table";
import { type RoleListQueryOutput } from "~/types/query/role";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { roleColumns } from "~/app/(logged)/role/columns";

export default function RoleList({ roles }: { roles: RoleListQueryOutput }) {
  const table = useReactTable({
    data: roles,
    columns: roleColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}
