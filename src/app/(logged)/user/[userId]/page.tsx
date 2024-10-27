import { api } from "~/trpc/server";
import { getAuthUser } from "~/server/auth";
import { readUserClientGuard } from "~/server/guard/user/read-user-guard";
import { updateUserClientGuard } from "~/server/guard/user/update-user-guard";
import { deleteUserGuard } from "~/server/guard/user/delete-user-guard";
import { viewActiveFieldUserGuard } from "~/server/guard/user/view-active-field-user-guard";
import { UpdateUserForm } from "~/components/user/update-user-form";
import { notFound } from "next/navigation";
import { updateUserRoleGuard } from "~/server/guard/user/update-user-role-guard";
import { RemoveUserButton } from "~/components/user/remove-user-button";
import { ViewUser } from "~/components/user/view-user";
import { SimpleCard } from "~/components/molecule/card/simple-card";

export default async function ViewUserPage({
  params,
}: {
  params: { userId: string };
}) {
  const [viewedUser, roles] = await Promise.all([
    api.user.read({ userId: params.userId }),
    api.role.list(),
  ]);

  const { user: authUser } = await getAuthUser();
  const canViewUser = readUserClientGuard(authUser, viewedUser);
  if (!canViewUser) {
    notFound();
  }

  const canEditUser = updateUserClientGuard(authUser, viewedUser);
  const canViewActiveField = viewActiveFieldUserGuard({ authUser });
  const canUpdateRole = updateUserRoleGuard({ authUser });
  const canDeleteUser = deleteUserGuard({ authUser });

  if (!canViewUser) {
    throw new Error("Current user can't view this user");
  }
  if (canEditUser) {
    return (
      <div>
        <SimpleCard title="Mettre à jour le profil">
          <UpdateUserForm
            userId={viewedUser.id}
            user={viewedUser}
            roles={roles}
            canViewActive={canViewActiveField}
            canUpdateRole={canUpdateRole}
          />
        </SimpleCard>
        {canDeleteUser && (
          <div className="mt-2 flex justify-end">
            <RemoveUserButton userId={viewedUser.id} />
          </div>
        )}
      </div>
    );
  }

  return (
    <SimpleCard title="Voir le profil">
      <ViewUser user={viewedUser} />
    </SimpleCard>
  );
}
