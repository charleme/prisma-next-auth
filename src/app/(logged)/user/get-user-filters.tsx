import { Role } from "~/types/enum/Role";
import { type DataTableServerFilterField } from "~/types/data-table";

export const getUserFilters = (canViewActiveField = false) => {
  return [
    {
      variant: "global",
      value: "global",
      placeholder: "Search by name, email, or role...",
    },
    {
      variant: "input",
      value: "email",
      placeholder: "Filter by email...",
    },
    {
      variant: "multiSelectNumber",
      label: "Role",
      value: "roles",
      options: [
        { label: "Admin", value: Role.Admin },
        { label: "User", value: Role.User },
      ],
    },
    {
      variant: "multiSelectNumber",
      label: "Active",
      value: "active",
      hide: !canViewActiveField,
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: 0 },
      ],
    },
    // Can't use DataTableFilterField<UserSearchItem>[] due to circular dependency
  ] as const satisfies DataTableServerFilterField[];
};
