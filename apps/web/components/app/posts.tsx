import { Post } from "@/types/modelTypes";

import PostCard from "./post-card";

type PostsProps = {
  posts: Post[];
};

export default function Posts({ posts }: PostsProps) {
  return (
    <section>
      <div className="pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">Integrate with your favorite tools</h2>
            <p className="text-muted-foreground mt-6">
              Connect seamlessly with popular platforms and services to enhance your workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <PostCard
              title="Google Gemini"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />

            <PostCard
              title="Replit"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />

            <PostCard
              title="Magic UI"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />

            <PostCard
              title="VSCodium"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />

            <PostCard
              title="MediaWiki"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />

            <PostCard
              title="Google PaLM"
              description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
