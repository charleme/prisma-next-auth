import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { type PostSearchItem } from "~/types/query/post/search";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { cn } from "~/lib/utils";

export const postColumns: ColumnDefWithViewSelectorMeta<PostSearchItem>[] = [
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
    accessorKey: "published",
    meta: { viewSelector: "Published" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className={cn("h-4 w-4 rounded-full", {
            "bg-primary": row.original.published,
            "border border-primary": !row.original.published,
          })}
        />
      );
    },
  },
  {
    accessorKey: "_count.comments",
    meta: { viewSelector: "Comment number" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment number" />
    ),
  },
];
