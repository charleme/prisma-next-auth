import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PostDataTable } from "~/app/(logged)/post/post-data-table";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export default function PostListPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>View the posts of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <PostDataTable>
            <Button size="sm" className="ml-auto h-8">
              <Plus className="mr-2 h-4 w-4 " />
              Create Post
            </Button>
          </PostDataTable>
        </CardContent>
      </Card>
    </div>
  );
}
