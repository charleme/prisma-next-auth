"use client";

import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { Button } from "~/components/ui/button";
import { type AppRouterOutput } from "~/server/api/root";
import Link from "next/link";
import { Eye } from "lucide-react";

export const useUserPostColumns = (): ColumnDefWithViewSelectorMeta<
  AppRouterOutput["user"]["listPosts"][number]
>[] => {
  return [
    {
      accessorKey: "title",
      meta: { viewSelector: "First Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableHiding: false,
    },
    {
      accessorKey: "author.fullName",
      meta: { viewSelector: "Author" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
    },
    {
      accessorKey: "_count.comments",
      meta: { viewSelector: "Comment number" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment number" />
      ),
    },
    {
      id: "view-post-actions",
      cell: ({ row }) => {
        return (
          <div>
            <Link href={`/post/${row.original.id}`}>
              <Button variant="ghost">
                <Eye className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
};
