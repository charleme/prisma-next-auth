import { redirect } from "next/navigation";
import { getAuthUser } from "~/server/auth";

export default async function LoginPage() {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-[600px]">Hello {user.email}</div>
    </section>
  );
}
