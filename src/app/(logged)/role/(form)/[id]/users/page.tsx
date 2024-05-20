import { GeneralRoleForm } from "~/components/role/general-role-form";
import { api } from "~/trpc/server";
import { z } from "zod";
import { getAuthUser } from "~/server/auth";
import { Right } from "~/types/enum/Right";
import { UsersRoleForm } from "~/components/role/users-role-form";

export default async function UpdateUserRoleFormPage({
  params,
}: {
  params: { id: string };
}) {
  const id = z.coerce.number().parse(params.id);
  const [defaultValue, authUser] = await Promise.all([
    api.role.get({ id }),
    getAuthUser(),
  ]);

  const isReadOnly = !authUser?.rights.includes(Right.UPDATE_ROLE);

  return <UsersRoleForm defaultValue={defaultValue} readOnly={isReadOnly} />;
}
