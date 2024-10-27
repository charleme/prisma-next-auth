"use client";

import { DataTable } from "~/components/molecule/data-table/data-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type AppRouterOutput } from "~/server/api/root";
import { useUserPostColumns } from "~/app/(logged)/user/[userId]/post/use-user-post-columns";

type UserPostDataTableProps = {
  posts: AppRouterOutput["user"]["listPosts"];
};

export const UserPostDataTable = ({ posts }: UserPostDataTableProps) => {
  const columns = useUserPostColumns();
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableHiding: false,
    enableSorting: false,
  });
  return <DataTable table={table} />;
};
