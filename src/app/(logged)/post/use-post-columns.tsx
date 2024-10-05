"use client";

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
import Link from "next/link";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { readPostClientGuard } from "~/server/guard/post/read-post-guard";
import { useMe } from "~/hooks/use-me";
import { deletePostClientGuard } from "~/server/guard/post/delete-post-guard";

export const usePostColumns =
  (): ColumnDefWithViewSelectorMeta<PostSearchItem>[] => {
    const { mutate: deletePost } = api.post.delete.useMutation();

    const utils = api.useUtils();
    const { user } = useMe();

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
        cell: ({ row }) => {
          //TODO add view user guard
          const canReadPost = user && readPostClientGuard(user, row.original);
          const canDeletePost =
            user && deletePostClientGuard(user, row.original);
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
                {canReadPost && (
                  <DropdownMenuItem>
                    <Link href={`/post/${row.original.id}`}>View post</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>View author</DropdownMenuItem>
                {canDeletePost && <DropdownMenuSeparator />}
                {canDeletePost && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => {
                      deletePost(
                        { postId: row.original.id },
                        {
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onSuccess: async () => {
                            toast({
                              title: "Post deleted",
                              description: `${row.original.author?.fullName}'s post has been deleted with success`,
                            });
                            await utils.post.search.invalidate();
                          },
                        },
                      );
                    }}
                  >
                    Delete post
                  </DropdownMenuItem>
                )}
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
  };
