import { LoginForm } from "./form";

export default async function LoginPage() {
  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-[600px]">
        <LoginForm />
      </div>
    </section>
  );
}
