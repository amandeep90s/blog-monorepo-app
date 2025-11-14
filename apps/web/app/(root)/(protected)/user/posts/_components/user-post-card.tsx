import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Heart, MessageCircle } from "lucide-react";

import { Post } from "@/types/modelTypes";
import { getRelativeTime, truncateText } from "@/lib/text-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { PostActions } from "./post-actions";

type UserPostCardProps = {
  post: Post;
};

export const UserPostCard = ({ post }: UserPostCardProps) => {
  // Convert createdAt to ISO string for time element
  const createdAtISO = typeof post.createdAt === "string" ? post.createdAt : post.createdAt.toISOString();

  return (
    <Card className="p-6">
      <div className="relative flex h-full flex-col justify-between">
        {/* Header with status badge and actions */}
        <div className="mb-4 flex items-start justify-between">
          <Badge variant={post.published ? "default" : "secondary"}>{post.published ? "Published" : "Draft"}</Badge>
          <PostActions postId={post.id} />
        </div>

        {/* Thumbnail */}
        <div className="bg-muted relative h-48 w-full overflow-hidden rounded-md">
          <Image
            src={post.thumbnail || "/no-image.png"}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, 50vw"
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 py-6">
          <h3 className="text-base font-medium" title={post.title}>
            {truncateText(post.title, 40)}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm" title={post.content}>
            {truncateText(post.content, 100)}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Calendar className="size-3.5" />
              <time dateTime={createdAtISO}>{getRelativeTime(post.createdAt)}</time>
            </div>

            {/* Likes and Comments count */}
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Heart className="size-3.5" />
                <span>{post._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="size-3.5" />
                <span>{post._count.comments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-dashed pt-6">
          {post.slug ? (
            <Button asChild variant="secondary" size="sm" className="gap-1 pr-2 shadow-none">
              <Link href={`/blog/${post.slug}`}>
                View Post
                <ChevronRight className="ml-0 size-3.5! opacity-50" />
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="gap-1 pr-2 shadow-none" disabled>
              No Slug Available
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="gap-1 shadow-none">
            <Link href={`/user/posts/${post.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
