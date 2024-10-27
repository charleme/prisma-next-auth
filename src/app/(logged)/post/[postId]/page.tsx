import { SimpleCard } from "~/components/molecule/card/simple-card";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { UpdatePostForm } from "~/components/post/update-post-form";
import { RemovePostButton } from "~/components/post/remove-post-button";
import { updatePostClientGuard } from "~/server/guard/post/update-post-guard";
import { deletePostClientGuard } from "~/server/guard/post/delete-post-guard";
import { getAuthUser } from "~/server/auth";
import { readPostClientGuard } from "~/server/guard/post/read-post-guard";
import { ReadPost } from "~/components/post/read-post";
import { PostCommentList } from "~/components/post/comment/post-comment-list";
import { AddCommentForm } from "~/components/post/comment/add-comment-form";

export default async function UpdatePostPage({
  params,
}: {
  params: { postId: string };
}) {
  try {
    const [post, comments] = await Promise.all([
      api.post.read({ id: params.postId }),
      api.post.getComments({
        id: params.postId,
      }),
    ]);
    const { user } = await getAuthUser();
    const canReadPost = readPostClientGuard(user, post);

    if (!canReadPost) {
      throw new Error("You don't have permission to read this post");
    }

    const canUpdatePost = updatePostClientGuard(user, post);
    const canDeletePost = deletePostClientGuard(user, post);

    return (
      <div>
        {canUpdatePost ? (
          <SimpleCard
            title={"Update a post"}
            description={"Enter post information to update a post"}
          >
            <UpdatePostForm post={post} />
          </SimpleCard>
        ) : (
          <SimpleCard title={post.title}>
            <ReadPost post={post} />
          </SimpleCard>
        )}
        <SimpleCard title={`Comments`} className="my-4">
          <PostCommentList postId={post.id} initialComments={comments} />
          <AddCommentForm postId={post.id} />
        </SimpleCard>
        <div className="flex justify-end">
          {canDeletePost && <RemovePostButton postId={post.id} />}
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
