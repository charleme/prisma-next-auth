"use client";

import { Form } from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { TextAreaField } from "~/components/form/text-area-field";
import { SubmitButton } from "~/components/form/submit-button";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateCommentForm,
  createCommentFormSchema,
} from "~/types/schema/comment/create-delete-schema";
import { toast } from "~/components/ui/use-toast";

export type AddCommentFormProps = {
  postId: string;
};

export const AddCommentForm = ({ postId }: AddCommentFormProps) => {
  const form = useForm({
    resolver: zodResolver(createCommentFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate: createComment } = api.comment.create.useMutation();
  const tprcUtils = api.useUtils();

  const onSubmit = (data: CreateCommentForm) => {
    createComment(
      { postId, content: data.content },
      {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSuccess: async () => {
          form.reset();
          toast({
            title: "Comment added",
            description: "Comment has been added.",
          });
          await tprcUtils.post.getComments.invalidate({ id: postId });
        },
      },
    );
  };

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <TextAreaField
            control={form.control}
            label="Add your comment"
            name="content"
          />
          <div className="mt-4">
            <SubmitButton isSubmitting={false}>Submit</SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
};
