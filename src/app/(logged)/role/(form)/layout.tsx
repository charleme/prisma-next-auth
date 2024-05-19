import { getAuthUser } from "~/server/auth";
import ClientLayout from "~/app/(logged)/role/(form)/client-layout";
import { Right } from "~/types/enum/Right";
import { redirect } from "next/navigation";

export default async function RoleFormLayout({
  children,
}: React.PropsWithChildren) {
  const authUser = await getAuthUser();

  if (authUser === null || !authUser?.rights.includes(Right.VIEW_ROLE)) {
    redirect("/role");
  }

  return <ClientLayout>{children}</ClientLayout>;
}
