"use client";

import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { CommentCard } from "~/components/post/comment/comment-card";
import { type AppRouterOutput } from "~/server/api/root";

type PostCommentListProps = {
  postId: string;
  initialComments: AppRouterOutput["post"]["getComments"];
};

export const PostCommentList = ({
  postId,
  initialComments,
}: PostCommentListProps) => {
  const { data: post, isPending } = api.post.getComments.useQuery(
    {
      id: postId,
    },
    {
      initialData: initialComments,
    },
  );
  const comments = post?.comments;
  const hasComments = comments && comments.length > 0;

  if (!post || isPending) {
    return (
      <div className="my-8 flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Loading comments
      </div>
    );
  }

  if (!hasComments) {
    return <div className="my-8 text-center font-medium">No comments yet</div>;
  }

  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} id={`comment-${comment.id}`}>
          <CommentCard comment={comment} />
        </div>
      ))}
    </div>
  );
};
