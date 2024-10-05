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

export default async function UpdatePostPage({
  params,
}: {
  params: { postId: string };
}) {
  try {
    //TODO: read post
    const post = await api.post.read({ id: params.postId });
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
            className={"w-full"}
          >
            <UpdatePostForm post={post} />
          </SimpleCard>
        ) : (
          <SimpleCard title={post.title} className={"w-full"}>
            <ReadPost post={post} />
          </SimpleCard>
        )}
        <div className="mt-4 flex justify-end">
          {canDeletePost && <RemovePostButton postId={post.id} />}
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
