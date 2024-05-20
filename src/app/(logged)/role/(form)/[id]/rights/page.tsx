import { api } from "~/trpc/server";
import { z } from "zod";
import { getAuthUser } from "~/server/auth";
import { Right } from "~/types/enum/Right";
import { RightsRoleForm } from "~/components/role/rights-role-form";

export default async function UpdateRightsRoleFormPage({
  params,
}: {
  params: { id: string };
}) {
  const id = z.coerce.number().parse(params.id);
  const [defaultSelectedRights, rightOptions, authUser] = await Promise.all([
    api.role.getRights({ id }),
    api.right.list(),
    getAuthUser(),
  ]);

  // convert to record to be easily searchable
  const rightRecord: Record<number, (typeof rightOptions)[number]> =
    Object.fromEntries(
      rightOptions.map((right) => {
        return [right.id, right];
      }),
    );

  const isReadOnly = !authUser?.rights.includes(Right.UPDATE_ROLE);

  const parsedDefaultSelectedRights = z
    .array(z.nativeEnum(Right))
    .parse(defaultSelectedRights);

  return (
    <div className="space-y-2">
      {isReadOnly && (
        <div className="text-sm text-destructive">
          You're not allowed to update role's rights
        </div>
      )}
      <RightsRoleForm
        defaultValue={parsedDefaultSelectedRights}
        readOnly={isReadOnly}
        roleId={id}
        rights={rightRecord}
      />
    </div>
  );
}
