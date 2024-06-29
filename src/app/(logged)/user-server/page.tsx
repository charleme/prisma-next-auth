import { api } from "~/trpc/server";
import { ServerSideDataTable } from "~/app/(logged)/user-server/data-table";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getPerPageStringifyOptions } from "~/types/schema/list/pagination";
import { DEFAULT_TABLE_PAGE_SIZES } from "~/types/constants/table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getAuthUser } from "~/server/auth";
import { redirect } from "next/navigation";
import { createUserGuard } from "~/server/guard/user/create-user";

const urlParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: getPerPageStringifyOptions(DEFAULT_TABLE_PAGE_SIZES)
    .optional()
    .default("10"),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  global: z.string().optional(),
  email: z.string().optional(),
  roles: z
    .string()
    .optional()
    .transform((value) => value?.split(".").map(Number)),
  active: z
    .string()
    .optional()
    .transform((value) => value?.split(".").map((value) => value === "1")),
});

export default async function UserListPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const parsedSearchParams = urlParamsSchema.parse(searchParams);

  const { user: authUser } = await getAuthUser();
  if (!authUser) {
    return redirect(`/login`);
  }

  const users = api.user.search(parsedSearchParams);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerSideDataTable usersPromise={users}>
            {createUserGuard(authUser) && (
              <Link href="/user/new" scroll={false}>
                <Button size="sm" className="ml-auto h-8">
                  Create User
                </Button>
              </Link>
            )}
          </ServerSideDataTable>
        </CardContent>
      </Card>
    </div>
  );
}
