import { SimpleAlertDialog } from "~/components/molecule/dialog/simple-alert-dialog";
import { SubmitButton } from "~/components/form/submit-button";

type DeleteCommentConfirmDialogProps = {
  onConfirm: () => void;
  isPending: boolean;
};

export const DeleteCommentConfirmDialog = ({
  onConfirm,
  isPending,
}: DeleteCommentConfirmDialogProps) => {
  return (
    <SimpleAlertDialog
      title="Are you sure you want to delete this comment?"
      description="
        This will permanently delete the comment. This action cannot be undone.
      "
      onConfirm={onConfirm}
    >
      <SubmitButton variant="destructive" isSubmitting={isPending}>
        Delete
      </SubmitButton>
    </SimpleAlertDialog>
  );
};
