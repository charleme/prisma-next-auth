import { SimpleCard } from "~/components/molecule/card/simple-card";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { UpdatePostForm } from "~/components/post/update-post-form";

export default async function UpdatePostPage({
  params,
}: {
  params: { postId: string };
}) {
  try {
    const post = await api.post.read({ id: params.postId });

    return (
      <SimpleCard
        title={"Update a post"}
        description={"Enter post information to update a post"}
        className={"w-full"}
      >
        <UpdatePostForm post={post} />
      </SimpleCard>
    );
  } catch (error) {
    return notFound();
  }
}
