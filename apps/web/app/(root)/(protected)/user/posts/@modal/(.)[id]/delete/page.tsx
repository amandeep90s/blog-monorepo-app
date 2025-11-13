"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import { Post } from "@/types/modelTypes";
import { deletePost, fetchPostById } from "@/lib/actions/post";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type InterceptorDeletePostPageProps = {
  params: Promise<{ id: string }>;
};

export default function InterceptorDeletePostPage(props: InterceptorDeletePostPageProps) {
  const params = use(props.params);
  const { id: postId } = params;
  const [isDeleting, setIsDeleting] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error("Failed to load post:", error);
        router.push(`/user/posts/${postId}/delete`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, router]);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deletePost(postId);
      router.push("/user/posts");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete the post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <AlertDialog open onOpenChange={handleClose}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Loading...</AlertDialogTitle>
            <AlertDialogDescription>Please wait while we load the post details.</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold">Delete Post</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. This will permanently delete your post and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {post && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <h4 className="mb-2 text-sm font-medium">Post to be deleted:</h4>
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
        )}

        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
