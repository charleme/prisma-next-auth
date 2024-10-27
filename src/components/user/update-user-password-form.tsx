"use client";

import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { SubmitButton } from "~/components/form/submit-button";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UpdateUserPasswordForm as UpdateUserPasswordFormType,
  updateUserPasswordFormSchema,
} from "~/types/schema/user/update-user-password-schema";
import { InputField } from "~/components/form/input-field";

export type UpdateUserPasswordFormProps = {
  userId: string;
};

export function UpdateUserPasswordForm({
  userId,
}: UpdateUserPasswordFormProps) {
  const { mutate: updateUserPassword, isPending } =
    api.user.updatePassword.useMutation();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(updateUserPasswordFormSchema),
  });

  const onSubmit = (data: UpdateUserPasswordFormType) => {
    updateUserPassword(
      { userId: userId, password: data.password },
      {
        onSuccess: () => {
          toast({
            title: "Password updated",
            description: `The password was updated with success`,
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <InputField
              name="password"
              label="Password"
              control={form.control}
            />
          </div>
          <div className="grid gap-2">
            <InputField
              name="confirmPassword"
              label="Confirm password"
              control={form.control}
            />
          </div>
          <SubmitButton isSubmitting={isPending} className="w-full">
            Save
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
