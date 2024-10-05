"use client";
import { type UseFormReturn } from "react-hook-form";
import { InputField } from "~/components/form/input-field";
import { CheckboxField } from "~/components/form/checkbox-field";
import { SubmitButton } from "~/components/form/submit-button";
import { TextAreaField } from "~/components/form/text-area-field";
import { type UpdatePostForm } from "~/types/schema/post/update-post-schema";

export type PostFormProps = {
  form: UseFormReturn<UpdatePostForm>;
  isPending: boolean;
};

export const PostFormFields = ({ form, isPending }: PostFormProps) => {
  return (
    <>
      <div className="mb-4">
        <InputField
          control={form.control}
          name={"title"}
          label={"Title"}
          inputProps={{
            className: "md:w-full w-1/2",
          }}
        />
      </div>
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
