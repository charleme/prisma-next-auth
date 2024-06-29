import { type DataTableFilterField } from "~/types/data-table";
import { Role } from "~/types/enum/Role";
import type { UserSearchItem } from "~/types/query/user/search";

export const getUserFilters = (): DataTableFilterField<UserSearchItem>[] => {
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
      variant: "multiSelect",
      label: "Role",
      value: "roles",
      options: [
        { label: "Admin", value: Role.Admin.toString() },
        { label: "User", value: Role.User.toString() },
      ],
    },
    {
      variant: "multiSelect",
      label: "Active",
      value: "active",
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
  ];
};
