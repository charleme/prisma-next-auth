import Dashboard from "~/components/dashboard";
import { api } from "~/trpc/server";

export default async function LoginPage() {
  const [
    userCount,
    postEvolution,
    commentEvolution,
    postCountPerDay,
    commentCountPerDay,
  ] = await Promise.all([
    api.user.userCount(),
    api.post.getPostEvolution(),
    api.comment.getCommentEvolution(),
    api.post.getPostCountPerDay(),
    api.comment.getCommentCountPerDay(),
  ]);
  return (
    <Dashboard
      userCount={userCount}
      postEvolution={postEvolution}
      commentEvolution={commentEvolution}
      postCountPerDay={postCountPerDay}
      commentCountPerDay={commentCountPerDay}
    />
  );
}
