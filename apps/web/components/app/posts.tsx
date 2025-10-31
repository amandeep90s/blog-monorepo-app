import { Post } from "@/types/modelTypes";

import PostCard from "./post-card";

type PostsProps = {
  posts: Post[];
  currentPage: number;
  totalPages: number;
};

export default function Posts({ posts, currentPage, totalPages }: PostsProps) {
  return (
    <section>
      <div className="pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">Latest Posts from Our Community</h2>
            <p className="text-muted-foreground mt-6">
              Discover insights, tutorials, and stories shared by developers from around the world.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
