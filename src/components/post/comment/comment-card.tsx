import { Card, CardContent } from "~/components/ui/card";
import { PostDetail } from "~/components/post/post-detail";
import { type AppRouterOutput } from "~/server/api/root";
import { SubmitButton } from "~/components/form/submit-button";
import { deleteCommentClientGuard } from "~/server/guard/comment/delete-comment-guard";
import { useMe } from "~/hooks/use-me";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

export type CommentDetailProps = {
  comment: AppRouterOutput["post"]["getComments"]["comments"][number];
};

export const CommentCard = ({ comment }: CommentDetailProps) => {
  const { user } = useMe();
  const canDelete = user && deleteCommentClientGuard(user, comment);

  const { mutate: deleteComment, isPending } = api.comment.delete.useMutation();
  const tprcUtils = api.useUtils();

  const submitDelete = () => {
    deleteComment(
      { commentId: comment.id },
      {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSuccess: async () => {
          toast({
            title: "Comment deleted",
            description: "Comment has been deleted.",
          });
          await tprcUtils.post.getComments.invalidate();
        },
      },
    );
  };

  return (
    <Card key={comment.id}>
      <CardContent className="mt-6">
        <div>{comment.content}</div>
        <div className="flex items-end justify-between">
          <PostDetail post={comment} />
          <div>
            {canDelete && (
              <SubmitButton
                onClick={submitDelete}
                isSubmitting={isPending}
                variant="destructive"
              >
                Delete
              </SubmitButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
