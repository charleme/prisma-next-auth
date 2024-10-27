import { SimpleCard } from "~/components/molecule/card/simple-card";
import { UserPostDataTable } from "~/app/(logged)/user/[userId]/post/user-post-data-table";
import { api } from "~/trpc/server";

export default async function UserPostPage({
  params,
}: {
  params: { userId: string };
}) {
  const posts = await api.user.listPosts({ userId: params.userId });

  return (
    <SimpleCard
      title="User posts"
      description="This is a list of all posts posted by the user"
    >
      <UserPostDataTable posts={posts} />
    </SimpleCard>
  );
}
