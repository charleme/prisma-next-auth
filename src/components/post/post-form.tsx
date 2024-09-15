"use client";
import { useForm } from "react-hook-form";
import {
  type CreatePost,
  createPostSchema,
} from "~/types/schema/post/create-post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { InputField } from "~/components/form/input-field";
import { CheckboxField } from "~/components/form/checkbox-field";
import { SubmitButton } from "~/components/form/submit-button";
import { TextAreaField } from "~/components/form/text-area-field";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

export const PostForm = () => {
  const { mutate: createPost, isPending: isPendingCreatePost } =
    api.post.create.useMutation();
  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      published: false,
    },
  });

  const onSubmit = (input: CreatePost) => {
    createPost(input, {
      onSuccess: () => {
        toast({
          title: "Post created",
          description: `The post "${input.title}" was created with success`,
        });
        //TODO redirect to the post page
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
        <SubmitButton isSubmitting={isPendingCreatePost}>Save</SubmitButton>
      </form>
    </Form>
  );
};
