"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { InputField } from "~/components/form/input-field";
import { type RegisterFormData, registerSchema } from "~/types/schema/register";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const { mutate: register } = api.auth.register.useMutation({});
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, { onSuccess: () => router.push("/login") });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <InputField
                    name="firstName"
                    label="First name"
                    control={form.control}
                    inputProps={{ placeholder: "Max" }}
                  />
                </div>
                <div className="grid gap-2">
                  <InputField
                    name="lastName"
                    label="Last name"
                    control={form.control}
                    inputProps={{ placeholder: "Robinson" }}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <InputField
                  name="email"
                  label="Email"
                  control={form.control}
                  inputProps={{ placeholder: "m@example.com" }}
                />
              </div>
              <div className="grid gap-2">
                <InputField
                  name="password"
                  label="Password"
                  control={form.control}
                  inputProps={{ type: "password" }}
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
