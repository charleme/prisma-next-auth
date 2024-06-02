import { api } from "~/trpc/server";
import { ComplexUserList } from "~/app/(logged)/user-client-complex/data-table";

export default async function UserListPage() {
  const users = await api.user.list();
  return (
    <div>
      <ComplexUserList users={users} />
    </div>
  );
}
