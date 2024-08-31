import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PostDataTable } from "~/app/(logged)/post/post-data-table";

export default function PostListPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>View the posts of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <PostDataTable />
        </CardContent>
      </Card>
    </div>
  );
}
