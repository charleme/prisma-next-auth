"use client";

import { type PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import Link from "next/link";

type LeftNavPanelProps = PropsWithChildren<{
  title: string;
  items: {
    label: string;
    link: string;
  }[];
}>;

export const LeftNavPanel = ({ children, items, title }: LeftNavPanelProps) => {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{title}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          {items.map((item) => {
            const isCurrentPage = item.link === pathname;

            return (
              <div key={item.link}>
                <Link
                  href={item.link}
                  className={clsx({
                    "font-semibold text-accent-foreground": isCurrentPage,
                  })}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
