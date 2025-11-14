import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";

import { deletePost, fetchPostById } from "@/lib/actions/post";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeletePostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeletePostPage(props: DeletePostPageProps) {
  const params = await props.params;

  let post;
  let error;

  try {
    post = await fetchPostById(params.id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load post";
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
                <AlertTriangle className="text-destructive h-5 w-5" />
              </div>
              <CardTitle className="text-destructive">Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{error || "Post not found"}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/user/posts" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formAction = async () => {
    "use server";
    try {
      await deletePost(params.id);
    } catch (error) {
      console.error("Failed to delete post:", error);
      throw error;
    }
    redirect("/user/posts");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <CardTitle className="text-destructive">Delete Post</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            This action cannot be undone. This will permanently delete your post and remove all associated data.
          </p>

          {/* Post Preview */}
          <div className="bg-muted/50 rounded-lg border p-4">
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">Post to be deleted:</h4>
            <p className="text-base font-semibold">{post.title}</p>
            <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
              <span
                className={`rounded-md px-2 py-1 ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {post.published ? "Published" : "Draft"}
              </span>
              {post._count && (
                <>
                  <span>{post._count.likes} likes</span>
                  <span>{post._count.comments} comments</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <form action={formAction} className="flex flex-col gap-3">
            <Button type="submit" variant="destructive" className="w-full">
              Delete Post
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/user/posts" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
