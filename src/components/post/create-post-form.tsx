"use client";
import { useForm } from "react-hook-form";
import {
  type CreatePost,
  createPostSchema,
} from "~/types/schema/post/create-post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { PostFormFields } from "~/components/post/post-form-fields";
import type { AppRouterOutput } from "~/server/api/root";

type DefaultPost = AppRouterOutput["post"]["read"];

export const CreatePostForm = () => {
  const { mutate: createPost, isPending: isPendingCreatePost } =
    api.post.create.useMutation();

  const defaultPost = {
    id: "",
    author: { fullName: "" },
    authorId: "",
    title: "",
    content: "",
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  } satisfies DefaultPost as DefaultPost;

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: defaultPost,
  });

  const router = useRouter();

  const onSubmit = (input: CreatePost) => {
    return createPost(input, {
      onSuccess: () => {
        toast({
          title: "Post created",
          description: `The post "${input.title}" was created with success`,
        });
        router.push(`/post`);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <PostFormFields form={form} isPending={isPendingCreatePost} />
      </form>
    </Form>
  );
};
