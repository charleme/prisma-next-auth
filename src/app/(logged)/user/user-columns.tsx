import { type UserListItem } from "~/types/query/user/list";
import { RoleBadge } from "~/components/role/role-badge";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { SELECTION_COLUMN } from "~/types/constants/table";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useMe } from "~/hooks/use-me";
import { readUserClientGuard } from "~/server/guard/user/read-user-guard";
import { deleteUserGuard } from "~/server/guard/user/delete-user-guard";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { toast } from "~/components/ui/use-toast";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { api } from "~/trpc/react";
import { useState } from "react";

export const useUserColumns = (
  canViewActive: boolean,
): ColumnDefWithViewSelectorMeta<UserListItem>[] => {
  const { user } = useMe();
  const utils = api.useUtils();
  const { mutate: deleteUser } = api.user.delete.useMutation();

  const [openDeleteDialogUserId, setOpenDeleteDialogUserId] = useState<
    string | null
  >(null);

  const columns: ColumnDefWithViewSelectorMeta<UserListItem>[] = [
    SELECTION_COLUMN,
    {
      accessorKey: "firstName",
      meta: { viewSelector: "First Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
      enableHiding: false,
    },
    {
      meta: { viewSelector: "Last Name" },
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Name" />
      ),
    },
    {
      meta: { viewSelector: "Email" },
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
  ];
  if (canViewActive) {
    columns.push({
      id: "active",
      accessorKey: "active",
      meta: { viewSelector: "Active" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Active" />
      ),
      cell: ({ row }) => {
        return (
          <div
            className={cn("h-4 w-4 rounded-full", {
              "bg-primary": row.original.active,
              "border border-primary": !row.original.active,
            })}
          />
        );
      },
    });
  }
  columns.push(
    {
      id: "roles",
      filterFn: (row, _, filterValue) =>
        row.original.roles.some((role) =>
          Array.isArray(filterValue)
            ? filterValue.includes(role.id.toString())
            : filterValue === role.id.toString(),
        ),
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Roles" />
      ),
      cell: ({ row }) => {
        const roles = row.original.roles;
        return (
          <div className="space-x-2">
            {roles.map((role) => (
              <RoleBadge key={role.id} role={role} />
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        //TODO add view user guard
        const canViewUser = user && readUserClientGuard(user, row.original);
        const canDeleteUser = user && deleteUserGuard({ authUser: user });

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-30">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {canViewUser && (
                  <Link href={`/user/${row.original.id}`}>
                    <DropdownMenuItem>View User</DropdownMenuItem>
                  </Link>
                )}
                {canDeleteUser && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setOpenDeleteDialogUserId(row.original.id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
              open={openDeleteDialogUserId === row.original.id}
              onOpenChange={(open) => {
                setOpenDeleteDialogUserId(open ? row.original.id : null);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this post
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the user. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteUser(
                        { userId: row.original.id },
                        {
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onSuccess: async () => {
                            toast({
                              title: "User deleted",
                              description: `${row.original.fullName} has been deleted with success`,
                            });
                            await utils.user.search.invalidate();
                          },
                        },
                      );
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  );

  // TODO add actions
  return columns;
};
