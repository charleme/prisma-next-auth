import { RegisterForm } from "./form";

export default async function RegisterPage() {
  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-[600px]">
        <RegisterForm />
      </div>
    </section>
  );
}
