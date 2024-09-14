import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { type PostSearchItem } from "~/types/query/post/search";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";

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
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View post</DropdownMenuItem>
            <DropdownMenuItem>View author</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "ownPost", // column only use for filtering
    enableHiding: false, // This column cannot be displayed
  },
];
