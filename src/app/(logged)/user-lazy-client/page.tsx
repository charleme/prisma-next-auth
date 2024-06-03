import { ComplexUserLazyList } from "~/app/(logged)/user-lazy-client/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function UserListPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View the app users and manage them</CardDescription>
        </CardHeader>
        <CardContent>
          <ComplexUserLazyList />
        </CardContent>
      </Card>
    </div>
  );
}
