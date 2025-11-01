import Image from "next/image";
import { Calendar } from "lucide-react";

import { fetchPostBySlug } from "@/lib/actions/post";
import { getRelativeTime } from "@/lib/text-utils";

import SanitizedContent from "./_components/sanitized-content";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  // Convert createdAt to ISO string for time element
  const createdAtISO = typeof post.createdAt === "string" ? post.createdAt : post.createdAt.toISOString();

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="w-full overflow-hidden rounded-(--radius)">
          <Image
            className="h-100 w-full object-cover transition-all duration-500 hover:scale-105"
            src={post.thumbnail ?? "/no-media.png"}
            alt={post.title}
            height="300"
            width="300"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col gap-6 md:gap-12">
          <h2 className="text-4xl font-medium">{post.title}</h2>
          <div className="space-y-6">
            <SanitizedContent htmlContent={post.content} />

            <blockquote className="border-l-4 pl-4">
              <div className="mt-6 flex items-center justify-between space-y-3">
                <span className="m-0 block text-sm font-medium">Posted By: {post.author.name}</span>
                <div className="text-muted-foreground m-0 flex items-center gap-1.5 text-xs">
                  <Calendar className="size-3.5" />
                  <time dateTime={createdAtISO}>Published {getRelativeTime(post.createdAt)}</time>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
