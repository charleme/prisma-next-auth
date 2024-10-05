import { ServerSideDataTable } from "~/app/(logged)/user/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getAuthUser } from "~/server/auth";
import { redirect } from "next/navigation";
import { createUserGuard } from "~/server/guard/user/create-user-guard";
import { Plus } from "lucide-react";

export default async function UserListPage() {
  const { user: authUser } = await getAuthUser();
  if (!authUser) {
    return redirect(`/login`);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <ServerSideDataTable>
            {createUserGuard(authUser) && (
              <Link href="/user/new" scroll={false}>
                <Button size="sm" className="ml-auto h-8">
                  <Plus className="mr-2 h-4 w-4 " />
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
