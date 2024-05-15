"use client";

import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "~/components/ui/form";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InputField } from "~/components/form/input-field";
import { useToast } from "~/components/ui/use-toast";
import { type LoginFormData, loginSchema } from "~/types/schema/login";
import { useRouter } from "next/navigation";
import { SubmitButton } from "~/components/form/submit-button";
import { useState } from "react";

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    setIsPending(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsPending(false);

    if (!response?.ok) {
      toast({
        variant: "destructive",
        title: "Invalid Credentials",
        description: "The email or password you entered is incorrect.",
      });
      return;
    }
    router.push("/");
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <InputField
                  control={form.control}
                  name="email"
                  label="Email"
                  inputProps={{
                    placeholder: "m@example.com",
                  }}
                />
              </div>
              <div className="grid gap-2">
                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  inputProps={{ type: "password" }}
                />
              </div>
              <SubmitButton
                isSubmitting={isPending}
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Login
              </SubmitButton>
            </div>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
