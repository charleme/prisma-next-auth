"use client";

import { DataTable } from "~/components/molecule/data-table/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type AppRouterOutput } from "~/server/api/root";
import { useUserCommentColumns } from "~/app/(logged)/user/[userId]/comment/use-user-comment-columns";

type UserCommentDataTableProps = {
  comments: AppRouterOutput["user"]["listComments"];
};

export const UserCommentDataTable = ({
  comments,
}: UserCommentDataTableProps) => {
  const columns = useUserCommentColumns();
  const table = useReactTable({
    data: comments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableHiding: false,
  });
  return <DataTable table={table} />;
};
