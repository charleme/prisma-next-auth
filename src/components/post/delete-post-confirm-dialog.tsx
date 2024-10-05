import { SimpleAlertDialog } from "~/components/molecule/dialog/simple-alert-dialog";
import { type ReactNode } from "react";

type DeleteCommentConfirmDialogProps = {
  onConfirm: () => void;
  children: ReactNode;
};

export const DeletePostConfirmDialog = ({
  onConfirm,
  children,
}: DeleteCommentConfirmDialogProps) => {
  return (
    <SimpleAlertDialog
      title="Are you sure you want to delete this post?"
      description="
        This will permanently delete the post. This action cannot be undone.
      "
      onConfirm={onConfirm}
    >
      {children}
    </SimpleAlertDialog>
  );
};
