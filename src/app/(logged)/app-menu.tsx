"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export const AppMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      link: "/user",
      label: "Users",
    },
    {
      link: "/role",
      label: "Roles",
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
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
      ))}
    </>
  );
};
