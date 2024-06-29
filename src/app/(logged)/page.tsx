import { getAuthUser } from "~/server/auth";

export default async function LoginPage() {
  const { user } = await getAuthUser();

  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-[600px]">Hello {user.email}</div>
    </section>
  );
}
