"use client";
import type { AppRouterOutput } from "~/server/api/root";
import { PostDetail } from "~/components/post/post-detail";

type ReadPostProps = {
  post: AppRouterOutput["post"]["read"];
};

export const ReadPost = ({ post }: ReadPostProps) => {
  return (
    <>
      <div>{post.content}</div>
      <PostDetail post={post} />
    </>
  );
};
