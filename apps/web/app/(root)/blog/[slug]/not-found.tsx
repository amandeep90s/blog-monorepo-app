import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BlogPostNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <FileQuestion className="text-muted-foreground h-10 w-10" />
        </div>

        <h1 className="mb-3 text-2xl font-bold tracking-tight">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn&apos;t find the blog post you&apos;re looking for. It may have been moved, deleted, or the
          URL might be incorrect.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/#posts">Browse Posts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
