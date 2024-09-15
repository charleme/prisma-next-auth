import { SimpleCard } from "~/components/molecule/card/simple-card";
import { PostForm } from "~/components/post/post-form";

export default async function CreatePostPage() {
  return (
    <SimpleCard
      title={"Create a post"}
      description={"Enter post information to create a post"}
      className={"w-full"}
    >
      <PostForm />
    </SimpleCard>
  );
}
