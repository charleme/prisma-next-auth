"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { PostFormFields } from "~/components/post/post-form-fields";
import { type AppRouterOutput } from "~/server/api/root";
import {
  type UpdatePost,
  updatePostSchema,
} from "~/types/schema/post/update-post-schema";

type UpdatePostProps = {
  post: AppRouterOutput["post"]["read"];
};

export const UpdatePostForm = ({ post }: UpdatePostProps) => {
  const { mutate: updatePost, isPending: isPending } =
    api.post.update.useMutation();

  const form = useForm({
    resolver: zodResolver(updatePostSchema),
    defaultValues: post,
  });

  const onSubmit = (input: UpdatePost) => {
    return updatePost(input, {
      onSuccess: () => {
        toast({
          title: "Post updated",
          description: `The post "${input.title}" was updated with success`,
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <PostFormFields form={form} isPending={isPending} />
      </form>
    </Form>
  );
};