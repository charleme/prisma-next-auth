"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ClientLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const params = useParams();
  const { id } = z.object({ id: z.coerce.number().nullish() }).parse(params);

  const isCreation = id === null || id === undefined;

  const generalPathName = `/role/${id}`;
  const rightsPathName = `/role/${id}/rights`;
  const usersPathName = `/role/${id}/users`;

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="flex items-end text-3xl font-semibold">
          <div>
            <Link href="/role">
              <Button variant="outline" size="sm" className="mr-3 rounded-full">
                <ChevronLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div>Role</div>
        </h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm font-medium">
          <Link
            href={isCreation ? "#" : generalPathName}
            className={clsx({
              "font-semibold text-foreground":
                isCreation || pathname === generalPathName,
              "text-muted-foreground":
                !isCreation && pathname !== generalPathName,
            })}
          >
            General
          </Link>
          <Link
            href={isCreation ? "#" : rightsPathName}
            className={clsx({
              "font-semibold text-foreground": pathname === rightsPathName,
              "text-muted-foreground":
                isCreation || pathname !== rightsPathName,
            })}
          >
            Rights
          </Link>
          <Link
            href={isCreation ? "#" : usersPathName}
            className={clsx({
              "font-semibold text-foreground": pathname === usersPathName,
              "text-muted-foreground": isCreation || pathname !== usersPathName,
            })}
          >
            Users
          </Link>
        </nav>
        {children}
      </div>
    </main>
  );
}
