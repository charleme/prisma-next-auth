import { getAuthUser } from "~/server/auth";
import { redirect } from "next/navigation";
import { Header } from "~/app/(logged)/header";
import { TokenRefreshContainer } from "~/app/(logged)/token-refresh";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <TokenRefreshContainer>
      <Header user={user}>{children}</Header>
    </TokenRefreshContainer>
  );
}
