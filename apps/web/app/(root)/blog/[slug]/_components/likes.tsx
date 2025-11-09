"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";

import { getPostLikeData, likePost, unlikePost } from "@/lib/actions/like";
import { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LikesProps = {
  postId: string;
  user?: SessionUser;
};

export const Likes = ({ postId, user }: LikesProps) => {
  const {
    data,
    refetch: refetchPostLikeData,
    isLoading,
  } = useQuery({
    queryKey: ["GET_POST_LIKE_DATA", postId, user?.id || "anonymous"],
    queryFn: async () => await getPostLikeData(postId),
    retry: 1,
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      refetchPostLikeData();
      toast.success("Post liked!");
    },
    onError: () => {
      toast.error("Failed to like post", {
        description: "Please try again later",
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      refetchPostLikeData();
      toast.success("Like removed");
    },
    onError: () => {
      toast.error("Failed to remove like", {
        description: "Please try again later",
      });
    },
  });

  const handleLikeToggle = () => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    if (data?.userLikedPost) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="animate-pulse">
          <HeartIcon className="h-6 w-6 text-gray-300" />
        </div>
        <span className="text-muted-foreground text-sm">Loading likes...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLikeToggle}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 transition-all hover:scale-105",
          data?.userLikedPost ? "text-rose-600 hover:text-rose-700" : "text-gray-600 hover:text-rose-600"
        )}
      >
        {isPending ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <HeartIcon
            className={cn(
              "h-6 w-6 transition-all",
              data?.userLikedPost ? "fill-current text-rose-600" : "text-current"
            )}
          />
        )}
        <span className="text-sm font-medium">
          {data?.likeCount || 0} {data?.likeCount === 1 ? "Like" : "Likes"}
        </span>
      </Button>

      {!user && <span className="text-muted-foreground text-xs">(Login to like posts)</span>}
    </div>
  );
};
