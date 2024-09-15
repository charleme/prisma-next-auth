import { CreateUserForm } from "~/components/user/user-form";
import { SimpleCard } from "~/components/molecule/card/simple-card";
import { api } from "~/trpc/server";

export default async function CreateUserPage() {
  const roles = await api.role.list();
  return (
    <SimpleCard
      title={"Create an account"}
      description={"Enter user information to create an account"}
      className={"mx-auto max-w-lg"}
    >
      <CreateUserForm roles={roles} />
    </SimpleCard>
  );
}
