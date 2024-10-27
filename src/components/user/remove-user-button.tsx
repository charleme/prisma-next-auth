"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { SimpleAlertDialog } from "~/components/molecule/dialog/simple-alert-dialog";

type RemoveUserProps = {
  userId: string;
};

export const RemoveUserButton = ({ userId }: RemoveUserProps) => {
  const { mutate: deleteUser, isPending } = api.user.delete.useMutation();
  const router = useRouter();

  const submitDelete = () => {
    deleteUser(
      { userId: userId },
      {
        onSuccess: () => {
          router.push("/user");
        },
      },
    );
  };

  return (
    <SimpleAlertDialog
      title="Are you sure you want to delete this user?"
      description="
        This will permanently delete the user. This action cannot be undone.
      "
      onConfirm={() => submitDelete()}
    >
      <Button disabled={isPending} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete the user
        {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </SimpleAlertDialog>
  );
};
