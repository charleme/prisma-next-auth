import { UserCommentDataTable } from "~/app/(logged)/user/[userId]/comment/user-comment-data-table";
import { SimpleCard } from "~/components/molecule/card/simple-card";
import { api } from "~/trpc/server";

export default async function UserCommentPage({
  params,
}: {
  params: { userId: string };
}) {
  const comments = await api.user.listComments({ userId: params.userId });

  return (
    <SimpleCard
      title="User comments"
      description="This is a list of all comments posted by the user"
    >
      <UserCommentDataTable comments={comments} />
    </SimpleCard>
  );
}
