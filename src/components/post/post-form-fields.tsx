"use client";
import { type UseFormReturn } from "react-hook-form";
import { InputField } from "~/components/form/input-field";
import { CheckboxField } from "~/components/form/checkbox-field";
import { SubmitButton } from "~/components/form/submit-button";
import { TextAreaField } from "~/components/form/text-area-field";

export type PostFormProps = {
  form: UseFormReturn<{
    id: string;
    title: string;
    content: string;
    published: boolean;
  }>;
  isPending: boolean;
};

export const PostFormFields = ({ form, isPending }: PostFormProps) => {
  return (
    <>
      <InputField
        control={form.control}
        name={"title"}
        label={"Title"}
        inputProps={{
          className: "md:w-full w-1/2",
        }}
      />
      <TextAreaField
        control={form.control}
        name={"content"}
        label={"Content"}
      />
      <CheckboxField
        control={form.control}
        name={"published"}
        label={"Publish the post"}
      />
      <SubmitButton isSubmitting={isPending}>Save</SubmitButton>
    </>
  );
};
