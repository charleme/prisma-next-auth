import { checkIsNotAuth } from "~/server/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkIsNotAuth();

  return <>{children}</>;
}
