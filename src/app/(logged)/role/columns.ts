import { type ColumnDef } from "@tanstack/react-table";
import { type RoleLIstQueryOutputItem } from "~/types/query/role";

export const roleColumns: ColumnDef<RoleLIstQueryOutputItem>[] = [
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
