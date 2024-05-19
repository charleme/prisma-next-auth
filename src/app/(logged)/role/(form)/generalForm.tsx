"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { InputField } from "~/components/form/input-field";
import { useForm } from "react-hook-form";
import { SubmitButton } from "~/components/form/submit-button";
import {
  type RoleGeneralFormData,
  roleGeneralFormSchema,
} from "~/types/schema/role/roleGeneralForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { handleFieldErrors } from "~/lib/handleFieldErrors";

export const GeneralForm = ({
  defaultValue,
  readOnly,
}: {
  defaultValue?: RoleGeneralFormData & { id: number };
  readOnly?: boolean;
}) => {
  const isCreation = !defaultValue;

  const { toast } = useToast();
  const form = useForm({
    defaultValues: defaultValue ?? {
      name: "",
      description: "",
    },
    resolver: zodResolver(roleGeneralFormSchema),
  });
  const router = useRouter();
  const { mutate: createRole, isPending: isCreatePending } =
    api.role.create.useMutation();
  const { mutate: updateRole, isPending: isUpdatePending } =
    api.role.update.useMutation();

  const onSubmit = (data: RoleGeneralFormData) => {
    isCreation
      ? createRole(data, {
          onSuccess: (value) => {
            router.push(`/role/${value.id}`);
            toast({ title: "Role created successfully !" });
          },
          onError: (error) => {
            handleFieldErrors(form, error);
          },
        })
      : updateRole(
          { ...data, id: defaultValue.id },
          {
            onSuccess: () => {
              toast({ title: "Role updated successfully !" });
            },
            onError: (error) => {
              handleFieldErrors(form, error);
            },
          },
        );
  };

  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <Form {...form}>
          <form>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Used to identify your role.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <InputField
                  label={"Role Name"}
                  control={form.control}
                  name={"name"}
                  inputProps={{ readOnly }}
                />
              </div>
              <div>
                <InputField
                  label={"Description"}
                  control={form.control}
                  name={"description"}
                  inputProps={{ readOnly }}
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SubmitButton
                onClick={form.handleSubmit(onSubmit)}
                isSubmitting={isCreatePending || isUpdatePending}
                disabled={readOnly}
              >
                Save
              </SubmitButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
