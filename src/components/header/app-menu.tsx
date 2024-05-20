"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useMe } from "~/hooks/use-me";
import { hasAtLeastOneRight } from "~/lib/has-at-least-one-right";
import { Right } from "~/types/enum/Right";

export const AppMenu = () => {
  const pathname = usePathname();
  const authUser = useMe();

  const menuItems = [
    {
      link: "/user",
      label: "Users",
      hide: false,
    },
    {
      link: "/role",
      label: "Roles",
      hide: authUser && !hasAtLeastOneRight(authUser, [Right.VIEW_ROLE_LIST]),
    },
  ];

  return (
    <>
      {menuItems.map(
        (item) =>
          !item.hide && (
            <Link
              key={item.link}
              href={item.link}
              className={clsx(
                "transition-colors hover:text-foreground",
                { "text-foreground": pathname === item.link },
                { "text-muted-foreground": pathname !== item.link },
              )}
            >
              {item.label}
            </Link>
          ),
      )}
    </>
  );
};
