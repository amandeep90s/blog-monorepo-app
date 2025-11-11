import Link from "next/link";
import { FileTextIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const NoPost = () => {
  return (
    <Empty className="border-muted-foreground/25 h-full min-h-[calc(100vh-22rem)]">
      <EmptyContent>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>No posts yet</EmptyTitle>
          <EmptyDescription>
            Get started by creating your first blog post. Share your thoughts, ideas, and expertise with the world.
          </EmptyDescription>
        </EmptyHeader>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/user/create-post" className="flex items-center gap-2">
            <PencilIcon className="size-4" />
            Write Your First Post
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};
