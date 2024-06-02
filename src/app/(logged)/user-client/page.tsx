import { api } from "~/trpc/server";
import { SimpleUserList } from "~/app/(logged)/user-client/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function UserListPage() {
  const users = await api.user.list();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleUserList users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
