import { GeneralRoleForm } from "~/components/role/general-role-form";
import { Right } from "~/types/enum/Right";
import { getAuthUser } from "~/server/auth";

export default async function CreateRolePage() {
  const authUser = await getAuthUser();
  const isReadOnly = !authUser?.rights.includes(Right.UPDATE_ROLE);

  return <GeneralRoleForm readOnly={isReadOnly} />;
}
