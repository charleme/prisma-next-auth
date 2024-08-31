"use client";

import { usePathname } from "next/navigation";

export type MenuItem = {
  link: string;
  label: string;
  hide: boolean;
};

type Props = {
  renderMenuItem: (
    item: MenuItem,
    isCurrentPath: boolean,
    index: number,
  ) => React.ReactNode;
};

export const AppMenu = ({ renderMenuItem }: Props) => {
  const pathname = usePathname();

  const isCurrentPath = (path: string) => {
    return pathname === path;
  };

  const menuItems: MenuItem[] = [
    {
      link: "/post",
      label: "Posts",
      hide: false,
    },
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
      {menuItems.map((item, index) => (
        <div key={item.link}>
          {!item.hide && renderMenuItem(item, isCurrentPath(item.link), index)}
        </div>
      ))}
    </>
  );
};
