type PostDetailProps = {
  post: {
    author: {
      fullName: string;
    };
    createdAt: Date;
    updatedAt?: Date;
  };
};

export const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <div className="mt-4 text-sm text-muted-foreground">
      <div>
        <div>Authored by: {post.author.fullName}</div>
        <div>
          Created at: {post.createdAt.toLocaleDateString()}{" "}
          {post.createdAt.toLocaleTimeString()}
        </div>
        {post.updatedAt && (
          <div>
            Updated at: {post.updatedAt.toLocaleDateString()}{" "}
            {post.updatedAt.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
