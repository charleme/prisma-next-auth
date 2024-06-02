import { type UserListItem } from "~/types/query/user/list";
import { RoleBadge } from "~/components/role/role-badge";
import { DataTableColumnHeader } from "~/components/data-table/data-column-header";
import { Checkbox } from "~/components/ui/checkbox";
import { type ColumnDefWithViewSelectorMeta } from "~/types/data-table";

export const getUserColumns =
  (): ColumnDefWithViewSelectorMeta<UserListItem>[] => {
    return [
      {
        id: "selection",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "firstName",
        meta: { viewSelector: "First Name" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
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
          //TODO better design for roles
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
