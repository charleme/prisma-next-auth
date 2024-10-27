"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { InputField } from "~/components/form/input-field";
import {
  type CreateUser,
  createUserSchema,
} from "~/types/schema/user/create-user-schema";
import { useRouter } from "next/navigation";
import { SubmitButton } from "~/components/form/submit-button";
import { handleFieldErrors } from "~/lib/handle-field-errors";
import { RoleBadge } from "~/components/role/role-badge";
import { MultiSelectField } from "~/components/form/multi-select-field";
import { type RoleItem } from "~/types/query/role/list";
import { useToast } from "~/components/ui/use-toast";
import { CheckboxField } from "~/components/form/checkbox-field";

export type CreateUserFormProps = {
  roles: RoleItem[];
};

export function CreateUserForm({ roles }: CreateUserFormProps) {
  const { mutate: register, isPending } = api.user.create.useMutation();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      roles: [],
      active: true,
    },
  });

  const onSubmit = (data: CreateUser) => {
    register(data, {
      onSuccess: () => {
        toast({
          title: "User created",
          description: `The user ${data.email} was created with success`,
        });
        router.push("/user-server");
      },
      onError: (error) => {
        handleFieldErrors(form, error);
      },
    });
  };

  return (
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
          <div className="grid gap-2">
            <MultiSelectField
              name="roles"
              label="Roles"
              control={form.control}
              multiSelectProps={{
                className: "w-full",
                options: roles,
                labelFnAccessor: (role) => role.name,
                valueFnAccessor: (role) => role.id,
                renderOption: (role) => <RoleBadge role={role} />,
              }}
            />
          </div>
          <div>
            <CheckboxField
              control={form.control}
              name="active"
              label="Active"
            />
          </div>
          <SubmitButton isSubmitting={isPending} className="w-full">
            Create an account
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
