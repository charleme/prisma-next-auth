"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RoleLIstQueryOutputItem } from "~/types/query/role";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { LibraryBig, MoreHorizontal, Scale, Trash, User } from "lucide-react";
import Link from "next/link";
import { type User as AuthUser } from "next-auth";
import { hasAtLeastOneRight } from "~/lib/has-at-least-one-right";
import { Right } from "~/types/enum/Right";

export function getRoleColumns(
  user: AuthUser,
): ColumnDef<RoleLIstQueryOutputItem>[] {
  const actions: (
    | ({
        icon: React.ReactNode;
        label: string;
      } & (
        | { url: (role: RoleLIstQueryOutputItem) => string }
        | { action: (role: RoleLIstQueryOutputItem) => void }
      ))
    | { separatorKey: string }
  )[] = [];

  const canViewRole = hasAtLeastOneRight(user, [Right.VIEW_ROLE]);
  const canDeleteRole = hasAtLeastOneRight(user, [Right.DELETE_ROLE]);

  if (canViewRole) {
    actions.push(
      {
        icon: <LibraryBig className="mr-2 h-4 w-4" />,
        label: "General Information",
        url: (role) => `/role/${role.id}`,
      },
      {
        icon: <Scale className="mr-2 h-4 w-4" />,
        label: "See rights",
        url: (role) => `role/${role.id}/rights`,
      },
      {
        icon: <User className="mr-2 h-4 w-4" />,
        label: "See users",
        url: (role) => `role/${role.id}/users`,
      },
    );
  }
  if (canViewRole && canDeleteRole) {
    actions.push({ separatorKey: "unique-separator" });
  }
  if (canDeleteRole) {
    actions.push({
      icon: <Trash className="mr-2 h-4 w-4" />,
      label: "Delete",
      action: (role) => {
        console.warn("Delete role", role.id);
      },
    });
  }

  const columns: ColumnDef<RoleLIstQueryOutputItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    { accessorKey: "description", header: "Description" },
    {
      accessorFn: (value) => value._count.rights,
      header: "Right count",
    },
    {
      accessorFn: (value) => value._count.users,
      header: "User count",
    },
  ];
  if (actions.length > 0) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actions.map((action) => {
                if ("url" in action) {
                  return (
                    <Link key={action.label} href={action.url(role)}>
                      <DropdownMenuItem>
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    </Link>
                  );
                }

                if ("separatorKey" in action) {
                  return <DropdownMenuSeparator key="only" />;
                }

                return (
                  <DropdownMenuItem
                    key={action.label}
                    onClick={() => action.action(role)}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
}
