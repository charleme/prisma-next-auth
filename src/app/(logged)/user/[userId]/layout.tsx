import { type PropsWithChildren } from "react";
import { LeftNavPanel } from "~/components/molecule/layout/left-nav-panel";
import { updateUserPasswordClientGuard } from "~/server/guard/user/update-user-password-guard";
import { getAuthUser } from "~/server/auth";

type UserLayoutProps = PropsWithChildren<{
  params: { userId: string };
}>;

export default async function UserLayout({
  children,
  params,
}: UserLayoutProps) {
  const { user } = await getAuthUser();

  const userId = params.userId;
  const canUpdatePassword = updateUserPasswordClientGuard({
    authUser: user,
    userId: userId,
  });

  const items = [
    { label: "Profile", link: `/user/${userId}` },
    { label: "Posts", link: `/user/${userId}/post` },
    { label: "Comments", link: `/user/${userId}/comment` },
  ];

  if (canUpdatePassword) {
    items.push({
      label: "Update password",
      link: `/user/${userId}/password`,
    });
  }

  return (
    <LeftNavPanel title="User profile" items={items}>
      {children}
    </LeftNavPanel>
  );
}
