"use client";

import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export const SignOutMenuItem = () => (
  <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
);
