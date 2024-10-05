"use client";
import type { AppRouterOutput } from "~/server/api/root";

type ReadPostProps = {
  post: AppRouterOutput["post"]["read"];
};

export const ReadPost = ({ post }: ReadPostProps) => {
  return (
    <>
      <div>{post.content}</div>
      <p className="mt-4 text-sm text-muted-foreground">
        <div>
          <div>Authored by: {post.author?.fullName}</div>
          <div>
            Created at: {post.createdAt.toLocaleDateString()}{" "}
            {post.createdAt.toLocaleTimeString()}
          </div>
          <div>
            Updated at: {post.updatedAt.toLocaleDateString()}{" "}
            {post.createdAt.toLocaleTimeString()}
          </div>
        </div>
      </p>
    </>
  );
};
