import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchPostById } from "@/lib/actions/post";

import { UpdatePostContainer } from "./_components/update-post-container";

type UpdatePostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: UpdatePostPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await fetchPostById(id);
    return {
      title: `Edit: ${post.title}`,
      description: `Edit your blog post: ${post.title}`,
    };
  } catch {
    return {
      title: "Edit Post",
      description: "Edit your blog post",
    };
  }
}

export default async function UpdatePostPage({ params }: UpdatePostPageProps) {
  const { id } = await params;

  let post;
  try {
    post = await fetchPostById(id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold md:text-4xl">Edit Post</h1>
        <p className="text-muted-foreground mt-2">Update your post content and settings.</p>
      </div>
      <Suspense
        fallback={
          <div className="bg-card rounded-lg border p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-32 rounded bg-gray-200"></div>
            </div>
          </div>
        }
      >
        <UpdatePostContainer post={post} />
      </Suspense>
    </div>
  );
}
