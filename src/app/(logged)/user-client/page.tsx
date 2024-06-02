import { api } from "~/trpc/server";
import { SimpleUserList } from "~/app/(logged)/user-client/data-table";

export default async function UserListPage() {
  const users = await api.user.list();
  return (
    <div>
      <SimpleUserList users={users} />
    </div>
  );
}
