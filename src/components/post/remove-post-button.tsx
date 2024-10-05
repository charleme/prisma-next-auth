"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { DeletePostConfirmDialog } from "~/components/post/delete-post-confirm-dialog";

type UpdatePostProps = {
  postId: string;
};

export const RemovePostButton = ({ postId }: UpdatePostProps) => {
  const { mutate: deletePost, isPending } = api.post.delete.useMutation();
  const router = useRouter();

  const submitDelete = () => {
    deletePost(
      { postId: postId },
      {
        onSuccess: () => {
          router.push("/post");
        },
      },
    );
  };

  return (
    <DeletePostConfirmDialog onConfirm={() => submitDelete()}>
      <Button disabled={isPending} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete the post
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </DeletePostConfirmDialog>
  );
};
