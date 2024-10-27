"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { SimpleAlertDialog } from "~/components/molecule/dialog/simple-alert-dialog";

type RemovePostProps = {
  postId: string;
};

export const RemovePostButton = ({ postId }: RemovePostProps) => {
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
    <SimpleAlertDialog
      title="Are you sure you want to delete this user?"
      description="This will permanently delete the post. This action cannot be undone."
      onConfirm={() => submitDelete()}
    >
      <Button disabled={isPending} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete the post
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </SimpleAlertDialog>
  );
};
