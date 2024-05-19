import { GeneralForm } from "~/app/(logged)/role/(form)/generalForm";
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
  const defaultValue = await api.role.get({ id });

  if (!defaultValue) throw new Error("Role not found");

  const authUser = await getAuthUser();

  const isReadOnly = !authUser?.rights.includes(Right.UPDATE_ROLE);

  return <GeneralForm defaultValue={defaultValue} readOnly={isReadOnly} />;
}
