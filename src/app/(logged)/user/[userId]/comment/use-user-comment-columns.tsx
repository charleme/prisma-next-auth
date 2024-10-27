"use client";

import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { Button } from "~/components/ui/button";
import { Eye } from "lucide-react";
import { type AppRouterOutput } from "~/server/api/root";
import Link from "next/link";

export const useUserCommentColumns = (): ColumnDefWithViewSelectorMeta<
  AppRouterOutput["user"]["listComments"][number]
>[] => {
  return [
    {
      accessorKey: "post.title",
      meta: { viewSelector: "First Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableHiding: false,
    },
    {
      accessorKey: "post.author.fullName",
      meta: { viewSelector: "Author" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),
    },
    {
      accessorKey: "createdAt",
      meta: { viewSelector: "Author" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created at" />
      ),
      cell: ({ row }) =>
        `${row.original.createdAt.toLocaleDateString()} ${row.original.createdAt.toLocaleTimeString()}`,
    },
    {
      id: "view-post-actions",
      cell: ({ row }) => {
        return (
          <div>
            <Link
              href={`/post/${row.original.post.id}#comment-${row.original.id}`}
            >
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
