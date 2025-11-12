import Link from "next/link";
import { Plus } from "lucide-react";

import { Post } from "@/types/modelTypes";
import { Button } from "@/components/ui/button";
import PostPagination from "@/components/app/post-pagination";

import { UserPostCard } from "./user-post-card";

type PostListProps = {
  posts: Post[];
  currentPage: number;
  totalPages: number;
};

export const PostList = ({ posts, currentPage, totalPages }: PostListProps) => {
  return (
    <section className="pb-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">My Posts</h1>
            <p className="text-muted-foreground mt-2">
              Manage your blog posts, track engagement, and create new content.
            </p>
          </div>
          <Button asChild>
            <Link href="/user/create-post" className="flex items-center gap-2">
              <Plus className="size-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Posts Stats */}
        <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
          <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* Posts Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <UserPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <PostPagination currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </section>
  );
};
