import RoleList from "~/app/(logged)/role/role-list";
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
import LoadingRoleList from "~/app/(logged)/role/loading-role-list";
import { RequestSuspense } from "~/components/suspense/request-suspense";
import { getAuthUser } from "~/server/auth";
import { Right } from "~/types/enum/Right";
import { redirect } from "next/navigation";

export default async function UserListPage() {
  const authUser = await getAuthUser();
  if (authUser === null || !authUser?.rights.includes(Right.VIEW_ROLE_LIST)) {
    redirect("/");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/role/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add a role
          </Button>
        </Link>
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
            render={(roles) => <RoleList roles={roles} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
