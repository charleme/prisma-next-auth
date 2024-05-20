import { GeneralRoleForm } from "~/components/role/general-role-form";
import { api } from "~/trpc/server";
import { z } from "zod";
import { getAuthUser } from "~/server/auth";
import { Right } from "~/types/enum/Right";

export default async function UpdateRoleFormPage({
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

  return <GeneralRoleForm defaultValue={defaultValue} readOnly={isReadOnly} />;
}
