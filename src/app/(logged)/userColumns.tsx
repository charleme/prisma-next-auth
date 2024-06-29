import { type UserListItem } from "~/types/query/user/list";
import { RoleBadge } from "~/components/role/role-badge";
import { DataTableColumnHeader } from "~/components/molecule/data-table/data-column-header";
import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";
import { SELECTION_COLUMN } from "~/types/constants/table";
import { cn } from "~/lib/utils";

export const getUserColumns =
  (): ColumnDefWithViewSelectorMeta<UserListItem>[] => {
    return [
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
      {
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
      },
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
      // TODO add actions
    ];
  };
