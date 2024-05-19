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
  {
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
            <Link href={`/role/${role.id}`}>
              <DropdownMenuItem>
                <LibraryBig className="mr-2 h-4 w-4" />
                General information
              </DropdownMenuItem>
            </Link>
            <Link href={`/role/${role.id}/rights`}>
              <DropdownMenuItem>
                <Scale className="mr-2 h-4 w-4" />
                See Rights
              </DropdownMenuItem>
            </Link>
            <Link href={`/role/${role.id}/users`}>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                See Users
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
