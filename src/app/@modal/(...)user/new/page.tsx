import { PageDialog } from "~/components/ui/dialog";
import { SimpleDialogContent } from "~/components/molecule/dialog/simple-dialog-content";
import { api } from "~/trpc/server";
import { checkAuthAndRole } from "~/server/auth";
import { Role } from "~/types/enum/Role";
import { CreateUserForm } from "~/components/user/create-user-form";

export default async function CreateUserPage() {
  const roles = await api.role.list();

  await checkAuthAndRole(Role.Admin);

  return (
    <PageDialog modal={true} defaultOpen={true}>
      <SimpleDialogContent
        title={"Create an account"}
        description={"Enter user information to create an account"}
      >
        <CreateUserForm roles={roles} />
      </SimpleDialogContent>
    </PageDialog>
  );
}
