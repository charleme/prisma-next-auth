import RoleList from "~/components/role/role-list";
import { api } from "~/trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import LoadingRoleList from "~/components/role/loading-role-list";
import { RequestSuspense } from "~/components/suspense/request-suspense";
import { getAuthUser } from "~/server/auth";
import { Right } from "~/types/enum/Right";
import { redirect } from "next/navigation";
import { hasAtLeastOneRight } from "~/lib/has-at-least-one-right";

export default async function UserListPage() {
  const authUser = await getAuthUser();
  if (
    authUser === undefined ||
    !hasAtLeastOneRight(authUser, [Right.VIEW_ROLE_LIST])
  ) {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {hasAtLeastOneRight(authUser, [Right.UPDATE_ROLE]) && (
          <Link href="/role/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add a role
            </Button>
          </Link>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RequestSuspense
            request={api.role.list}
            fallback={<LoadingRoleList />}
            render={(roles) => <RoleList roles={roles} authUser={authUser} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
