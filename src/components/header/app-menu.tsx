"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export const AppMenu = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      link: "/user-client",
      label: "Users Client",
      hide: false,
    },
    {
      link: "/user-client-complex",
      label: "Users Client complex",
      hide: false,
    },
    {
      link: "/user-lazy-client",
      label: "Users Client lazy",
      hide: false,
    },
    {
      link: "/user-server",
      label: "Users Server",
      hide: false,
    },
  ];

  return (
    <>
      {menuItems.map(
        (item) =>
          !item.hide && (
            <div key={item.link}>
              <Link
                href={item.link}
                className={clsx(
                  "transition-colors hover:text-foreground",
                  { "text-foreground": pathname === item.link },
                  { "text-muted-foreground": pathname !== item.link },
                )}
              >
                {item.label}
              </Link>
            </div>
          ),
      )}
    </>
  );
};
