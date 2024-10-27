"use client";

import { useForm } from "react-hook-form";
import { api, type RouterOutputs } from "~/trpc/react";
import { handleFieldErrors } from "~/lib/handle-field-errors";
import { type RoleItem } from "~/types/query/role/list";
import { useToast } from "~/components/ui/use-toast";
import {
  type UpdateUserForm,
  updateUserSchema,
} from "~/types/schema/user/update-user-schema";
import { InputField } from "~/components/form/input-field";
import { MultiSelectField } from "~/components/form/multi-select-field";
import { RoleBadge } from "~/components/role/role-badge";
import { CheckboxField } from "~/components/form/checkbox-field";
import { SubmitButton } from "~/components/form/submit-button";
import { Form } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Role } from "~/types/enum/Role";
import { ViewUserMail } from "~/components/user/view-user-mail";

export type UpdateUserFormProps = {
  userId: string;
  roles: RoleItem[];
  canViewActive?: boolean;
  canUpdateRole?: boolean;
  user: RouterOutputs["user"]["read"];
};

export function UpdateUserForm({
  roles,
  user,
  canUpdateRole,
  canViewActive,
}: UpdateUserFormProps) {
  const { mutate: updateUser, isPending } = api.user.update.useMutation();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map((role) => role.id) as Role[],
      active: user.active,
    },
    resolver: zodResolver(updateUserSchema),
  });

  const onSubmit = (data: UpdateUserForm) => {
    updateUser(
      { ...data, userId: user.id },
      {
        onSuccess: () => {
          toast({
            title: "User updated",
            description: `The user ${user.email} was updated with success`,
          });
        },
        onError: (error) => {
          handleFieldErrors(form, error);
        },
      },
    );
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
          <ViewUserMail email={user.email} />
          <div className="grid gap-2">
            <MultiSelectField
              name="roles"
              label="Roles"
              control={form.control}
              disabled={!canUpdateRole}
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
            {canViewActive && (
              <CheckboxField
                control={form.control}
                name="active"
                label="Active"
              />
            )}
          </div>
          <SubmitButton isSubmitting={isPending} className="w-full">
            Save
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
