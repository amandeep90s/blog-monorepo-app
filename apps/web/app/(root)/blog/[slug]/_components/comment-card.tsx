import { Calendar } from "lucide-react";

import { Comment } from "@/types/modelTypes";
import { getRelativeTime } from "@/lib/text-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type CommentCardProps = {
  comment: Comment;
};

export function CommentCard({ comment }: CommentCardProps) {
  // Convert createdAt to ISO string for time element
  const createdAtISO = typeof comment.createdAt === "string" ? comment.createdAt : comment.createdAt.toISOString();

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <div className="shrink-0">
          <Avatar className="size-8">
            <AvatarImage src={comment.author.avatar ?? undefined} alt={comment.author.name} />
            <AvatarFallback className="text-xs font-medium">{getInitials(comment.author.name)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{comment.author.name}</h4>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Calendar className="size-3" />
              <time dateTime={createdAtISO}>{getRelativeTime(comment.createdAt)}</time>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{comment.content}</p>
        </div>
      </div>
    </Card>
  );
}
