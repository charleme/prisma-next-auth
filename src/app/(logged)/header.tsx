"use client";
import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { AppMenu } from "~/components/header/app-menu";
import { clsx } from "clsx";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SignOutMenuItem } from "~/components/header/sign-out-menu-item";
import { type User } from "next-auth";
import { useState } from "react";

export function Header({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pb-4">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
          </div>
          <AppMenu
            renderMenuItem={(item, isCurrentPath) => (
              <Link
                href={item.link}
                className={clsx(
                  "transition-colors hover:text-foreground",
                  { "text-foreground": isCurrentPath },
                  { "text-muted-foreground": !isCurrentPath },
                )}
              >
                {item.label}
              </Link>
            )}
          />
        </nav>
        <Sheet open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <AppMenu
                renderMenuItem={(item, isCurrentPath) => (
                  <Link
                    href={item.link}
                    className={clsx(
                      "hover:text-foreground",
                      { "text-foreground": isCurrentPath },
                      { "text-muted-foreground": !isCurrentPath },
                    )}
                    onClick={() => setOpenMenu(false)}
                  >
                    {item.label}
                  </Link>
                )}
              />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center justify-end gap-4 md:gap-2 lg:gap-4">
          {`${user.firstName} ${user.lastName}`}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <SignOutMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div>
        <div className="container mx-auto px-4 pt-4">{children}</div>
      </div>
    </div>
  );
}
