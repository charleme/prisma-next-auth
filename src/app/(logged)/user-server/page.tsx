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

const urlParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  global: z.string().optional(),
  email: z.string().optional(),
  roles: z
    .string()
    .optional()
    .transform((value) => value?.split(".").map(Number)),
});

export default function UserListPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const parsedSearchParams = urlParamsSchema.parse(searchParams);

  const users = api.user.search(parsedSearchParams);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerSideDataTable usersPromise={users} />
        </CardContent>
      </Card>
    </div>
  );
}
