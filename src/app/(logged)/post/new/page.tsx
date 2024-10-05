import { SimpleCard } from "~/components/molecule/card/simple-card";
import { CreatePostForm } from "~/components/post/create-post-form";

export default async function CreatePostPage() {
  return (
    <SimpleCard
      title={"Create a post"}
      description={"Enter post information to create a post"}
      className={"w-full"}
    >
      <CreatePostForm />
    </SimpleCard>
  );
}
