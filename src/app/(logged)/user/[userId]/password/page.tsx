import { getAuthUser } from "~/server/auth";
import { updateUserPasswordClientGuard } from "~/server/guard/user/update-user-password-guard";
import { notFound } from "next/navigation";
import { SimpleCard } from "~/components/molecule/card/simple-card";
import { UpdateUserPasswordForm } from "~/components/user/update-user-password-form";

export default async function UserUpdatePasswordPage({
  params,
}: {
  params: { userId: string };
}) {
  const { user } = await getAuthUser();
  const canUpdatePassword = updateUserPasswordClientGuard({
    authUser: user,
    userId: params.userId,
  });

  if (!canUpdatePassword) {
    notFound();
  }

  return (
    <SimpleCard title="Password Update Form">
      <UpdateUserPasswordForm userId={params.userId} />
    </SimpleCard>
  );
}
